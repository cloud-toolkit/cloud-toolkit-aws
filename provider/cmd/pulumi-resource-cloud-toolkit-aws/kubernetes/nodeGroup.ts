import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import {
  NodeGroupArgs,
  defaultNodeGroupArgs,
  defaultNodeGroupType,
} from "./nodeGroupArgs";

export { NodeGroupArgs };

/**
 * NodeGroup is a component that deploy a Node Group for a Kubernetes cluster.
 */
export class NodeGroup extends pulumi.ComponentResource {
  private name: string;
  private args: NodeGroupArgs;

  /**
   * The IAM Role assumed by the EKS Nodes.
   */
  public readonly role: aws.iam.Role;

  /**
   * The list of IAM Role Policy Attachment used to attach IAM Roles to the EKS Node Group.
   */
  public readonly rolePolicyAttachments: aws.iam.RolePolicyAttachment[] = [];

  /**
   * The EC2 Launch Template used to provision nodes.
   */
  public readonly launchTemplate: aws.ec2.LaunchTemplate;

  /**
   * The EKS Node Group.
   */
  public readonly nodeGroup: aws.eks.NodeGroup;

  constructor(
    name: string,
    args: NodeGroupArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloudToolkit:aws:kubernetes:NodeGroup", name, {}, opts);
    this.name = name;
    this.args = this.validateConfig(args);

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    this.role = this.setupRole(resourceOpts);
    this.rolePolicyAttachments = this.setupRolePolicyAttachments(resourceOpts);
    this.launchTemplate = this.setupLaunchTemplate(resourceOpts);

    const nodeGroupOpts = pulumi.mergeOptions(resourceOpts, {
      parent: this,
      dependsOn: [this.role, ...this.rolePolicyAttachments],
    });
    this.nodeGroup = this.setupNodeGroup(nodeGroupOpts);
  }

  validateConfig(a: NodeGroupArgs): NodeGroupArgs {
    const args = defaultsDeep({ ...a }, defaultNodeGroupArgs);
    return args;
  }

  setupRole(opts?: pulumi.ResourceOptions): aws.iam.Role {
    const policyDocument = aws.iam.getPolicyDocumentOutput({
      statements: [
        {
          actions: ["sts:AssumeRole"],
          effect: "Allow",
          principals: [
            {
              type: "Service",
              identifiers: ["ec2.amazonaws.com"],
            },
          ],
        },
      ],
    });
    const role = new aws.iam.Role(
      `${this.name}`,
      {
        name: `${this.name}`,
        assumeRolePolicy: policyDocument.json,
      },
      opts
    );

    return role;
  }

  setupRolePolicyAttachments(
    opts?: pulumi.ResourceOptions
  ): aws.iam.RolePolicyAttachment[] {
    const list: aws.iam.RolePolicyAttachment[] = [];

    list.push(
      new aws.iam.RolePolicyAttachment(
        `${this.name}-nodePolicy`,
        {
          policyArn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
          role: this.role.name,
        },
        opts
      )
    );

    list.push(
      new aws.iam.RolePolicyAttachment(
        `${this.name}-cniPolicy`,
        {
          policyArn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
          role: this.role.name,
        },
        opts
      )
    );

    list.push(
      new aws.iam.RolePolicyAttachment(
        `${this.name}-ecr-readonly`,
        {
          policyArn:
            "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
          role: this.role.name,
        },
        opts
      )
    );

    return list;
  }

  setupLaunchTemplate(opts?: pulumi.ResourceOptions): aws.ec2.LaunchTemplate {
    return new aws.ec2.LaunchTemplate(
      `${this.name}`,
      {
        networkInterfaces: [
          {
            associatePublicIpAddress: "true",
            deleteOnTermination: "true",
          },
        ],
        monitoring: {
          enabled: true,
        },
        imageId: this.getAmiId(),
        userData: this.getUserData(opts),
      },
      opts
    );
  }

  setupNodeGroup(opts?: pulumi.ResourceOptions): aws.eks.NodeGroup {
    if (this.args.instanceType === undefined) {
      throw Error("NodeGroup instanceType must be set");
    }

    return new aws.eks.NodeGroup(
      `${this.name}`,
      {
        clusterName: this.args.clusterName,
        nodeGroupNamePrefix: `${this.name}-`,
        subnetIds: this.args.subnetIds,
        nodeRoleArn: this.role.arn,
        instanceTypes: [this.args.instanceType],
        launchTemplate: {
          version: pulumi.interpolate`${this.launchTemplate.latestVersion}`,
          id: this.launchTemplate.id,
        },
        scalingConfig: {
          desiredSize: this.args.minCount || defaultNodeGroupArgs.minCount,
          maxSize: this.args.maxCount || defaultNodeGroupArgs.minCount,
          minSize: this.args.minCount || defaultNodeGroupArgs.maxCount,
        },
      },
      {
        ...opts,
        ignoreChanges: ["scalingConfig.desiredSize"],
      }
    );
  }

  getAmiId(): pulumi.Output<string> {
    const amiType = "amazon-linux-2";
    const parameterName = `/aws/service/eks/optimized-ami/${this.args.clusterVersion}/${amiType}/recommended/image_id`;
    const amiId = pulumi.output(
      aws.ssm.getParameter(
        { name: parameterName },
        { parent: this, async: true }
      )
    ).value;

    return amiId;
  }

  getUserData(opts?: pulumi.ResourceOptions): pulumi.Output<string> {
    const maxPods = this.getMaxPod(opts);
    const userData = pulumi
      .all([
        this.args.clusterName,
        this.args.clusterEndpoint,
        this.args.clusterCA,
        maxPods,
      ])
      .apply(([clusterName, clusterEndpoint, clusterCa, maxPods]) => {
        const bootstrapExtraArgs = ` --use-max-pods false --kubelet-extra-args '--max-pods=${maxPods}'`;
        return Buffer.from(
          `#!/bin/bash
          set -xe
          /etc/eks/bootstrap.sh --apiserver-endpoint "${clusterEndpoint}" --b64-cluster-ca "${clusterCa}" "${clusterName}" ${bootstrapExtraArgs}
          `
        ).toString("base64");
      });

    return userData;
  }

  getMaxPod(opts?: pulumi.ResourceOptions): pulumi.Output<number> {
    const instanceType = aws.ec2.getInstanceTypeOutput(
      {
        instanceType: this.args.instanceType || defaultNodeGroupType,
      },
      opts
    );

    // Static values
    const ipsPerPrefix = 16;
    const maxPodsPerCilingForLowCpu = 110;
    const maxPodsPerCilingForHighCpu = 250;

    // Values from InstanceType
    const maxEnis = instanceType.maximumNetworkInterfaces;
    const maxEnisIps = instanceType.maximumIpv4AddressesPerInterface;
    const hypervisor = instanceType.hypervisor;
    const maxCpus = instanceType.defaultVcpus;

    // Values from configuration
    const enisForPods = maxEnis;

    return pulumi
      .all([hypervisor, maxEnis, maxEnisIps, enisForPods, maxCpus])
      .apply(([hypervisor, maxEnis, maxEnisIps, enisForPods, maxCpus]) => {
        const maxPodsPerConfiguration =
          hypervisor == "nitro"
            ? enisForPods * ((maxEnisIps - 1) * ipsPerPrefix) + 2
            : enisForPods * (maxEnisIps - 1) + 2;

        if (maxCpus < 30) {
          return Math.min(maxPodsPerCilingForLowCpu, maxPodsPerConfiguration);
        } else {
          return Math.min(maxPodsPerCilingForHighCpu, maxPodsPerConfiguration);
        }
      });
  }
}

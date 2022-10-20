import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import * as tls from "@pulumi/tls";
import defaultsDeep from "lodash.defaultsdeep";
import { NodeGroup } from "./nodeGroup";
import { ClusterAddons } from "./clusterAddons";
import {
  ClusterArgs,
  ClusterSubnetsType,
  defaultVersion,
  defaultClusterArgs,
  defaultNodeGroup,
} from "./clusterArgs";

export { ClusterArgs, ClusterSubnetsType };

/**
 * Cluster is a component that deploys a production-ready Kubernetes cluster. It setups the AWS IAM and netwokring, as well many Kubernetes services to run application in production.
 */
export class Cluster extends pulumi.ComponentResource {
  private config: ClusterArgs;
  private name: string;

  /**
   * EC2 Tags used for provisioning Load Balancers.
   */
  public readonly subnetTags: aws.ec2.Tag[] = [];

  /**
   * The IAM Role to provision EKS cluster.
   */
  public readonly provisionerRole: aws.iam.Role;

  /**
   * The IAM Role Polity to provision EKS cluster.
   */
  public readonly provisionerRolePolicy: aws.iam.RolePolicy;

  /**
   * The Provider to provision EKS cluster.
   */
  public readonly provisionerProvider: aws.Provider;

  /**
   * The IAM Role assumed by the EKS Cluster.
   */
  public readonly role: aws.iam.Role;

  /**
   * The IAM Role Policy Attachment to assign the IAM Policies to the IAM Role.
   */
  public readonly rolePolicyAttachment: aws.iam.RolePolicyAttachment;

  /**
   * The Security Group associated to the EKS Cluster.
   */
  public readonly securityGroup: aws.ec2.SecurityGroup;

  /**
   * The EKS Cluster.
   */
  public readonly cluster: aws.eks.Cluster;

  /**
   * The kubeconfig content for this cluster.
   */
  public readonly kubeconfig: pulumi.Output<string>;

  /**
   * The Kubernetes provider for this cluster.
   */
  public readonly provider: kubernetes.Provider;

  /**
   * The Node Groups associated to the cluster.
   */
  public readonly nodeGroups: NodeGroup[];

  /**
   * The default OIDC Provider.
   */
  public readonly defaultOidcProvider?: aws.iam.OpenIdConnectProvider;

  /**
   * The VPC CNI Chart installed in the cluster.
   */
  public readonly cniChart: kubernetes.helm.v3.Release;

  /**
   * The VPC CNI Chart installed in the cluster.
   */
  public readonly clusterAddons?: ClusterAddons;

  /**
   * The DNS Zone used for the cluster domain.
   */
  public readonly dnsZone?: aws.route53.Zone;

  /**
   * The VPC CNI Chart installed in the cluster.
   */
  public readonly domain: string;

  public vpcId: Promise<string>;
  public allSubnetIds: Promise<pulumi.Input<string>[]>;
  public privateSubnetIds: Promise<pulumi.Input<string>[]>;
  public publicSubnetIds: Promise<pulumi.Input<string>[]>;

  public zoneId: Promise<string>;
  public zoneArn: Promise<string>;

  constructor(
    name: string,
    config: ClusterArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:Cluster", name, config, opts);
    this.name = name;
    this.config = this.validateArgs(config);

    // Set VPC networking configuration
    this.vpcId = this.setupVpc();
    const subnetIds = this.setupSubnets();
    this.allSubnetIds = subnetIds.then(subnetIds => subnetIds.allIds);
    this.privateSubnetIds = subnetIds.then(subnetIds => subnetIds.privateIds);
    this.publicSubnetIds = subnetIds.then(subnetIds => subnetIds.publicIds);

    // Create ResourceOptions for child components
    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    // DNS
    this.domain = this.setupClusterDomain();
    try{
      const zoneData = this.getExternalZoneData();
      this.zoneId = zoneData.then(zone => zone.id);
      this.zoneArn = zoneData.then(zone => zone.arn);
    } catch (error) {
      if (error instanceof Error) {
        const msg = error.message;
        if (!msg.includes("no matching Route53Zone found")) {
          pulumi.log.error(msg, this);
        }
        this.dnsZone = this.setupDnsZone(resourceOpts);
      }
      throw error;
    }

    // Provisioner
    this.provisionerRole = this.setupProvisionerRole(resourceOpts);
    this.provisionerRolePolicy = this.setupProvisionerRolePolicy(resourceOpts);
    const provisionerProviderOpts = pulumi.mergeOptions(opts, {
      parent: this.provisionerRolePolicy,
    });
    this.provisionerProvider = this.setupProvisionerProvider(
      provisionerProviderOpts
    );

    // Cluster
    this.subnetTags = this.setupSubnetTags(resourceOpts);
    this.role = this.setupRole(resourceOpts);
    this.rolePolicyAttachment = this.setupRolePolicyAttachment(resourceOpts);
    this.securityGroup = this.setupClusterSecurityGroup(resourceOpts);

    const clusterOpts = pulumi.mergeOptions(resourceOpts, {
      dependsOn: [this.rolePolicyAttachment, this.securityGroup],
      provider: this.provisionerProvider,
    });
    this.cluster = this.setupCluster(clusterOpts);

    // Provider
    this.kubeconfig = this.setupKubeconfig();
    this.provider = this.setupKubernetesProvider();

    // Node Groups
    this.nodeGroups = this.setupNodeGroups({
      ...resourceOpts,
      dependsOn: [this.cluster],
    });

    // OIDC Providers
    this.defaultOidcProvider = this.setupDefaultOidcProvider({
      ...resourceOpts,
      dependsOn: [this.cluster],
    });

    // Charts
    const chartsOpts = {
      parent: this,
      provider: this.provider,
      dependsOn: [this.cluster],
    };
    this.cniChart = this.setupCni(chartsOpts);

    const addonsOpts = pulumi.mergeOptions(resourceOpts, {
      dependsOn: [this.cniChart],
    });
    if (this.config.addons?.enabled) {
      this.clusterAddons = this.setupClusterAddons(addonsOpts);
    }

    this.registerOutputs({
      cluster: this.cluster,
      cniChart: this.cniChart,
      clusterAddons: this.clusterAddons,
      defaultOidcProvider: this.defaultOidcProvider,
      domain: this.domain,
      kubeconfig: this.kubeconfig,
      nodeGroups: this.nodeGroups,
      provider: this.provider,
      provisionerRole: this.provisionerRole,
      provisionerRolePolicy: this.provisionerRolePolicy,
      provisionerProvider: this.provisionerProvider,
      role: this.role,
      rolePolicyAttachment: this.rolePolicyAttachment,
      securityGroup: this.securityGroup,
      subnetTags: this.subnetTags,
    });
  }

  private validateArgs(a: ClusterArgs): ClusterArgs {
    const args = defaultsDeep({ ...a }, defaultClusterArgs);

    for (const [index, nodeGroup] of args.nodeGroups.entries()) {
      args.nodeGroups[index] = defaultsDeep({ ...nodeGroup }, defaultNodeGroup);
    }

    return args;
  }

  private setupClusterDomain(): string {
    return `${this.name}.${this.config.baseDomain}`;
  }

  private setupSubnetTags(
    opts?: pulumi.CustomResourceOptions
  ): aws.ec2.Tag[] {
    const list: aws.ec2.Tag[] = [];

    // Public subnets
    this.setupPublicSubnetTag(opts);

    // Private subnets
    this.setupPrivateSubnetTag(opts);

    return list;
  }

  private setupPublicSubnetTag(opts?: pulumi.ResourceOptions): aws.ec2.Tag[] {
    const list: aws.ec2.Tag[] = [];
    this.publicSubnetIds.then(subnetIds => {
      for (const subnetId of subnetIds) {
        list.push(
          new aws.ec2.Tag(
            `${this.name}-${subnetId}-shared`,
            {
              resourceId: subnetId,
              key: `kubernetes.io/cluster/${this.name}`,
              value: "shared",
            },
            opts
          )
        );
        list.push(
          new aws.ec2.Tag(
            `${this.name}-${subnetId}-elb`,
            {
              resourceId: subnetId,
              key: `kubernetes.io/role/elb`,
              value: "1",
            },
            opts
          )
        );
      }
    });

    return list;
  }

  private setupPrivateSubnetTag(opts?: pulumi.ResourceOptions): aws.ec2.Tag[] {
    const list: aws.ec2.Tag[] = [];
    this.privateSubnetIds.then(subnetIds => {
      for (const subnetId of subnetIds) {
        new aws.ec2.Tag(
          `${this.name}-private-subnet-${subnetId}-elb`,
          {
            resourceId: subnetId,
            key: `kubernetes.io/role/internal-elb`,
            value: "1",
          },
          opts
        )
      }
    });
    return list;
  }

  private setupRole(opts: pulumi.ResourceOptions): aws.iam.Role {
    return new aws.iam.Role(
      this.name,
      {
        assumeRolePolicy: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
`,
        name: this.name,
      },
      opts
    );
  }

  private setupRolePolicyAttachment(
    opts: pulumi.ResourceOptions
  ): aws.iam.RolePolicyAttachment {
    return new aws.iam.RolePolicyAttachment(
      this.name,
      {
        policyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
        role: this.role.name,
      },
      opts
    );
  }

  private setupClusterSecurityGroup(
    opts: pulumi.ResourceOptions
  ): aws.ec2.SecurityGroup {
    return new aws.ec2.SecurityGroup(
      this.name,
      {
        vpcId: this.vpcId,
        name: this.name,
        ingress: [
          {
            fromPort: 443,
            toPort: 443,
            protocol: "tcp",
            cidrBlocks: ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"],
          },
        ],
        revokeRulesOnDelete: true,
      },
      opts
    );
  }

  private setupProvisionerRole(opts: pulumi.ResourceOptions): aws.iam.Role {
    return new aws.iam.Role(
      `${this.name}-provisioner`,
      {
        assumeRolePolicy: aws
        .getCallerIdentity({ parent: this, async: true })
        .then(
          (id) => `{
            "Version": "2012-10-17",
            "Statement": [
                {
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::${id.accountId}:root"
                },
                "Action": "sts:AssumeRole"
                }
            ]
            }`
        ),
      },
      opts
    );
  }

  private setupProvisionerRolePolicy(
    opts?: pulumi.ResourceOptions
  ): aws.iam.RolePolicy {
    return new aws.iam.RolePolicy(
      `${this.name}-provisioner`,
      {
        role: this.provisionerRole.name,
        policy: {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "eks:*",
              Resource: "*",
            },
            {
              Effect: "Allow",
              Action: "iam:PassRole",
              Resource: "*",
            },
          ],
        },
      },
      opts
    );
  }

  private setupProvisionerProvider(opts: pulumi.ResourceOptions): aws.Provider {
    const baseprovider = opts.provider as aws.Provider;
    return new aws.Provider(
      `${this.name}-provisioner`,
      {
        // https://github.com/pulumi/pulumi-aws/issues/2144
        skipCredentialsValidation: true,
        assumeRole: {
          roleArn: this.provisionerRole.arn.apply(async (arn) => {
            // Wait 30 seconds to assume the IAM Role
            // https://github.com/pulumi/pulumi-aws/issues/673#issuecomment-515129782
            if (!pulumi.runtime.isDryRun()) {
              await new Promise((resolve) => setTimeout(resolve, 30 * 1000));
            }
            return arn;
          }),
        },
      },
      opts
    );
  }

  private setupCluster(opts: pulumi.ResourceOptions): aws.eks.Cluster {
    return new aws.eks.Cluster(
      this.name,
      {
        name: this.name,
        roleArn: this.role.arn,
        version: this.config.version,
        defaultAddonsToRemoves: ["vpc-cni"],
        vpcConfig: {
          subnetIds: this.allSubnetIds,
          endpointPublicAccess: this.config.api?.public?.enabled,
          endpointPrivateAccess: this.config.api?.private?.enabled,
          publicAccessCidrs: this.config.api?.public?.whitelist,
          securityGroupIds: [this.securityGroup.id],
        },
      },
      opts
    );
  }

  private setupNodeGroups(opts: pulumi.ResourceOptions): NodeGroup[] {
    const nodeGroups: NodeGroup[] = [];

    if (this.config.nodeGroups === undefined) {
      return nodeGroups;
    }

    for (const nodeGroupClusterArgs of this.config.nodeGroups) {
      if (nodeGroupClusterArgs.instanceType === undefined) {
        throw Error("NodeGroup instanceType must be set");
      }

      const subnetIds =
        nodeGroupClusterArgs.subnetsType == ClusterSubnetsType.private
        ? this.privateSubnetIds || this.config.privateSubnetIds || []
        : this.publicSubnetIds || this.config.publicSubnetIds || [];

      const ng = new NodeGroup(
        `${this.name}-${nodeGroupClusterArgs.name}`,
        {
          ...nodeGroupClusterArgs,
          clusterName: this.cluster.name,
          clusterVersion: this.config.version || defaultVersion,
          clusterCA: this.cluster.certificateAuthorities[0].data,
          clusterEndpoint: this.cluster.endpoint,
          subnetIds: subnetIds,
        },
        opts
      );

      nodeGroups.push(ng);
    }
    return nodeGroups;
  }

  private setupDefaultOidcProvider(
    opts: pulumi.ResourceOptions
  ): aws.iam.OpenIdConnectProvider | undefined {
    if (this.config.oidcProviders?.enableDefaultProvider) {
      const oidcCertificate = tls.getCertificateOutput({
        url: this.cluster.identities[0].oidcs[0].issuer,
      });

      const provider = new aws.iam.OpenIdConnectProvider(
        this.name,
        {
          clientIdLists: ["sts.amazonaws.com"],
          thumbprintLists: [oidcCertificate.certificates[0].sha1Fingerprint],
          url: this.cluster.identities[0].oidcs[0].issuer,
        },
        opts
      );

      return provider;
    }

    return;
  }

  public setupKubeconfig(): pulumi.Output<string> {
    const kubeconfig = pulumi.interpolate`apiVersion: v1
clusters:
- cluster:
    server: ${this.cluster.endpoint}
    certificate-authority-data: ${this.cluster.certificateAuthorities[0].data}
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: aws
  name: aws
current-context: aws
kind: Config
preferences: {}
users:
- name: aws
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      args:
      - eks
      - get-token
      - --cluster-name
      - ${this.cluster.name}
      - --role-arn
      - ${this.provisionerRole.arn}
      command: aws
`;
    return kubeconfig;
  }

  private setupKubernetesProvider(): kubernetes.Provider {
    const provider = new kubernetes.Provider(
      this.name,
      {
        kubeconfig: this.kubeconfig,
      },
      {
        parent: this.cluster,
        dependsOn: [this.cluster],
      }
    );

    return provider;
  }

  private setupCni(opts: pulumi.ResourceOptions): kubernetes.helm.v3.Release {
    return new kubernetes.helm.v3.Release(
      this.name,
      {
        chart: "aws-vpc-cni",
        repositoryOpts: {
          repo: "https://aws.github.io/eks-charts",
        },
        namespace: "kube-system",
        version: "1.1.21",
        values: {
          ENABLE_PREFIX_DELEGATION: "true",
        },
      },
      opts
    );
  }

  private setupClusterAddons(opts: pulumi.ResourceOptions): ClusterAddons {
    const zoneArn = this.dnsZone !== undefined ? this.dnsZone.arn : pulumi.output(this.zoneArn);
    const zoneId = this.dnsZone !== undefined ? this.dnsZone.id: pulumi.output(this.zoneId);
    return new ClusterAddons(`${this.name}`, {
      k8sProvider: this.provider,
      identityProvidersArn: [this.defaultOidcProvider?.arn || ""],
      issuerUrl: this.defaultOidcProvider?.url || "",
      domain: this.domain,
      zoneId: zoneId,
      zoneArns: [zoneArn],
    }, opts);
  }

  private async getZoneData(opts: pulumi.ResourceOptions): Promise<{
    id: string,
    arn: string,
  } | undefined> {
    try{
      const zoneData = await this.getExternalZoneData();
      return zoneData;
    } catch (error) {
      if (error instanceof Error) {
        const msg = error.message;
        if (!msg.includes("no matching Route53Zone found")) {
          pulumi.log.error(msg, this);
        }
        return;
      }
      throw error;
    }
  }

  private setupDnsZone(opts: pulumi.ResourceOptions): aws.route53.Zone {
    const vpcId = Promise.resolve(this.vpcId);
    const zone = new aws.route53.Zone(
      this.name,
      {
        name: this.domain,
        forceDestroy: true,
        vpcs: [{
          vpcId: vpcId.toString(),
        }],
      },
      opts
    );
    return zone;
  }

  private async getExternalZoneData(): Promise<{id: string, arn: string}> {
    const invokeOpts = {parent: this, async: true};
    const zone = await aws.route53.getZone({
      name: this.config.baseDomain,
    }, invokeOpts);

    return {
      id: zone.id,
      arn: zone.arn,
    }
  }

  /**
   * Get the default VPC id
   */
  private async setupVpc(): Promise<string> {
    if (this.config.vpcId !== undefined) {
      return this.config.vpcId.toString();
    }
    const invokeOpts = { parent: this, async: true };
    const vpc = aws.ec2.getVpc({ default: true }, invokeOpts);
    return vpc.then(vpc => vpc.id);
  }

  /**
   * Get the default VPC id
   */
  private async setupSubnets(): Promise<{
    allIds: pulumi.Input<string>[],
    privateIds: pulumi.Input<string>[],
    publicIds: pulumi.Input<string>[],
  }> {
    const vpcId = await Promise.resolve(this.vpcId);

    // Get subnets from configuration
    if (this.config.publicSubnetIds !== undefined || this.config.privateSubnetIds !== undefined) {
      const allList: pulumi.Input<string>[] = [];
      allList.push(...this.config.publicSubnetIds || []);
      allList.push(...this.config.privateSubnetIds || []);
      return {
        allIds: allList,
        privateIds: this.config.privateSubnetIds || [],
        publicIds: this.config.publicSubnetIds || [],
      };
    } else {
      const invokeOpts = { parent: this, async: true };
      let subnetIds : pulumi.Input<string>[] = [];
      const privateIds : pulumi.Input<string>[] = [];
      const publicIds : pulumi.Input<string>[] = [];

      subnetIds = await aws.ec2.getSubnets(
        {
          filters: [{
            name: "vpc-id",
            values: [vpcId.toString()],
          }]
        },
        invokeOpts
      ).then(subnets => subnets.ids);

      const internetGatewayId = aws.ec2.getInternetGateway(
        {
          filters: [
            {
              name: "attachment.vpc-id",
              values: [vpcId.toString()],
            },
          ],
        },
        invokeOpts
      ).then(ig => ig.id);

      for (const subnetId of subnetIds) {
        const isPublicPromise = this.isPublicSubnet(subnetId, internetGatewayId);
        isPublicPromise.then(promise => {
          if (promise) {
            publicIds.push(subnetId);
          } else {
            privateIds.push(subnetId);
          }
        });
      }

      return {
        allIds: subnetIds,
        privateIds: subnetIds,
        publicIds: subnetIds,
      };
    }
  }

  /**
   * Check if the given Subnet is attached to the VPC Internet Gateway through the Routes declared in the Route Table
   */
  private async isPublicSubnet(
    subnetId: pulumi.Input<string>,
    internetGatewayId: pulumi.Input<string>
  ): Promise<boolean> {
    const invokeOpts = { parent: this, async: true };
    try {
      // Check if exists the explicit association between the Subnet and the Route Table
      const routeTableId = await aws.ec2.getRouteTable(
        {
          subnetId: subnetId.toString(),
        },
        invokeOpts
      ).then(routeTable => routeTable.id);
      return await this.isSubnetWithInternetGateway(internetGatewayId, routeTableId);
    } catch (error) {
      // Check if exists non-explicit association between the Subnet and the Route Table
      if (error instanceof Error) {
        const msg = error.message;
        if (msg.includes("query returned no results")) {
          const vpcId = await Promise.resolve(this.vpcId);
          const vpcRouteTableId = await aws.ec2.getRouteTable(
            {
              vpcId: vpcId.toString(),
            },
            invokeOpts
          ).then(rt => rt.id);
          return await this.isSubnetWithInternetGateway(
            internetGatewayId,
            vpcRouteTableId
          );
        } else {
          return false;
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Check if the RouteTable as a route attached to the InternetGateway
   */
  private async isSubnetWithInternetGateway(
    internetGatewayId: pulumi.Input<string>,
    routeTableId: pulumi.Input<string>
  ): Promise<boolean> {
    const invokeOpts = { parent: this, async: true };

    try {
      const routeTable = await aws.ec2.getRoute({
        gatewayId: internetGatewayId.toString(),
        routeTableId: routeTableId.toString(),
      });
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const msg = error.message;
        if (
          msg.includes(
            "use additional constraints to reduce matches to a single rout"
          )
        ) {
          return true;
        } else if (
          msg.includes(
            "No routes matching supplied arguments found in Route Table"
          )
        ) {
          return false;
        }
      }

      throw error;
    }
  }
}

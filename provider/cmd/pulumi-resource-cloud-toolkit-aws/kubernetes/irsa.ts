import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import { IrsaArgs } from "./irsaArgs";

export { IrsaArgs }
/**
 * The Irsa component create an IAM roles for service accounts on AWS and Kubernetes.
 */
export class Irsa extends pulumi.ComponentResource {
  private args: IrsaArgs;
  public readonly name: string;

  /**
   * The IAM Role.
   */
  public readonly role: aws.iam.Role;

  /**
   * The list of IAM Policies.
   */
  public readonly policies: aws.iam.Policy[];

  /** The list of IAM Policy Attachments to associate the Roles and Policies.
   */
  public readonly rolePolicyAttachments: aws.iam.RolePolicyAttachment[];

  /**
   * The ServiceAccount created in Kubernetes.
   */
  public readonly serviceAccount: kubernetes.core.v1.ServiceAccount;

  constructor(
    name: string,
    args: IrsaArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:Irsa", name, args, opts);
    this.args = args;
    this.name = name;

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });
    this.role = this.setupRole(resourceOpts);
    this.policies = this.setupPolicies(resourceOpts);
    this.rolePolicyAttachments = this.setupRolePolicyAttachments(resourceOpts);
    this.serviceAccount = this.setupServiceAccount(resourceOpts);
  }

  private setupRole(opts?: pulumi.ResourceOptions): aws.iam.Role {
    const assumeRole = aws.iam.getPolicyDocumentOutput({
      statements: [
        {
          effect: "Allow",
          principals: [
            {
              type: "Federated",
              identifiers: [...this.args.identityProvidersArn],
            },
          ],
          actions: ["sts:AssumeRoleWithWebIdentity"],
          conditions: [
            {
              test: "StringLike",
              variable: pulumi.interpolate`${this.args.issuerUrl}:sub`,
              values: [
                pulumi.interpolate`system:serviceaccount:${this.args.namespace}:${this.args.serviceAccountName}`,
              ],
            },
          ],
        },
      ],
    });

    return new aws.iam.Role(
      this.name,
      {
        name: this.name,
        assumeRolePolicy: assumeRole.json,
      },
      opts
    );
  }

  private setupPolicies(opts?: pulumi.ResourceOptions): aws.iam.Policy[] {
    const list: aws.iam.Policy[] = [];
    for (const [key, policyDocument] of this.args.policies.entries()) {
      const policy = new aws.iam.Policy(`${this.name}-${key}`, {
        policy: policyDocument,
      }, opts);
      list.push(policy);
    }

    return list;
  }

  private setupRolePolicyAttachments(opts?: pulumi.ResourceOptions): aws.iam.RolePolicyAttachment[] {
    const list: aws.iam.RolePolicyAttachment[] = [];

    let i = 0;
    for (const policy of this.policies) {
      const rolePolicyAttachment = new aws.iam.RolePolicyAttachment(
        `${this.name}-${i}`,
        {
          role: this.role,
          policyArn: policy.arn,
        },
        opts
      );
      list.push(rolePolicyAttachment);
      i++;
    }

    return list;
  }

  private setupServiceAccount(opts?: pulumi.ResourceOptions): kubernetes.core.v1.ServiceAccount {
    return new kubernetes.core.v1.ServiceAccount(
      this.name,
      {
        metadata: {
          name: this.args.serviceAccountName,
          namespace: this.args.namespace,
          annotations: {
            "eks.amazonaws.com/role-arn": this.role.arn,
          },
        },
      },
      {
        ...opts,
        provider: this.args.k8sProvider,
      }
    );
  }
}

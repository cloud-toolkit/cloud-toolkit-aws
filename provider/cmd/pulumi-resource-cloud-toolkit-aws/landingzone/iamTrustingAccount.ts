import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {
  IamTrustingAccountArgs,
  IamTrustingAccountRoleMapping,
  IamTrustingAccountRolePolicyAttachmentMapping
} from "./iamTrustingAccountArgs";

export { IamTrustingAccountArgs };

export class IamTrustingAccount extends pulumi.ComponentResource {
  private args: IamTrustingAccountArgs;
  private name: string;

  public readonly delegatedRoles: IamTrustingAccountRoleMapping[];
  public readonly delegatedRolePolicyAttachments: IamTrustingAccountRolePolicyAttachmentMapping[];
  private readonly delegatedRoleMap: Map<string, aws.iam.Role>;
  private readonly delegatedRolePolicyAttachmentMap: Map<
    string,
    aws.iam.RolePolicyAttachment[]
  >;

  constructor(
    name: string,
    args: IamTrustingAccountArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:landingzone:IamTrustingAccount", name, args, opts);
    this.name = name;
    this.args = this.validateArgs(args);

    const resourceOpts = pulumi.mergeOptions(opts, { parent: this });

    this.delegatedRoleMap = this.setupDelegatedRoleMap(resourceOpts);
    this.delegatedRolePolicyAttachmentMap =
      this.setupDelegatedRolePolicyAttachmentMap(resourceOpts);

    this.delegatedRoles = [];
    for (const [name, role] of this.delegatedRoleMap.entries()) {
      this.delegatedRoles.push({
        roleName: name,
        role: role,
      });
    }

    this.delegatedRolePolicyAttachments = [];
    for (const [name, rolePolicyAttachment] of this.delegatedRolePolicyAttachmentMap.entries()) {
      this.delegatedRolePolicyAttachments.push({
        roleName: name,
        rolePolicyAttachment: rolePolicyAttachment,
      })
    }
  }

  private validateArgs(args: IamTrustingAccountArgs): IamTrustingAccountArgs {
    return args;
  }

  private setupDelegatedRoleMap(
    opts?: pulumi.ResourceOptions
  ): Map<string, aws.iam.Role> {
    const map = new Map<string, aws.iam.Role>();

    for (const roleData of this.args.delegatedRoles || []) {
      const principals = [];
      for (const id of this.args.delegatedAccountIds) {
        principals.push({
          type: "AWS",
          identifiers: [pulumi.interpolate`arn:aws:iam::${id}:root`],
        });
      }
      const assumePolicy = aws.iam.getPolicyDocumentOutput({
        statements: [
          {
            effect: "Allow",
            principals: principals,
            actions: ["sts:AssumeRole"],
          },
        ],
      });

      const role = new aws.iam.Role(
        `${this.name}-${roleData.name}`,
        {
          name: `${roleData.name}`,
          assumeRolePolicy: assumePolicy.json,
        },
        opts
      );
      map.set(`${roleData.name}`, role);
    }

    return map;
  }

  private setupDelegatedRolePolicyAttachmentMap(
    opts?: pulumi.ResourceOptions
  ): Map<string, aws.iam.RolePolicyAttachment[]> {
    const map = new Map<string, aws.iam.RolePolicyAttachment[]>();

    for (const roleData of this.args.delegatedRoles || []) {
      const rolePolicyAttachmentList: aws.iam.RolePolicyAttachment[] = [];
      for (const policy of roleData.policyNames) {
        const policyObject = aws.iam.getPolicyOutput({
          name: policy,
        });

        const role = this.delegatedRoleMap.get(roleData.name);
        if (role === undefined) {
          throw Error(`Internal error: Unable to get Role ${roleData.name}`);
        }

        const rolePolicyAttachment = new aws.iam.RolePolicyAttachment(
          `${this.name}-${roleData.name}-${policy}`,
          {
            role: role.id,
            policyArn: policyObject.arn,
          },
          opts
        );
        rolePolicyAttachmentList.push(rolePolicyAttachment);
      }

      map.set(roleData.name, rolePolicyAttachmentList);
    }
    return map;
  }
}

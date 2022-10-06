import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {
  IamTrustedAccountArgs,
  IamTrustedAccountRoleGroupMapping,
  IamTrustedAccountRoleGroupPolicyMapping,
} from "./iamTrustedAccountArgs";

export { IamTrustedAccountArgs };

export class IamTrustedAccount extends pulumi.ComponentResource {
  private args: IamTrustedAccountArgs;
  private name: string;

  public readonly roleGroups: IamTrustedAccountRoleGroupMapping[];
  public readonly roleGroupPolicies: IamTrustedAccountRoleGroupPolicyMapping[];

  private readonly roleGroupMap: Map<string, aws.iam.Group>;
  private readonly roleGroupPolicyMap: Map<string, aws.iam.GroupPolicy>;

  constructor(
    name: string,
    args: IamTrustedAccountArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:landingzone:IamTrustedAccount", name, args, opts);
    this.name = name;
    this.args = this.validateArgs(args);

    const resourceOpts = pulumi.mergeOptions(opts, { parent: this });

    this.roleGroupMap = this.setupRoleGroupMap(resourceOpts);
    this.roleGroupPolicyMap = this.setupRoleGroupPolicyMap(resourceOpts);

    this.roleGroups = [];
    for (const [name, group] of this.roleGroupMap.entries()) {
      this.roleGroups.push({
        roleName: name,
        group: group,
      });
    }

    this.roleGroupPolicies = [];
    for (const [name, groupPolicy] of this.roleGroupPolicyMap.entries()) {
      this.roleGroupPolicies.push({
        roleName: name,
        groupPolicy: groupPolicy,
      });
    }
  }

  private validateArgs(args: IamTrustedAccountArgs): IamTrustedAccountArgs {
    return args;
  }

  private setupRoleGroupMap(
    opts?: pulumi.ResourceOptions
  ): Map<string, aws.iam.Group> {
    const map = new Map<string, aws.iam.Group>();

    for (const role of this.args.roles) {
      const group = new aws.iam.Group(
        `${this.name}-${role.name}`,
        {
          name: pulumi.interpolate`${role.name}-in-${this.args.trustingAccountName}`,
        },
        opts
      );
      map.set(role.name, group);
    }
    return map;
  }

  private setupRoleGroupPolicyMap(
    opts?: pulumi.ResourceOptions
  ): Map<string, aws.iam.GroupPolicy> {
    const map = new Map<string, aws.iam.GroupPolicy>();

    for (const [name, group] of this.roleGroupMap) {
      const statements = [];
      statements.push({
        effect: "Allow",
        actions: ["sts:AssumeRole"],
        resources: [
          pulumi.interpolate`arn:aws:iam::${this.args.trustingAccountId}:role/${name}`,
        ],
      });

      const groupPolicyDocument = aws.iam.getPolicyDocumentOutput({
        statements: statements,
      });
      const g = new aws.iam.GroupPolicy(
        `${this.name}-${name}`,
        {
          group: group.id,
          policy: groupPolicyDocument.json,
        },
        opts
      );
      map.set(name, g);
    }

    return map;
  }
}

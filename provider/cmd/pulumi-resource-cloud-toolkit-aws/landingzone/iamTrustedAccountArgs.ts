import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface IamTrustedAccountArgs {
  roles: IamTrustedAccountRoleArgs[];
  trustingAccountId: pulumi.Input<string>;
  trustingAccountName: pulumi.Input<string>;
}

export interface IamTrustedAccountRoleArgs {
  name: string;
}

export interface IamTrustedAccountRoleGroupMapping {
  roleName: string;
  group: aws.iam.Group;
}

export interface IamTrustedAccountRoleGroupPolicyMapping {
  roleName: string;
  groupPolicy: aws.iam.GroupPolicy;
}

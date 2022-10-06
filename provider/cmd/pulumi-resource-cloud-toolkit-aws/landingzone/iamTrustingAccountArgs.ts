import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface IamTrustingAccountArgs {
  delegatedAccountIds: pulumi.Input<string>[];
  delegatedRoles?: IamTrustingAccountRoleArgs[];
}

export interface IamTrustingAccountRoleArgs {
  name: string;
  policyNames: pulumi.Input<string>[];
}

export interface IamTrustingAccountRoleMapping {
  roleName: string;
  role: aws.iam.Role;
}

export interface IamTrustingAccountRolePolicyAttachmentMapping {
  roleName: string;
  rolePolicyAttachment: aws.iam.RolePolicyAttachment[];
}

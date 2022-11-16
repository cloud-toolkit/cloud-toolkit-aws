import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

export interface IamAuthenticatorArgs {
  /**
   * List of AWS Accounts allowed to authenticate in the cluster.
   */
  accounts?: pulumi.Input<string>[];

  /**
   * The EKS Cluster ARN.
   */
  clusterArn: pulumi.Input<string>;

  /**
   * The Kubeconfig to access to the cluster.
   */
  kubeconfig: pulumi.Input<string>;

  /**
   * The list of AWS IAM Roles to generate the aws-auth ConfigMap.
   */
  roles?: IamAuthenticatorRoleArgs[];

  /**
   * The list of AWS IAM Roles for NodeGroups to generate the aws-auth ConfigMap.
   */
  nodeGroupRoles?: IamAuthenticatorRoleArgs[];

  /**
   * The list of AWS IAM Users to generate the aws-auth ConfigMap.
   */
  users?: IamAuthenticatorUserArgs[];

  /**
   * The list of AWS IAM Users names to be configured as cluster-admin.
   */
  clusterAdmins?: pulumi.Input<string>[];
}

export interface IamAuthenticatorRoleArgs {
  /**
   * The AWS IAM Role arn.
   */
  rolearn: pulumi.Input<string>;

  /**
   * The list of Kubernetes groups to be associated with the AWS IAM Role.
   */
  groups?: pulumi.Input<string>[];

  /**
   * The Kubernetes username to be associated with the AWS IAM Role.
   */
  username: pulumi.Input<string>;
}

export interface IamAuthenticatorUserArgs {
  /**
   * The AWS IAM User arn.
   */
  userarn: pulumi.Input<string>;

  /**
   * The list of Kubernetes groups to be associated with the AWS IAM User.
   */
  groups?: pulumi.Input<string>[];

  /**
   * The Kubernetes username to be associated with the AWS IAM User.
   */
  username: pulumi.Input<string>;
}

export const defaultIamAuthenticatorArgs = {
  clusterAdmins: [],
  nodeGroupRoles: [],
  roles: [],
  users: [],
};

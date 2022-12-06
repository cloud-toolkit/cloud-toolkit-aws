import * as pulumi from "@pulumi/pulumi";

export interface ClusterAdminsArgs {
  /**
   * The name for the group of Cluster Admins.
   */
  name: pulumi.Input<string>;

  /**
   * Kubernetes provider used by Pulumi.
   */
  kubeconfig: pulumi.Input<string>;

    /**
   * The list of AWS IAM User arns.
   */
  userArns: pulumi.Input<string>[];
}

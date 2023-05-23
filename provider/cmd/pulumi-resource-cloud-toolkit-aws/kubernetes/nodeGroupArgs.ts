import * as pulumi from "@pulumi/pulumi";

export interface NodeGroupArgs {
  /**
   * The name that identies the resource.
   */
  name: string;

  /**
   * The Kubernetes cluster version.
   */
  clusterVersion: string;

  /**
   * The Kubernetes cluster endpoint.
   */
  clusterEndpoint: pulumi.Input<string>;

  /**
   * The CA used by the Kubernetes cluster.
   */
  clusterCA: pulumi.Input<string>;

  /**
   * The Kubernetes cluster name.
   */
  clusterName: pulumi.Input<string>;

  /**
   * The list of subnets ids where the nodes will be deployed.
   */
  subnetIds: pulumi.Input<pulumi.Input<string>[]>;

  /**
   * The aws instance type to use for the nodes. Defaults to "t3.medium".
   */
  instanceType?: string;

  /**
   * The minimum number of nodes running in the node group. Defaults to 1.
   */
  minCount?: number;

  /**
   * The maximum number of nodes running in the node group. Defaults to 2.
   */
  maxCount?: number;

  /**
   * The maximum number of nodes unavailable at once during a version update. Defaults to 1.
   */
  maxUnavailable?: number;

  /**
   * Disk size in GiB for each node. Defaults to 20.
   */
  diskSize?: number;
}

export const defaultNodeGroupType = "t3.medium";
export const defaultNodeGroupArgs = {
  instanceType: defaultNodeGroupType,
  minCount: 1,
  maxCount: 3,
  maxUnavailable: 1,
  diskSize: 20
};

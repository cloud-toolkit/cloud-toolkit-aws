import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface AwsLoadBalancerControllerArgs extends IrsaApplicationAddonArgs {
  /**
   * The Cluster name.
   */
  clusterName: pulumi.Input<string>;
}

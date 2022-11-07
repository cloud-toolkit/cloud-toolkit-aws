import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface ClusterAutoscalerArgs extends IrsaApplicationAddonArgs {
  /**
   * The Cluster name.
   */
  clusterName: pulumi.Input<string>;
}

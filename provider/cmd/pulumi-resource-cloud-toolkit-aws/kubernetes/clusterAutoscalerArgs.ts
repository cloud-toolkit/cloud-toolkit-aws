import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface ClusterAutoscalerArgs extends IrsaApplicationAddonArgs {
    clusterName: pulumi.Input<string>;
  }
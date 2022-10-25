import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface AwsLoadBalancerControllerArgs extends IrsaApplicationAddonArgs {
  clusterName: pulumi.Input<string>;
}

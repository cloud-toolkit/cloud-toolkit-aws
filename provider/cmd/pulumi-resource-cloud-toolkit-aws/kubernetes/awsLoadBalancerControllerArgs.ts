import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface AwsLoadBalancerControllerArgs extends IrsaApplicationAddonArgs {
  awsPartition: pulumi.Input<string>;
  clusterName: pulumi.Input<string>;
}

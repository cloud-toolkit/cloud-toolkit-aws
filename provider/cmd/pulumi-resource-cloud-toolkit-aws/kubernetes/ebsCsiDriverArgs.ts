import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface AwsEbsCsiDriverArgs extends IrsaApplicationAddonArgs {
  awsPartition: pulumi.Input<string>;
}

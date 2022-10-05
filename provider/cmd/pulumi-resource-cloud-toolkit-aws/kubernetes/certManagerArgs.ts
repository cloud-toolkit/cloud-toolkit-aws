import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface CertManagerArgs extends IrsaApplicationAddonArgs {
  zoneArns: pulumi.Input<string>[];
}

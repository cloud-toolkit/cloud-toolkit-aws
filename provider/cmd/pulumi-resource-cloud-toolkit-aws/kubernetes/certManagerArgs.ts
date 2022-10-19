import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface CertManagerArgs extends IrsaApplicationAddonArgs {
  /**
   * The list of DNS Zone arn to be used by CertManager.
   */
  zoneArns: pulumi.Input<string>[];
}

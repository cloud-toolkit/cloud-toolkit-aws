import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface ExternalDnsArgs extends IrsaApplicationAddonArgs {
  /**
   * The list of DNS Zone arn to be used by ExternalDns.
   */
  zoneArns: pulumi.Input<string>[];
}

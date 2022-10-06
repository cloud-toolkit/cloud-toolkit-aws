import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface ExternalDnsArgs extends IrsaApplicationAddonArgs {
  zoneArns: pulumi.Input<string>[];
}

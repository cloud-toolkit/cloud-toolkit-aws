import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface CertManagerArgs extends IrsaApplicationAddonArgs {
  zones: aws.route53.Zone[];
}

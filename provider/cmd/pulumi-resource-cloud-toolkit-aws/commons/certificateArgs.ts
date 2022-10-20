import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface CertificateArgs {
  domain: pulumi.Input<string>;
  additionalDomains?: pulumi.Input<string>[];
  zoneId: pulumi.Input<string>;
}

export const certificateDefaultArgs = {};

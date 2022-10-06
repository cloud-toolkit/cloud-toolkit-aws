import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface AuditLoggingArgs {
  /**
   * The data retention in days. Defaults to '7'.
   */
  retentionDays?: number;

  /**
   * The region to be used to store the data.
   */
  region?: pulumi.Input<string>;

  /**
   * The AWS provider to used to create the Bucket.
   */
  bucketProvider?: aws.Provider;
}

export const defaultAuditLoggingArgs = {
  retentionDays: 7,
};

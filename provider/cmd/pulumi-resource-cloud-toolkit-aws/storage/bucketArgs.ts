import * as pulumi from "@pulumi/pulumi";
import defaultsDeep from "lodash.defaultsdeep";

/**
 * Arguments to create a Cloud Toolkit Bucket component.
 */
export interface BucketArgs {

  /**
   * Configures bucket name in AWS.
  */
  bucketName?: pulumi.Input<string>;

  /**
   * Configures a random bucket name in AWS but specifying a prefix name.
  */
  bucketNamePrefix?: pulumi.Input<string>;

  /**
   * Set to true to allow policies that may provide access to anyone.
  */
  public?: boolean;

  /**
   * Set a certain versioning mode for bucket objects
  */
  versioning?: BucketVersioningStateArgs;

  /**
   * Configures encryption parameters for the bucket
  */
  encryption?: BucketEncryptionArgs;

  /**
   * Configures replication parameters for the bucket
  */
  replication?: BucketReplicationArgs;

  /**
   * Configures a static webpage using bucket files
  */
  website?: BucketWebsiteArgs;
}

/**
 * Encrytion options for bucket.
 * enabled - Enabled encryption for the bucket
 * customKeyId - Custom AWS KMS key used for encryption
 */
export interface BucketEncryptionArgs {
  enabled: boolean;
  customKeyId?: string;
}

/**
 * Replication options for bucket.
 * bucketArn - Destination bucket where replicas are stored.
 */
export interface BucketReplicationArgs {
  bucketArn: pulumi.Input<string>;
}

/**
 * Arguments to create a website using a bucket.
 * errorDocument - Bucket file to display in case of error
 * indexDocument - Bucket file to display when access to the website
 */
export interface BucketWebsiteArgs {
  errorDocument: pulumi.Input<string>;
  indexDocument: pulumi.Input<string>;
}

/**
 * Versioning object mode that is selected for the bucket.
 * Enabled - Bucket keeps track of object versioning.
 * Disabled - Bucket does not keep track of object versioning. Once versioning is Enabled we cannot Disabled versioning.
 * Suspended - Once versioning is Enabled, this feature can be suspended  
 */
export enum BucketVersioningStateArgs {
  Enabled = "Enabled",
  Disabled = "Disabled",
  Suspended = "Suspended",
}

export const defaultConfig = {
  public: false,
  versioning: BucketVersioningStateArgs.Disabled,
  encryption: {
    enabled: false,
  },
};

export function validateConfig(c: BucketArgs): BucketArgs {
  const config = defaultsDeep({ ...c }, defaultConfig);

  if (
    config.website !== undefined &&
    config.website.indexDocument === undefined &&
    config.website.errorDocument === undefined
  ) {
    throw Error(
      "It is necessary to set the Index Document and Error Document when creating a S3 bucket as a website"
    );
  }

  if (
    config.encryption?.customKeyId !== undefined &&
    config.replication?.bucketArn !== undefined
  ) {
    throw Error(
      "Replication using bucket encryption with customer defined KMS keys is not supported"
    );
  }

  return config;
}

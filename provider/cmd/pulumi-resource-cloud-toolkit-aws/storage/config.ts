import * as pulumi from "@pulumi/pulumi";
import defaultsDeep from "lodash.defaultsdeep";

export interface BucketArgs {
  public: boolean;
  versioning?: BucketVersioningStateArgs;
  encryption?: BucketEncryptionArgs;
  replication?: BucketReplicationArgs;
  website?: BucketWebsiteArgs;
}

export interface BucketEncryptionArgs {
  enabled: boolean;
  customKeyId?: string;
}

export interface BucketReplicationArgs {
  bucketArn: pulumi.Input<string> | string;
}

export interface BucketWebsiteArgs {
  errorDocument: pulumi.Input<string>;
  indexDocument: pulumi.Input<string>;
}

export enum BucketVersioningStateArgs {
  Enabled = "Enabled",
  Disabled = "Disabled",
  Suspended = "Suspended",
}

export const defaultConfig = {
  versioning: BucketVersioningStateArgs.Disabled,
  encryption: {
    enabled: false,
  },
};

export function validateConfig(c: BucketArgs): BucketArgs {
  const config = defaultsDeep({ ...c }, defaultConfig);

  if (config.public === undefined) {
    throw Error("You must select if your bucket is public or not");
  }

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

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { BucketArgs, validateConfig } from "./bucketArgs";

export { BucketArgs };


/**
 * Cloud Toolkit component for Bcukets. Creates a Simple Bucket for object storage
 * @extends {pulumi.ComponentResource}
 */
export class Bucket extends pulumi.ComponentResource {
  /**
   * Configuration for Bucket
   * 
   * @type {BucketArgs}
   */
  private config: BucketArgs;

  /**
   * Establish Bucket name
   * 
   * @type {string}
   */
  private name: string;

  /**
   * Required role for managing bucket
   * 
   * @type {aws.iam.Role}
   */
  public readonly role: aws.iam.Role;

  /**
   * Instance of our Bucket
   * 
   * @type {aws.s3.BucketV2}
   */
  public readonly bucket: aws.s3.BucketV2;

  /**
   * Controls that IAM policies complies with bucket visibility (public or private)
   * 
   * @type {aws.s3.BucketPublicAccessBlock}
   */
  public readonly bucketPublicAccess: aws.s3.BucketPublicAccessBlock;

  /**
   *Policy to make public all objects if bucket visibility is public
   * 
   * @type {aws.s3.BucketPolicy}
   */
  public readonly bucketPublicAccessPolicy?: aws.s3.BucketPolicy;

  /**
   * Enforce that bucket owner is all bucket objects
   * 
   * @type {aws.s3.BucketOwnershipControls}
   */
  public readonly bucketOwnership: aws.s3.BucketOwnershipControls;

  /**
   * Configuration for controlling bucket versioning
   * 
   * @type {aws.s3.BucketVersioningV2}
   */
  public readonly bucketVersioning: aws.s3.BucketVersioningV2;

  /**
   * Configuration for controlling bucket encryption
   * 
   * @type {aws.s3.BucketServerSideEncryptionConfigurationV2}
  */
  public readonly bucketEncryption?: aws.s3.BucketServerSideEncryptionConfigurationV2;

  /**
   * Policy attachments to perform bucket replication
   * 
   * @type {aws.iam.PolicyAttachment[]}
   */
  public readonly replicationPolicyAttachment?: aws.iam.RolePolicyAttachment;

  /**
   * Configuration to perform bucket replication
   * 
   * @type {aws.iam.BucketReplicationConfig}
   */
  public readonly replicationConfig?: aws.s3.BucketReplicationConfig;

  /**
   * Configuration to setup a website
   * 
   * @type {aws.s3.BucketWebsiteConfigurationV2}
   */
  public readonly website?: aws.s3.BucketWebsiteConfigurationV2;

  /**
   * Policy for read-only users
   * 
   * @type {aws.iam.Policy}
   */
  public readonly readOnlyBucketPolicy: aws.iam.Policy;

  /**
   * Policy for write users
   * 
   * @type {aws.iam.Policy}
   */
  public readonly writeBucketPolicy: aws.iam.Policy;

  /**
   * constructor.
   *
   * @param {string} name
   * @param {BucketArgs} config
   * @param {pulumi.ResourceOptions} opts
   */
  constructor(name: string, config: BucketArgs, opts?: pulumi.ResourceOptions) {
    const _config = validateConfig(config);
    super("cloud-toolkit-aws:storage:Bucket", name, _config, opts);
    this.name = name;
    this.config = _config;    

    // Create ResourceOptions for child components
    const resourceOpts = {
      ...opts,
      parent: this,
    };

    //Setup basic bucket configuration
    this.role = this.setupRole(resourceOpts);
    this.bucket = this.setupBucket(resourceOpts);
    this.bucketVersioning = this.setupBucketVersioning(resourceOpts);

    this.writeBucketPolicy = this.setupBucketWritePolicy(resourceOpts);
    this.readOnlyBucketPolicy = this.setupBucketReadPolicy(resourceOpts);

    //Setup website configuration
    this.website = this.setupBucketWebsite(resourceOpts);

    //Setup basic permissions
    this.bucketPublicAccess = this.configureBucketPublicAccess(resourceOpts);
    this.bucketPublicAccessPolicy =
      this.setupBucketPublicAccessPolicy(resourceOpts);
    this.bucketOwnership = this.setupBucketOwnership(resourceOpts);

    //Setup bucket replication parameters
    this.replicationPolicyAttachment =
      this.setupBucketReplicationPolicyAttachment(resourceOpts);
    this.replicationConfig = this.setupBucketReplication(resourceOpts);

    this.bucketEncryption = this.setupBucketEncryption(resourceOpts);

    this.registerOutputs({
      role: this.role,
      bucket: this.bucket,
      bucketVersioning: this.bucketVersioning,
      writeBucketPolicy: this.writeBucketPolicy,
      readOnlyBucketPolicy: this.readOnlyBucketPolicy,
      website: this.website,
      bucketPublicAccess: this.bucketPublicAccess,
      bucketPublicAccessPolicy: this.bucketPublicAccessPolicy,
      bucketOwnership: this.bucketOwnership,
      replicationPolicyAttachment: this.replicationPolicyAttachment,
      replicationConfig: this.replicationConfig,
      bucketEncryption: this.bucketEncryption
    });
  }

  /**
   * Setup the role for Bucket
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.iam.Role}
   */
  private setupRole(opts: pulumi.ResourceOptions): aws.iam.Role {
    return new aws.iam.Role(
      `${this.name}-bucketRole`,
      {
        assumeRolePolicy: `{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": "sts:AssumeRole",
            "Principal": {
              "Service": "s3.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
          }
        ]
      }`,
        name: this.name,
      },
      opts
    );
  }

  /**
   * Setup write policy for users
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.iam.Policy}
   */
  private setupBucketWritePolicy(opts: pulumi.ResourceOptions): aws.iam.Policy {
    return new aws.iam.Policy(
      `${this.name}-write`,
      {
        name: `${this.name}-write`,
        policy: pulumi.interpolate`{
          "Version": "2012-10-17",
          "Statement": [
              {
                  "Sid": "ConsoleAccess",
                  "Effect": "Allow",
                  "Action": [
                    "s3:GetAccountPublicAccessBlock",
                    "s3:GetBucket*",
                    "s3:ListAllMyBuckets",
                    "s3:ListAccessPoints"
                  ],
                  "Resource": "*"
              },
              {
                  "Sid": "ListObjectsInBucket",
                  "Effect": "Allow",
                  "Action": "s3:ListBucket",
                  "Resource": ["${this.bucket.arn}"]
              },
              {
                  "Sid": "AllObjectActions",
                  "Effect": "Allow",
                  "Action": "s3:*Object",
                  "Resource": ["${this.bucket.arn}/*"]
              }
          ]
      }
    `,
      },
      {
        ...opts,
        dependsOn: [this.bucket],
      }
    );
  }

  /**
   * Setup read-only policy for users
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.iam.Policy}
   */
  private setupBucketReadPolicy(opts: pulumi.ResourceOptions): aws.iam.Policy {
    return new aws.iam.Policy(
      `${this.name}-read`,
      {
        name: `${this.name}-read`,
        policy: pulumi.interpolate`{
          "Version": "2012-10-17",
          "Statement": [
            {
              "Sid": "ConsoleAccess",
              "Effect": "Allow",
              "Action": [
                "s3:GetAccountPublicAccessBlock",
                "s3:GetBucket*",
                "s3:ListAllMyBuckets",
                "s3:ListAccessPoints"
              ],
              "Resource": "*"
            },  
            {
              "Sid": "ListObjectsInBucket",
              "Effect": "Allow",
              "Action": "s3:ListBucket",
              "Resource": ["${this.bucket.arn}"]
            },
            {
              "Effect": "Allow",
              "Action": [
                  "s3:Get*",
                  "s3:List*",
                  "s3-object-lambda:Get*",
                  "s3-object-lambda:List*"
              ],
              "Resource": ["${this.bucket.arn}/*"]
            }
          ]
        }`,
      },
      {
        ...opts,
        dependsOn: [this.bucket],
      }
    );
  }

  /**
   * Setup the Bucket
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.s3.BucketV2}
   */
  private setupBucket(opts: pulumi.ResourceOptions): aws.s3.BucketV2 {
    return new aws.s3.BucketV2(
      this.name,
      {
        bucket: this.name,
        forceDestroy: true,
      },
      opts
    );
  }

  /**
   * Setups the bucket as a website if needed.
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.s3.BucketWebsiteConfigurationV2 | undefined}
   */
  private setupBucketWebsite(
    opts: pulumi.ResourceOptions
  ): aws.s3.BucketWebsiteConfigurationV2 | undefined {
    if (this.config.website) {
      return new aws.s3.BucketWebsiteConfigurationV2(
        `${this.name}-website`,
        {
          bucket: this.bucket.bucket,
          indexDocument: {
            suffix: this.config.website.indexDocument,
          },
          errorDocument: {
            key: this.config.website.errorDocument,
          },
        },
        pulumi.mergeOptions(opts, { dependsOn: [this.bucket] })
      );
    } else {
      return undefined;
    }
  }

  /**
   * Blocks by default any public policy for bucket unless bucket is defined as public
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.s3.BucketPublicAccessBlock}
   */
  private configureBucketPublicAccess(
    opts: pulumi.ResourceOptions
  ): aws.s3.BucketPublicAccessBlock {
    return new aws.s3.BucketPublicAccessBlock(
      `${this.name}-publicAccessBlock`,
      {
        bucket: this.bucket.bucket,
        blockPublicAcls: !this.config.public,
        blockPublicPolicy: !this.config.public,
        ignorePublicAcls: !this.config.public,
        restrictPublicBuckets: !this.config.public,
      },
      {
        ...opts,
        dependsOn: [this.bucket],
      }
    );
  }

  /**
   * Add a Policy to make public all objects
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.s3.BucketPolicy}
   */
  private setupBucketPublicAccessPolicy(
    opts: pulumi.ResourceOptions
  ): aws.s3.BucketPolicy | undefined {
    if (!this.config.public) {
      return;
    }

    return new aws.s3.BucketPolicy(
      this.name,
      {
        bucket: this.bucket.id,
        policy: pulumi.interpolate`{
          "Version":"2012-10-17",
          "Statement":[
            {
              "Sid":"AddPerm",
              "Effect":"Allow",
              "Principal": "*",
              "Action":["s3:GetObject"],
              "Resource":["${this.bucket.arn}/*"]
            }
          ]
        }`,
      },
      opts
    );
  }

  /**
   * Setup controls so that Bucket owner owns every object.
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.s3.BucketOwnershipControls}
   */
  private setupBucketOwnership(
    opts: pulumi.ResourceOptions
  ): aws.s3.BucketOwnershipControls {
    return new aws.s3.BucketOwnershipControls(
      `${this.name}-bucketOwnership`,
      {
        bucket: this.bucket.bucket,
        rule: {
          objectOwnership: "BucketOwnerEnforced",
        },
      },
      {
        ...opts,
        dependsOn: [this.bucket],
      }
    );
  }

  /**
   * Establish a buckets encryption depend on user preferences.
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.s3.BucketServerSideEncryptionConfigurationV2}
   */
  private setupBucketEncryption(
    opts: pulumi.ResourceOptions
  ): aws.s3.BucketServerSideEncryptionConfigurationV2 | undefined {
    if (this.config.encryption?.enabled === false) {
      return undefined;
    }

    const encryptionParams =
      this.config.encryption?.customKeyId === undefined
        ? {
            sseAlgorithm: "AES256",
          }
        : {
            sseAlgorithm: "aws:kms",
            kmsMasterKeyId: this.config.encryption?.customKeyId,
          };

    return new aws.s3.BucketServerSideEncryptionConfigurationV2(
      `${this.name}-encryption`,
      {
        bucket: this.bucket.bucket,
        rules: [
          {
            applyServerSideEncryptionByDefault: encryptionParams,
          },
        ],
      },
      {
        ...opts,
        dependsOn: [this.bucket],
      }
    );
  }

  /**
   * Setup a replication policy for performing bucket replication 
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.iam.RolePolicyAttachment | undefined}
   */
  private setupBucketReplicationPolicyAttachment(
    opts: pulumi.ResourceOptions
  ): aws.iam.RolePolicyAttachment | undefined {
    if (this.config.replication?.bucketArn === undefined) {
      return undefined;
    }

    const replicationPolicy = new aws.iam.Policy(
      `${this.name}-replication`,
      {
        name: `${this.name}-replication`,
        policy: pulumi.interpolate`{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": [
            "s3:GetReplicationConfiguration",
            "s3:ListBucket"
          ],
          "Effect": "Allow",
          "Resource": [
            "${this.bucket.arn}"
          ]
        },
        {
          "Action": [
            "s3:GetObjectVersionForReplication",
            "s3:GetObjectVersionAcl",
             "s3:GetObjectVersionTagging"
          ],
          "Effect": "Allow",
          "Resource": [
            "${this.bucket.arn}/*"
          ]
        },
        {
          "Action": [
            "s3:ReplicateObject",
            "s3:ReplicateDelete",
            "s3:ReplicateTags"
          ],
          "Effect": "Allow",
          "Resource": "${this.config.replication.bucketArn}/*"
        }
      ]
    }
    `,
      },
      {
        ...opts,
        dependsOn: [this.bucket],
      }
    );

    return new aws.iam.RolePolicyAttachment(
      `${this.name}-replicationPolicyAttachment`,
      {
        role: this.role.name,
        policyArn: replicationPolicy.arn,
      },
      {
        ...opts,
        dependsOn: [this.bucket],
      }
    );
  }

  /**
   * Setup versioning for Bucket
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.s3.BucketVersioningV2}
   */
  private setupBucketVersioning(
    opts: pulumi.ResourceOptions
  ): aws.s3.BucketVersioningV2 {
    return new aws.s3.BucketVersioningV2(
      `${this.name}-bucketVersioning`,
      {
        bucket: this.bucket.bucket,
        versioningConfiguration: {
          status:
            this.config.versioning === undefined
              ? "Disabled"
              : this.config.versioning,
        },
      },
      opts
    );
  }

  /**
   * Enables Bucket replication
   *
   * @param {pulumi.ResourceOptions}
   *
   * @return {aws.s3.BucketReplicationConfig | undefined}
   */
  private setupBucketReplication(
    opts: pulumi.ResourceOptions
  ): aws.s3.BucketReplicationConfig | undefined {
    if (this.config.replication?.bucketArn === undefined) {
      return undefined;
    }

    return new aws.s3.BucketReplicationConfig(
      `${this.name}-bucketReplicationConfig`,
      {
        role: this.role.arn,
        bucket: this.bucket.bucket,
        rules: [
          {
            status: "Enabled",
            destination: {
              bucket: this.config.replication?.bucketArn,
            },
          },
        ],
      },
      {
        ...opts,
        dependsOn: [this.bucketVersioning],
      }
    );
  }
}

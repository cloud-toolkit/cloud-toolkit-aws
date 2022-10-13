import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import defaultsDeep from "lodash.defaultsdeep";
import { defaultAuditLoggingArgs, AuditLoggingArgs } from "./auditLoggingArgs";

export { AuditLoggingArgs };

export class AuditLogging extends pulumi.ComponentResource {
  private name: string;
  private args: AuditLoggingArgs;

  /**
   * The CloudWatch Log Group used to store the data.
   */
  public readonly cloudWatchLogGroup?: aws.cloudwatch.LogGroup;

  /**
   * The IAM Role used by Cloud Trail to write to CloudWatch..
   */
  public readonly cloudWatchRole?: aws.iam.Role;

  /**
   * The IAM Policy used by the IAM Role for Cloud Trail.
   */
  public readonly cloudWatchPolicy?: aws.iam.Policy;

  /**
   * The IAM Role Policy Attachments that attach the IAM Role with the IAM Policy.
   */
  public readonly cloudWatchRolePolicyAttachment?: aws.iam.RolePolicyAttachment;

  /**
   * The CloudWatch dashboard to review the audit logs.
   */
  public readonly cloudWatchDashboard?: aws.cloudwatch.Dashboard;

  /**
   * The S3 Bucket used to store the data.
   */
  public readonly bucket: aws.s3.BucketV2;

  /**
   * The S3 Bucket ACL.
   */
  public readonly bucketAcl: aws.s3.BucketAclV2;

  /**
   * The S3 Bucket Public Access Block to make data private.
   */
  public readonly bucketPublicAccessBlock: aws.s3.BucketPublicAccessBlock;

  /**
   * The S3 Bucket Lifecycle Configuration to configure data retention on S3 Bucket.
   */
  public readonly bucketLifecycleConfiguration: aws.s3.BucketLifecycleConfigurationV2;

  /**
   * The S3 Bucket policy.
   */
  public readonly bucketPolicy: aws.s3.BucketPolicy;

  /**
   * The Cloud Trail.
   */
  public readonly trail: aws.cloudtrail.Trail;

  /**
   * The AWS Organization id.
   */
  public readonly organizationId: pulumi.Input<string>;

  /**
   * The AWS Organization master account id.
   */
  public readonly organizationMasterAccountId: pulumi.Input<string>;

  private readonly region: pulumi.Input<string>;

  constructor(
    name: string,
    args: AuditLoggingArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:landingZone:AuditLogging", name, args, opts);

    this.name = name;
    this.args = this.validateArgs(args);

    // Get organization info
    const invokeOpts = {async: true, parent: this};
    const organization = aws.organizations.getOrganization(invokeOpts);
    this.organizationId = organization.then(x => x.id);
    this.organizationMasterAccountId = organization.then(x => x.masterAccountId);
    this.region = this.args.region || aws.getRegion({}, invokeOpts).then(x => x.name);

    const resourceOpts = pulumi.mergeOptions(opts, { parent: this });

    // Setup Cloudwatch
    if (this.args.cloudwatch?.enabled == true) {
      this.cloudWatchLogGroup = this.setupCloudWatchLogGroup(resourceOpts);
      this.cloudWatchRole = this.setupCloudWatchRole(resourceOpts);
      this.cloudWatchPolicy = this.setupCloudWatchPolicy(resourceOpts);
      this.cloudWatchRolePolicyAttachment =
        this.setupCloudWatchPolicyAttachment(resourceOpts);
      this.cloudWatchDashboard = this.setupCloudWatchDashboards(resourceOpts);
    }

    // Setup bucket
    const bucketOpts = pulumi.mergeOptions(opts, {
      parent: this,
      provider: this.args.bucketProvider,
    });
    this.bucket = this.setupBucket(bucketOpts);
    this.bucketAcl = this.setupBucketAcl(bucketOpts);
    this.bucketPolicy = this.setupBucketPolicy(bucketOpts);
    this.bucketPublicAccessBlock =
      this.setupBucketPublicAccessBlock(bucketOpts);
    this.bucketLifecycleConfiguration =
      this.setupBucketLifecycleConfiguration(bucketOpts);

    // Setup Cloudtrail
    this.trail = this.setupTrail(resourceOpts);

    this.registerOutputs({
      cloudWatchLogGroup: this.cloudWatchLogGroup,
      cloudWatchRole: this.cloudWatchRole,
      cloudWatchPolicy: this.cloudWatchPolicy,
      cloudWatchRolePolicyAttachment: this.cloudWatchRolePolicyAttachment,
      cloudWatchDashboard: this.cloudWatchDashboard,
      bucket: this.bucket,
      bucketPublicAccessBlock: this.bucketPublicAccessBlock,
      bucketLifecycleConfiguration: this.bucketLifecycleConfiguration,
      bucketPolicy: this.bucketPolicy,
      trail: this.trail,
    })
  }

  private validateArgs(args: AuditLoggingArgs): AuditLoggingArgs {
    const a = defaultsDeep({ ...args }, defaultAuditLoggingArgs);
    return a;
  }

  private setupOrganizationId(): pulumi.Input<string> {
    const organization = aws.organizations.getOrganization({parent: this, async: true});
    return organization.then(x => x.id);
  }

  private setupCloudWatchLogGroup(
    opts?: pulumi.ResourceOptions
  ): aws.cloudwatch.LogGroup {
    return new aws.cloudwatch.LogGroup(
      this.name,
      {
        name: this.name,
        retentionInDays: this.args.cloudwatch?.retentionDays || defaultAuditLoggingArgs.cloudwatch.retentionDays,
      },
      opts
    );
  }

  private setupCloudWatchRole(opts?: pulumi.ResourceOptions): aws.iam.Role {
    const assumeRolePolicyDocument = aws.iam.getPolicyDocumentOutput({
      statements: [
        {
          effect: "Allow",
          principals: [
            {
              type: "Service",
              identifiers: ["cloudtrail.amazonaws.com"],
            },
          ],
          actions: ["sts:AssumeRole"],
        },
      ],
    });

    return new aws.iam.Role(
      this.name,
      {
        name: this.name,
        assumeRolePolicy: assumeRolePolicyDocument.json,
      },
      opts
    );
  }

  private setupCloudWatchPolicy(opts?: pulumi.ResourceOptions): aws.iam.Policy {
    const policyDocument = aws.iam.getPolicyDocumentOutput({
      statements: [
        {
          sid: "AWSCloudTrailCreateLogStream",
          effect: "Allow",
          actions: ["logs:CreateLogStream"],
          resources: [
            pulumi.interpolate`arn:aws:logs:eu-west-1:${this.organizationMasterAccountId}:log-group:${this.cloudWatchLogGroup?.name}:log-stream:${this.organizationMasterAccountId}_CloudTrail_${this.region}*`,
            pulumi.interpolate`arn:aws:logs:eu-west-1:${this.organizationMasterAccountId}:log-group:${this.cloudWatchLogGroup?.name}:log-stream:${this.organizationId}_*`,
          ],
        },
        {
          sid: "AWSCloudTrailPutLogEvents",
          effect: "Allow",
          actions: ["logs:PutLogEvents"],
          resources: [
            pulumi.interpolate`arn:aws:logs:eu-west-1:${this.organizationMasterAccountId}:log-group:${this.cloudWatchLogGroup?.name}:log-stream:${this.organizationMasterAccountId}_CloudTrail_${this.region}*`,
            pulumi.interpolate`arn:aws:logs:eu-west-1:${this.organizationMasterAccountId}:log-group:${this.cloudWatchLogGroup?.name}:log-stream:${this.organizationId}_*`,
          ],
        },
      ],
    });

    return new aws.iam.Policy(
      this.name,
      {
        name: this.name,
        policy: policyDocument.json,
      },
      opts
    );
  }

  private setupCloudWatchPolicyAttachment(
    opts?: pulumi.ResourceOptions
  ): aws.iam.RolePolicyAttachment {
    return new aws.iam.RolePolicyAttachment(
      this.name,
      {
        role: this.cloudWatchRole!.name,
        policyArn: this.cloudWatchPolicy!.arn,
      },
      opts
    );
  }

  private setupBucket(opts: pulumi.ResourceOptions): aws.s3.BucketV2 {
    return new aws.s3.BucketV2(
      this.name,
      {
        bucketPrefix: `audit-`,
        forceDestroy: true,
      },
      opts
    );
  }

  private setupBucketAcl(opts: pulumi.ResourceOptions): aws.s3.BucketAclV2 {
    return new aws.s3.BucketAclV2(
      this.name,
      {
        bucket: this.bucket.id,
        acl: "private",
      },
      opts
    );
  }

  private setupBucketPublicAccessBlock(
    opts: pulumi.ResourceOptions
  ): aws.s3.BucketPublicAccessBlock {
    return new aws.s3.BucketPublicAccessBlock(
      this.name,
      {
        bucket: this.bucket.id,
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      opts
    );
  }

  private setupBucketLifecycleConfiguration(
    opts: pulumi.ResourceOptions
  ): aws.s3.BucketLifecycleConfigurationV2 {
    return new aws.s3.BucketLifecycleConfigurationV2(
      this.name,
      {
        bucket: this.bucket.id,
        rules: [
          {
            id: "logs",
            status: "Enabled",
            expiration: {
              days: this.args.retentionDays,
            },
          },
        ],
      },
      opts
    );
  }

  private setupBucketPolicy(
    opts?: pulumi.ResourceOptions
  ): aws.s3.BucketPolicy {
    const trailArn = pulumi.interpolate`arn:aws:cloudtrail:${this.region}:${this.organizationMasterAccountId}:trail/${this.name}`;

    const allowAccessFromOrganizationDocument = aws.iam.getPolicyDocumentOutput(
      {
        statements: [
          {
            sid: "AWSCloudTrailAclCheck",
            effect: "Allow",
            principals: [
              {
                type: "Service",
                identifiers: ["cloudtrail.amazonaws.com"],
              },
            ],
            actions: ["s3:GetBucketAcl"],
            resources: [this.bucket.arn],
            conditions: [
              {
                test: "StringEquals",
                variable: "AWS:SourceArn",
                values: [trailArn],
              },
            ],
          },
          {
            sid: "AWSCloudTrailWrite",
            effect: "Allow",
            principals: [
              {
                type: "Service",
                identifiers: ["cloudtrail.amazonaws.com"],
              },
            ],
            actions: ["s3:PutObject"],
            resources: [
              pulumi.interpolate`${this.bucket.arn}/AWSLogs/${this.organizationMasterAccountId}/*`,
            ], // FIX
            conditions: [
              {
                test: "StringEquals",
                variable: "s3:x-amz-acl",
                values: ["bucket-owner-full-control"],
              },
              {
                test: "StringEquals",
                variable: "AWS:SourceArn",
                values: [trailArn],
              },
            ],
          },
          {
            sid: "AWSCloudTrailWriteOrganization",
            effect: "Allow",
            principals: [
              {
                type: "Service",
                identifiers: ["cloudtrail.amazonaws.com"],
              },
            ],
            actions: ["s3:PutObject"],
            resources: [
              pulumi.interpolate`${this.bucket.arn}/AWSLogs/${this.organizationId}/*`,
            ],
            conditions: [
              {
                test: "StringEquals",
                variable: "s3:x-amz-acl",
                values: ["bucket-owner-full-control"],
              },
              {
                test: "StringEquals",
                variable: "AWS:SourceArn",
                values: [trailArn],
              },
            ],
          },
        ],
      }
    );

    return new aws.s3.BucketPolicy(
      this.name,
      {
        bucket: this.bucket.id,
        policy: allowAccessFromOrganizationDocument.json,
      },
      opts
    );
  }

  private setupTrail(opts?: pulumi.ResourceOptions): aws.cloudtrail.Trail {
    const cwRoleArn = this.args.cloudwatch?.enabled ? this.cloudWatchRole?.arn : undefined;
    const cwLogsGroupArn = this.args.cloudwatch?.enabled ? pulumi.interpolate`${this.cloudWatchLogGroup?.arn}:*` : undefined;
    return new aws.cloudtrail.Trail(
      this.name,
      {
        name: this.name,
        s3BucketName: this.bucket.id,
        isOrganizationTrail: true,
        isMultiRegionTrail: true,
        enableLogFileValidation: true,
        cloudWatchLogsRoleArn: cwRoleArn,
        cloudWatchLogsGroupArn: cwLogsGroupArn,
      },
      pulumi.mergeOptions(opts, {
        dependsOn: [this.bucketPolicy, this.bucketLifecycleConfiguration],
      })
    );
  }

  private setupCloudWatchDashboards(
    opts?: pulumi.ResourceOptions
  ): aws.cloudwatch.Dashboard {
    return new aws.cloudwatch.Dashboard(
      `${this.name}`,
      {
        dashboardName: `Audit-${this.name}`,
        dashboardBody: pulumi.interpolate`{
  "widgets": [
    {
      "type": "log",
      "x": 0,
      "y": 0,
      "width": 24,
      "height": 6,
      "properties": {
        "title": "Console: authentication succeded",
        "query": "SOURCE '${this.cloudWatchLogGroup?.name}' | fields eventTime, sourceIPAddress as IP, userIdentity.accountId as AccountID, userIdentity.type as UserType, userIdentity.arn as ARN | sort @timestamp desc | filter eventName = 'ConsoleLogin' and responseElements.ConsoleLogin = 'Success'",
        "region": "${this.region}",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 6,
      "width": 24,
      "height": 6,
      "properties": {
        "title": "Console: authentication failures",
        "query": "SOURCE '${this.cloudWatchLogGroup?.name}' | fields eventTime, sourceIPAddress as IP, userIdentity.accountId as AccountID, userIdentity.type as UserType, userIdentity.principalId as PrincipalID, userIdentity.userName as UserName, errorMessage | sort @timestamp desc | filter eventName = 'ConsoleLogin' and responseElements.ConsoleLogin = 'Failure'",
        "region": "${this.region}",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 12,
      "width": 24,
      "height": 6,
      "properties": {
        "title": "Access Denied",
        "query": "SOURCE '${this.cloudWatchLogGroup?.name}' | fields eventTime, recipientAccountId as Account, sourceIPAddress as IP, userIdentity.type as UserType, useridentity.arn as ARN, eventName, errorCode, errorMessage | sort @timestamp desc | filter errorCode = 'Client.UnauthorizedOperation'",
        "region": "${this.region}",
        "view": "table"
      }
    },
    {
      "type": "log",
      "x": 0,
      "y": 18,
      "width": 24,
      "height": 6,
      "properties": {
        "title": "Last 20 events",
        "query": "SOURCE '${this.cloudWatchLogGroup?.name}' | fields eventTime, awsRegion as Region, recipientAccountId as Account, eventName, userIdentity.arn as ARN | sort @timestamp desc | limit 20",
        "region": "${this.region}",
        "view": "table"
      }
    }
  ]
}
`,
      },
      opts
    );
  }
}

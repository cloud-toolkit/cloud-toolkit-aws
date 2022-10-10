import * as pulumi from "@pulumi/pulumi";
import * as pulumiAws from "@pulumi/aws";
export declare class AuditLogging extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of AuditLogging.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is AuditLogging;
    /**
     * The S3 Bucket used to store the data.
     */
    readonly bucket: pulumi.Output<pulumiAws.s3.BucketV2>;
    /**
     * The S3 Bucket ACL.
     */
    readonly bucketAcl: pulumi.Output<pulumiAws.s3.BucketAclV2>;
    /**
     * The S3 Bucket Lifecycle Configuration to configure data retention on S3 Bucket.
     */
    readonly bucketLifecycleConfiguration: pulumi.Output<pulumiAws.s3.BucketLifecycleConfigurationV2>;
    /**
     * The S3 Bucket policy.
     */
    readonly bucketPolicy: pulumi.Output<pulumiAws.s3.BucketPolicy>;
    /**
     * The S3 Bucket Public Access Block to make data private.
     */
    readonly bucketPublicAccessBlock: pulumi.Output<pulumiAws.s3.BucketPublicAccessBlock>;
    /**
     * The CloudWatch dashboard to review the audit logs.
     */
    readonly cloudWatchDashboard: pulumi.Output<pulumiAws.cloudwatch.Dashboard>;
    /**
     * The CloudWatch Log Group used to store the data.
     */
    readonly cloudWatchLogGroup: pulumi.Output<pulumiAws.cloudwatch.LogGroup>;
    /**
     * The IAM Policy used by the IAM Role for Cloud Trail.
     */
    readonly cloudWatchPolicy: pulumi.Output<pulumiAws.iam.Policy>;
    /**
     * The IAM Role used by Cloud Trail to write to CloudWatch..
     */
    readonly cloudWatchRole: pulumi.Output<pulumiAws.iam.Role>;
    /**
     * The IAM Role Policy Attachments that attach the IAM Role with the IAM Policy.
     */
    readonly cloudWatchRolePolicyAttachment: pulumi.Output<pulumiAws.iam.RolePolicyAttachment>;
    /**
     * The AWS Organization id.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * The AWS Organization master account id.
     */
    readonly organizationMasterAccountId: pulumi.Output<string>;
    /**
     * The Cloud Trail.
     */
    readonly trail: pulumi.Output<pulumiAws.cloudtrail.Trail>;
    /**
     * Create a AuditLogging resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: AuditLoggingArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a AuditLogging resource.
 */
export interface AuditLoggingArgs {
    /**
     * The AWS provider to used to create the Bucket.
     */
    bucketProvider?: pulumi.Input<pulumiAws.Provider>;
    /**
     * The region to be used to store the data.
     */
    region?: pulumi.Input<string>;
    /**
     * The data retention in days. Defaults to '7'.
     */
    retentionDays?: pulumi.Input<number>;
}

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as enums from "../types/enums";
import * as pulumiAws from "@pulumi/aws";
/**
 * Cloud Toolkit component for Bcukets. Creates a Simple Bucket for object storage
 */
export declare class Bucket extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Bucket.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Bucket;
    /**
     * Instance of our Bucket
     */
    readonly bucket: pulumi.Output<pulumiAws.s3.BucketV2>;
    /**
     * Configuration for controlling bucket encryption
     */
    readonly bucketEncryption: pulumi.Output<pulumiAws.s3.BucketServerSideEncryptionConfigurationV2 | undefined>;
    /**
     * Enforce that bucket owner is all bucket objects
     */
    readonly bucketOwnership: pulumi.Output<pulumiAws.s3.BucketOwnershipControls>;
    /**
     * Controls that IAM policies complies with bucket visibility (public or private)
     */
    readonly bucketPublicAccess: pulumi.Output<pulumiAws.s3.BucketPublicAccessBlock>;
    /**
     * Policy to make public all objects if bucket visibility is public
     */
    readonly bucketPublicAccessPolicy: pulumi.Output<pulumiAws.s3.BucketPolicy | undefined>;
    /**
     * Configuration for controlling bucket versioning
     */
    readonly bucketVersioning: pulumi.Output<pulumiAws.s3.BucketVersioningV2>;
    /**
     * Policy for read-only users
     */
    readonly readOnlyBucketPolicy: pulumi.Output<pulumiAws.iam.Policy>;
    /**
     * Configuration to perform bucket replication
     */
    readonly replicationConfig: pulumi.Output<pulumiAws.s3.BucketReplicationConfig | undefined>;
    /**
     * Policy attachments to perform bucket replication
     */
    readonly replicationPolicyAttachment: pulumi.Output<pulumiAws.iam.RolePolicyAttachment | undefined>;
    /**
     * Required role for managing bucket
     */
    readonly role: pulumi.Output<pulumiAws.iam.Role>;
    /**
     * Configuration to setup a website
     */
    readonly website: pulumi.Output<pulumiAws.s3.BucketWebsiteConfigurationV2 | undefined>;
    /**
     * Policy for write users
     */
    readonly writeBucketPolicy: pulumi.Output<pulumiAws.iam.Policy>;
    /**
     * Create a Bucket resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: BucketArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Bucket resource.
 */
export interface BucketArgs {
    /**
     * Configures encryption parameters for the bucket
     */
    encryption?: pulumi.Input<inputs.storage.BucketEncryptionArgsArgs>;
    /**
     * Set to true to allow policies that may provide access to anyone.
     */
    public: pulumi.Input<boolean>;
    /**
     * Configures replication parameters for the bucket
     */
    replication?: pulumi.Input<inputs.storage.BucketReplicationArgsArgs>;
    /**
     * Set a certain versioning mode for bucket objects
     */
    versioning?: pulumi.Input<enums.storage.BucketVersioningStateArgs>;
    /**
     * Configures a static webpage using bucket files
     */
    website?: pulumi.Input<inputs.storage.BucketWebsiteArgsArgs>;
}

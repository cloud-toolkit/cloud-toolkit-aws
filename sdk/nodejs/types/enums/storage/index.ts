// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***


export const BucketVersioningState = {
    Enabled: "Enabled",
    Disabled: "Disabled",
    Suspended: "Suspended",
} as const;

/**
 * Versioning object mode that is selected for the bucket.
 * Enabled - Bucket keeps track of object versioning.
 * Disabled - Bucket does not keep track of object versioning. Once versioning is Enabled we cannot Disabled versioning.
 * Suspended - Once versioning is Enabled, this feature can be suspended
 */
export type BucketVersioningState = (typeof BucketVersioningState)[keyof typeof BucketVersioningState];

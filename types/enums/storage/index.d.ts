export declare const BucketVersioningStateArgs: {
    readonly Enabled: "Enabled";
    readonly Disabled: "Disabled";
    readonly Suspended: "Suspended";
};
/**
 * Versioning object mode that is selected for the bucket.
 * Enabled - Bucket keeps track of object versioning.
 * Disabled - Bucket does not keep track of object versioning. Once versioning is Enabled we cannot Disabled versioning.
 * Suspended - Once versioning is Enabled, this feature can be suspended
 */
export declare type BucketVersioningStateArgs = (typeof BucketVersioningStateArgs)[keyof typeof BucketVersioningStateArgs];

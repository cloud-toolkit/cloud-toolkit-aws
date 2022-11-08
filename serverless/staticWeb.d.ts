import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
import * as pulumiAws from "@pulumi/aws";
import { Bucket } from "../storage";
export declare class StaticWeb extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of StaticWeb.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is StaticWeb;
    /**
     * DNS Records to expose staticweb
     */
    readonly DNSRecords: pulumi.Output<outputs.serverless.DNSRecordsArgs | undefined>;
    /**
     * DNS Records to validate the certificate
     */
    readonly DNSRecordsForValidation: pulumi.Output<outputs.serverless.DNSRecordsArgs | undefined>;
    /**
     * CloudFront Distribution
     */
    readonly certificate: pulumi.Output<pulumiAws.acm.Certificate | undefined>;
    /**
     * AWS certificate validation
     */
    readonly certificateValidation: pulumi.Output<pulumiAws.acm.CertificateValidation | undefined>;
    /**
     * Content bucket
     */
    readonly contentBucket: pulumi.Output<Bucket>;
    /**
     * Bucket policy to connect Cloud Front distribution
     */
    readonly contentBucketPolicy: pulumi.Output<pulumiAws.s3.BucketPolicy>;
    /**
     * CloudFront Distribution
     */
    readonly distribution: pulumi.Output<pulumiAws.cloudfront.Distribution>;
    /**
     * CloudFront Distribution
     */
    readonly domainValidationOptions: pulumi.Output<pulumiAws.types.output.acm.CertificateDomainValidationOption[] | undefined>;
    /**
     * AWS eastRegion provider. It is required to create and validate certificates
     */
    readonly eastRegion: pulumi.Output<pulumiAws.Provider>;
    /**
     * Logs bucket
     */
    readonly logsBucket: pulumi.Output<pulumiAws.s3.Bucket>;
    /**
     * Staticweb name
     */
    readonly name: pulumi.Output<string>;
    /**
     * OriginAccessIdentity to have access to content bucket
     */
    readonly originAccessIdentity: pulumi.Output<pulumiAws.cloudfront.OriginAccessIdentity>;
    /**
     * Create a StaticWeb resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: StaticWebArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a StaticWeb resource.
 */
export interface StaticWebArgs {
    /**
     * Cloud Front distribution cache
     */
    cache?: pulumi.Input<inputs.serverless.CdnCacheArgsArgs>;
    /**
     * Set to true to configure DNS
     */
    configureDNS?: pulumi.Input<boolean>;
    /**
     * DNS configuration
     */
    dns?: pulumi.Input<inputs.serverless.CdnDnsArgsArgs>;
    /**
     * Set to true to add an alias to wwww.<domain>
     */
    domain?: pulumi.Input<string>;
    /**
     * Set to true to add an alias to wwww.<domain>
     */
    includeWWW?: pulumi.Input<boolean>;
    /**
     * Cloud Front distribution priceClass
     */
    priceClass?: pulumi.Input<string>;
}

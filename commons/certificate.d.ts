import * as pulumi from "@pulumi/pulumi";
import * as pulumiAws from "@pulumi/aws";
/**
 * Certificate is a component that manages an ACM Certificate with the DNS validation.
 */
export declare class Certificate extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Certificate.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Certificate;
    /**
     * The ACM Certificates used for TLS encryption.
     */
    readonly certificate: pulumi.Output<pulumiAws.acm.Certificate>;
    /**
     * The DNS Records.
     */
    readonly dnsRecords: pulumi.Output<pulumiAws.route53.Record[]>;
    /**
     * The Pulumi Provider to create the Certificate.
     */
    readonly provider: pulumi.Output<pulumiAws.Provider>;
    /**
     * Create a Certificate resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: CertificateArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Certificate resource.
 */
export interface CertificateArgs {
    additionalDomains?: pulumi.Input<pulumi.Input<string>[]>;
    domain: pulumi.Input<string>;
    zoneId: pulumi.Input<string>;
}

import * as pulumi from "@pulumi/pulumi";
import * as pulumiKubernetes from "@pulumi/kubernetes";
import { Irsa } from "./index";
/**
 * ExternalDns is a component to manage DNS records according to the Ingresses created in the cluster.
 */
export declare class ExternalDns extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of ExternalDns.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is ExternalDns;
    /**
     * The Namespace used to deploy the component.
     */
    readonly application: pulumi.Output<pulumiKubernetes.apiextensions.CustomResource>;
    /**
     * The IAM roles for service accounts.
     */
    readonly irsa: pulumi.Output<Irsa>;
    /**
     * The Namespace used to deploy the component.
     */
    readonly namespace: pulumi.Output<pulumiKubernetes.core.v1.Namespace | undefined>;
    /**
     * Create a ExternalDns resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ExternalDnsArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a ExternalDns resource.
 */
export interface ExternalDnsArgs {
    /**
     * The list of DNS Zone arn to be used by ExternalDns.
     */
    zoneArns: pulumi.Input<pulumi.Input<string>[]>;
}

import * as pulumi from "@pulumi/pulumi";
import * as pulumiKubernetes from "@pulumi/kubernetes";
import { Irsa } from "./index";
export declare class CertManager extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of CertManager.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is CertManager;
    /**
     * The ArgoCD Application to deploy the component.
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
     * Create a CertManager resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: CertManagerArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a CertManager resource.
 */
export interface CertManagerArgs {
    /**
     * The list of DNS Zone arn to be used by CertManager.
     */
    zoneArns: pulumi.Input<pulumi.Input<string>[]>;
}

import * as pulumi from "@pulumi/pulumi";
import * as pulumiKubernetes from "@pulumi/kubernetes";
export declare class Calico extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Calico.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Calico;
    readonly application: pulumi.Output<pulumiKubernetes.apiextensions.CustomResource>;
    readonly installation: pulumi.Output<pulumiKubernetes.apiextensions.CustomResource>;
    readonly installationCrd: pulumi.Output<pulumiKubernetes.yaml.ConfigFile>;
    readonly namespace: pulumi.Output<pulumiKubernetes.core.v1.Namespace | undefined>;
    /**
     * Create a Calico resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: CalicoArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Calico resource.
 */
export interface CalicoArgs {
}

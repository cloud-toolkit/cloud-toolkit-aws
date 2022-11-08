import * as pulumi from "@pulumi/pulumi";
import * as pulumiKubernetes from "@pulumi/kubernetes";
import { Irsa } from "./index";
export declare class ClusterAutoscaler extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of ClusterAutoscaler.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is ClusterAutoscaler;
    readonly application: pulumi.Output<pulumiKubernetes.apiextensions.CustomResource>;
    readonly irsa: pulumi.Output<Irsa>;
    readonly namespace: pulumi.Output<pulumiKubernetes.core.v1.Namespace | undefined>;
    /**
     * Create a ClusterAutoscaler resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ClusterAutoscalerArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a ClusterAutoscaler resource.
 */
export interface ClusterAutoscalerArgs {
    /**
     * The Cluster name.
     */
    clusterName: pulumi.Input<string>;
}

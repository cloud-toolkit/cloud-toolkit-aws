import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as pulumiAws from "@pulumi/aws";
import * as pulumiKubernetes from "@pulumi/kubernetes";
import { Irsa } from "./index";
export declare class AdotApplication extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of AdotApplication.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is AdotApplication;
    readonly CWLogGroup: pulumi.Output<pulumiAws.cloudwatch.LogGroup>;
    readonly adotCollectorIRSA: pulumi.Output<Irsa>;
    readonly application: pulumi.Output<pulumiKubernetes.apiextensions.CustomResource>;
    readonly fluentBitIRSA: pulumi.Output<Irsa>;
    readonly namespace: pulumi.Output<pulumiKubernetes.core.v1.Namespace | undefined>;
    /**
     * Create a AdotApplication resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: AdotApplicationArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a AdotApplication resource.
 */
export interface AdotApplicationArgs {
    /**
     * The AWS Region.
     */
    awsRegion: pulumi.Input<string>;
    /**
     * The cluster name.
     */
    clusterName: pulumi.Input<string>;
    /**
     * Configure logging.
     */
    logging?: pulumi.Input<inputs.kubernetes.AdotApplicationLoggingArgsArgs>;
    /**
     * Configure metrics.
     */
    metrics?: pulumi.Input<inputs.kubernetes.AdotApplicationMetricsArgsArgs>;
}

// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
import * as enums from "../types/enums";
import * as utilities from "../utilities";

import * as pulumiAws from "@pulumi/aws";
import * as pulumiKubernetes from "@pulumi/kubernetes";

import {Irsa} from "./index";

/**
 * Fluentbit is a component that deploy the Fluentbit component to send logs to AWS CloudWatch.
 */
export class Fluentbit extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'cloud-toolkit-aws:kubernetes:Fluentbit';

    /**
     * Returns true if the given object is an instance of Fluentbit.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is Fluentbit {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Fluentbit.__pulumiType;
    }

    public /*out*/ readonly application!: pulumi.Output<pulumiKubernetes.apiextensions.CustomResource | undefined>;
    /**
     * IRSA for Fluentbit component
     */
    public /*out*/ readonly irsa!: pulumi.Output<Irsa | undefined>;
    /**
     * The AWS CloudWatch LogGroup where application logs are stored.
     */
    public /*out*/ readonly logGroupApplicationLog!: pulumi.Output<pulumiAws.cloudwatch.LogGroup | undefined>;
    /**
     * The AWS CloudWatch LogGroup where dataplane logs are stored.
     */
    public /*out*/ readonly logGroupDataplaneLog!: pulumi.Output<pulumiAws.cloudwatch.LogGroup | undefined>;
    /**
     * The AWS CloudWatch LogGroup where Hosts logs are stored.
     */
    public /*out*/ readonly logGroupHostLog!: pulumi.Output<pulumiAws.cloudwatch.LogGroup | undefined>;
    /**
     * The Namespace used to deploy the component.
     */
    public /*out*/ readonly namespace!: pulumi.Output<pulumiKubernetes.core.v1.Namespace | undefined>;

    /**
     * Create a Fluentbit resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: FluentbitArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.awsRegion === undefined) && !opts.urn) {
                throw new Error("Missing required property 'awsRegion'");
            }
            if ((!args || args.clusterName === undefined) && !opts.urn) {
                throw new Error("Missing required property 'clusterName'");
            }
            resourceInputs["awsRegion"] = args ? args.awsRegion : undefined;
            resourceInputs["clusterName"] = args ? args.clusterName : undefined;
            resourceInputs["logging"] = args ? args.logging : undefined;
            resourceInputs["application"] = undefined /*out*/;
            resourceInputs["irsa"] = undefined /*out*/;
            resourceInputs["logGroupApplicationLog"] = undefined /*out*/;
            resourceInputs["logGroupDataplaneLog"] = undefined /*out*/;
            resourceInputs["logGroupHostLog"] = undefined /*out*/;
            resourceInputs["namespace"] = undefined /*out*/;
        } else {
            resourceInputs["application"] = undefined /*out*/;
            resourceInputs["irsa"] = undefined /*out*/;
            resourceInputs["logGroupApplicationLog"] = undefined /*out*/;
            resourceInputs["logGroupDataplaneLog"] = undefined /*out*/;
            resourceInputs["logGroupHostLog"] = undefined /*out*/;
            resourceInputs["namespace"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(Fluentbit.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a Fluentbit resource.
 */
export interface FluentbitArgs {
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
    logging?: pulumi.Input<inputs.kubernetes.FluentbitLoggingArgs>;
}

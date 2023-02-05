// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../../types/input";
import * as outputs from "../../types/output";
import * as enums from "../../types/enums";
import * as utilities from "../../utilities";

import * as pulumiAws from "@pulumi/aws";
import * as pulumiKubernetes from "@pulumi/kubernetes";

export interface AdditionalQueueArgs {
    /**
     * Amazon Resource Name for the Queue component.
     */
    arn: pulumi.Input<string>;
    /**
     * Endpoint of the Queue component in AWS.
     */
    url: pulumi.Input<string>;
}

export interface NotificationTypeArgs {
    /**
     * Enables the feature.
     */
    enabled: pulumi.Input<boolean>;
    /**
     * Include original headers on the stored messages in the Queue(s).
     */
    includeOriginalHeaders?: pulumi.Input<boolean>;
    /**
     * Arguments to configure the Queues subscribed to the Notification Type Topic.
     * If left blank, a default standard, non-fifo, Queue and a Dead Letter Queue that is attached to the former will be created.
     */
    queues?: pulumi.Input<inputs.email.NotificationTypeQueuesArgs>;
}

export interface NotificationTypeQueuesArgs {
    /**
     * Arguments to include Queues built and implemented outside of the Email Sender Component. Useful when subscribing a single Queue to two or more Topics or when migrating existing ones.
     */
    additionalQueues: pulumi.Input<pulumi.Input<inputs.email.AdditionalQueueArgs>[]>;
    /**
     * Configuration for the Default Queues. If left blank, Queues created for this Notification Type will be standard, non-fifo, with a Dead Letter Queue attached to them.
     */
    defaultQueuesConfig?: pulumi.Input<inputs.serverless.QueueArgs>;
    /**
     * Number of default Queues that will be created and attached to a Topic.
     */
    numberOfDefaultQueues: pulumi.Input<number>;
}

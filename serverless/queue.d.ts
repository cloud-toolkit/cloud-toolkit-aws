import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as pulumiAws from "@pulumi/aws";
/**
 * Cloud Toolkit component for Queues. Creates a Simple Queue Service Queue alongside a Dead Letter Queue for faulty message deliveries.
 */
export declare class Queue extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Queue.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Queue;
    /**
     * Dead Letter Queue associated with the component. Messages that were not delivered will be sent here.
     */
    readonly deadLetterQueue: pulumi.Output<pulumiAws.sqs.Queue | undefined>;
    /**
     * Simple Queue Service Queue underline the component.
     */
    readonly sqsQueue: pulumi.Output<pulumiAws.sqs.Queue>;
    /**
     * Create a Queue resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: QueueArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Queue resource.
 */
export interface QueueArgs {
    /**
     * Dead Letter Queue attached to the component to create.
     */
    DeadLetterQueueTypeArgs?: pulumi.Input<inputs.serverless.DeadLetterQueueTypeArgsArgs>;
    /**
     * Set to true to create the Queue as FiFo. False for a Standard Queue.
     */
    isFifo?: pulumi.Input<boolean>;
    /**
     * The limit for a Queue message size in bytes. Minimum is 1 byte (1 character) and Maximum 262,144 bytes (256 KiB). By default a message can be 256 KiB large.
     */
    maxMessageSize?: pulumi.Input<number>;
    /**
     * The amount of time that a message will be stored in the Queue without being deleted. Minimum is 60 seconds (1 minutes) and Maximum 1,209,600 (14 days) seconds. By default a message is retained 4 days.
     */
    messageRetentionSeconds?: pulumi.Input<number>;
    /**
     * Custom policy for the Queue.
     */
    policy?: pulumi.Input<string>;
}

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { QueueArgs, DeadLetterQueueTypes, validateConfig } from "./queueArgs";

import { UnsupportedTypeError } from "./errors";

export { QueueArgs };

/**
 * Type Name for the component
 */
export const TYPENAME = "cloud-toolkit-aws:serverless:Queue";

const PERMISSIVE_MAX_RECEIVED_COUNT = 10;
const RESTRICTIVE_MAX_RECEIVED_COUNT = 1;
const MAX_RECEIVED_COUNT = new Map<DeadLetterQueueTypes, number>([
  [DeadLetterQueueTypes.PERMISSIVE, PERMISSIVE_MAX_RECEIVED_COUNT],
  [DeadLetterQueueTypes.RESTRICTIVE, RESTRICTIVE_MAX_RECEIVED_COUNT],
]);

const STANDARD_SUFFIX = "-standard";
// Unlike the standard suffix, this is needed in AWS.
const FIFO_SUFFIX = ".fifo";

// Temporal measure - Should be defined by the user in a future common advanced settings
const uniqueName = true;

/**
 * Cloud Toolkit component for Queues. Creates a Simple Queue Service Queue alongside a Dead Letter Queue for faulty message deliveries.
 */
export class Queue extends pulumi.ComponentResource {
  name: string;
  /**
   * Simple Queue Service Queue underline the component.
   */
  public readonly sqsQueue: aws.sqs.Queue;
  /**
   * Dead Letter Queue associated with the component. Messages that were not delivered will be sent here.
   */
  public readonly deadLetterQueue?: aws.sqs.Queue;

  /**
   * Dead Letter Queues configuration to allow for incoming redrived messages from other queues.
   */
  private readonly ALLOWALL_REDRIVE = `{ "redrivePermission": "allowAll" }`;
  /**
   * Dead letter Queues suffix attached to their names.
   */
  private readonly DL_NAME_SUFFIX = `-deadletter`;

  /**
   * Constructor for the class.
   * @param {string} name
   * @param {QueueArgs} data
   * @param {pulumi.ResourceOptions} opts
   */
  constructor(name: string, data: QueueArgs, opts?: pulumi.ResourceOptions) {
    super(TYPENAME, name, data, opts);
    data = validateConfig(data);
    const QueueArgs = <aws.sqs.QueueArgs>{
      fifoQueue: data.isFifo,
      maxMessageSize: data.maxMessageSize,
      messageRetentionSeconds: data.messageRetentionSeconds,
    };

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
      provider: opts?.provider,
    });

    if (data.DeadLetterQueueTypeArgs?.enable === true) {
      if (data.DeadLetterQueueTypeArgs?.existingDeadLetterQueueArn) {
        QueueArgs.redrivePolicy = this.getAdjustedRedrivePolicy(
          data.DeadLetterQueueTypeArgs?.existingDeadLetterQueueArn,
          data.DeadLetterQueueTypeArgs.type
        );
      } else {
        const queue = this.createDeadLetterQueue(name, QueueArgs, resourceOpts, data.DeadLetterQueueTypeArgs.messageRetentionSeconds,);
        const arn = queue.arn;
        QueueArgs.redrivePolicy = this.getAdjustedRedrivePolicy(
          arn,
          data.DeadLetterQueueTypeArgs.type
        );
        this.deadLetterQueue = queue;
      }
    }

    QueueArgs.policy = data.policy;
    this.name = QueueArgs.fifoQueue
      ? `${name}${FIFO_SUFFIX}`
      : `${name}${STANDARD_SUFFIX}`;
    this.sqsQueue = this.createQueue(this.name, QueueArgs, resourceOpts);

    this.registerOutputs({
      sqsQueue: this.sqsQueue,
      deadLetterQueue: this.deadLetterQueue,
    })
  }

  /**
   * Creates the SQS Queue and returns it.
   * @param {string} name
   * @param {aws.sqs.QueueArgs} QueueArgs
   * @param {pulumi.ResourceOptions} opts
   * @returns {aws.sqs.Queue}
   */
  private createQueue(
    name: string,
    QueueArgs: aws.sqs.QueueArgs,
    opts: pulumi.ResourceOptions
  ) {
    if (uniqueName === true) {
      QueueArgs = { ...QueueArgs, name: name };
    }
    return new aws.sqs.Queue(name, QueueArgs, opts);
  }

  /**
   * Creates the Dead Letter SQS Queue and returns it.
   * @param name
   * @param {string} name
   * @param {aws.sqs.QueueArgs} QueueArgs
   * @param {pulumi.ResourceOptions} opts
   * @returns {aws.sqs.Queue}
   */
  public createDeadLetterQueue(
    name: string,
    QueueArgs: aws.sqs.QueueArgs,
    opts: pulumi.ResourceOptions,
    messageRetentionSeconds?: number
  ) {
    const dlName = `${name}${this.DL_NAME_SUFFIX}`;
    const dlArgs = {
      ...QueueArgs,
      redriveAllowPolicy: this.ALLOWALL_REDRIVE,
      messageRetentionSeconds: messageRetentionSeconds
    };
    return this.createQueue(dlName, dlArgs, opts);
  }

  /**
   * Sets the configuration to redrive messages to a Dead Letter Queue.
   * @param {Output<string> | string} dlArn
   * @param {DeadLetterQueueTypes} dlType
   * @returns {Output<string>}
   */
  private getAdjustedRedrivePolicy(
    dlArn: pulumi.Input<string>,
    dlType: DeadLetterQueueTypes
  ) {
    if (!Object.values(DeadLetterQueueTypes).includes(dlType)) {
      throw new UnsupportedTypeError(dlType, DeadLetterQueueTypes);
    }

    return pulumi.interpolate`{ "deadLetterTargetArn": "${dlArn}", "maxReceiveCount": ${MAX_RECEIVED_COUNT.get(
      dlType
    )} }`;
  }
}

import * as pulumi from "@pulumi/pulumi";
import defaultsDeep from "lodash.defaultsdeep";

/**
 * Dead Letter Queue type that will receive the faulty messages from the base Queue.
 * Permissive - Messages will be sent to the Dead Letter Queue after 10 failed delivery attempts.
 * Restrictive - Messages will be sent to the Dead Letter Queue after the first failed delivery attempt.
 */
export enum DeadLetterQueueTypes {
  PERMISSIVE = "permissive",
  RESTRICTIVE = "restrictive",
}

const MIN_MESSAGE_RETENTION_TIME = 60;
const MAX_MESSAGE_RETENTION_TIME = 1209600;

const MIN_MESSAGE_SIZE = 1;
const MAX_MESSAGE_SIZE = 262144;

interface DeadLetterQueueTypeArgs {
  /**
   * Enables the feature.
   */
  enable: boolean;
  /**
   * Dead Letter Queue type attached to the component to create.
   */
  type: DeadLetterQueueTypes;
  /**
   * Placing a Queue ARN will set said already existing Queue as a Dead Letter Queue for the new one.
   */
  existingDeadLetterQueueArn?: pulumi.Input<string>;
  /**
   * The amount of time that a message will be stored in the Dead Letter Queue without being deleted. Minimum is 60 seconds (1 minutes) and Maximum 1,209,600 (14 days) seconds. By default a message is retained 4 days.
   */
  messageRetentionSeconds?: number;
}

/**
 * Arguments to create a Cloud Toolkit Queue component.
 */
export interface QueueArgs {
  /**
   * Set to true to create the Queue as FiFo. False for a Standard Queue.
   */
  isFifo?: boolean;
  /**
   * Dead Letter Queue attached to the component to create.
   */
  DeadLetterQueueTypeArgs?: DeadLetterQueueTypeArgs;
  /**
   * The limit for a Queue message size in bytes. Minimum is 1 byte (1 character) and Maximum 262,144 bytes (256 KiB). By default a message can be 256 KiB large.
   */
  maxMessageSize?: number;
  /**
   * The amount of time that a message will be stored in the Queue without being deleted. Minimum is 60 seconds (1 minutes) and Maximum 1,209,600 (14 days) seconds. By default a message is retained 4 days.
   */
  messageRetentionSeconds?: number;
  /**
   * Custom policy for the Queue.
   */
  policy?: pulumi.Output<string>;
}

export const defaultConfig = <QueueArgs>{
  isFifo: false,
  maxMessageSize: 262144,
  messageRetentionSeconds: 345600,
  DeadLetterQueueTypeArgs: {
    enable: true,
    type: DeadLetterQueueTypes.PERMISSIVE,
    messageRetentionSeconds: 345600
  },
};

export function validateConfig(c: QueueArgs): QueueArgs {
  const config = defaultsDeep({ ...c }, defaultConfig);

  if (config.messageRetentionSeconds < MIN_MESSAGE_RETENTION_TIME) {
    throw new Error(
      `Message Retention Time should be at least ${MIN_MESSAGE_RETENTION_TIME} seconds.`
    );
  }

  if (config.messageRetentionSeconds > MAX_MESSAGE_RETENTION_TIME) {
    throw new Error(
      `Message Retention Time should be less than ${MAX_MESSAGE_RETENTION_TIME} seconds.`
    );
  }

  if (config.maxMessageSize < MIN_MESSAGE_SIZE) {
    throw new Error(
      `Message Message Size should be at least ${MIN_MESSAGE_RETENTION_TIME} bytes.`
    );
  }

  if (config.maxMessageSize > MAX_MESSAGE_SIZE) {
    throw new Error(
      `Maximum Message Size should be less than ${MAX_MESSAGE_RETENTION_TIME} bytes.`
    );
  }

  return config;
}

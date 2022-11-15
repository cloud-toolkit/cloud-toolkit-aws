import * as pulumi from "@pulumi/pulumi";
import {
  Queue,
  QueueArgs,
  DeadLetterQueueTypes
} from "@cloudtoolkit/aws/serverless";

// Retrieve base config
const config = new pulumi.Config();

const isFifo = config.requireBoolean("is_fifo");
const deadLetterQueueType = DeadLetterQueueTypes.PERMISSIVE


const queueConfig = <QueueArgs>{
  isFifo: isFifo,
  deadLetterQueueType: deadLetterQueueType
};

const queue = new Queue("queueName", queueConfig);

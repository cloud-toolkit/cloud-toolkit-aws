import { DeadLetterQueueTypes, QueueArgs } from "../../queueArgs";

export default <QueueArgs>{
  isFifo: false,
  deadLetterQueueType: DeadLetterQueueTypes.PERMISSIVE,
};

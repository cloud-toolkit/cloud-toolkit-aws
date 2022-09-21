import { deadLetterQueueTypes, QueueArgs } from "../../queueArgs";

export default <QueueArgs>{
  isFifo: false,
  deadLetterQueueType: deadLetterQueueTypes.PERMISSIVE,
};

import { QueueArgs } from "../../queueArgs";

export default <QueueArgs>{
  isFifo: true,
  maxMessageSize: 2048,
  messageRetentionSeconds: 500,
};

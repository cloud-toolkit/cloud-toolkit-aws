import { EmailSenderArgs } from "../../config";

export default <EmailSenderArgs>{
  identity: "example@astrokube.com",
  bounce: {
    enabled: true,
    includeOriginalHeaders: true,
    queues: {},
  },
  complaint: {
    enabled: false,
  },
  delivery: {
    enabled: false,
  },
};

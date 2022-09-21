import { EmailSenderArgs } from "../../config";

export default <EmailSenderArgs>{
  identity: "example@astrokube.com",
  bounce: {
    enabled: true,
    includeOriginalHeaders: true,
  },
  complaint: {
    enabled: true,
    includeOriginalHeaders: true,
  },
  delivery: {
    enabled: false,
  },
};

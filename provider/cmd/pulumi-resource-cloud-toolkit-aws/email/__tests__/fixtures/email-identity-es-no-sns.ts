import { EmailSenderArgs } from "../../config";

export default <EmailSenderArgs>{
  identity: "example@astrokube.com",
  bounce: {
    enabled: false,
  },
  complaint: {
    enabled: false,
  },
  delivery: {
    enabled: false,
  },
};

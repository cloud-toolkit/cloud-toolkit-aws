import * as pulumi from "@pulumi/pulumi";
import {
  EmailSender,
  EmailSenderArgs,
} from "@cloudtoolkit/aws/email";

// Retrieve base config
const config = new pulumi.Config();

// Retrieve email sender config
const identity = config.require("identity");
const configureDNS = config.requireBoolean("configureDNS");


const emailSenderConfig = <EmailSenderArgs>{
  identity: identity,
  configureDNS: configureDNS
};

const emailManager = new EmailSender("emailSenderName", emailSenderConfig);

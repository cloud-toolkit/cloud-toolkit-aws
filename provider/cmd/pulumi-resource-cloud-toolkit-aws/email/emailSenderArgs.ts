import defaultsDeep from "lodash.defaultsdeep";
import * as pulumi from "@pulumi/pulumi";
import { QueueArgs } from "../serverless";
import { isDomain } from "./sender";

/**
 * Types of Email Notifications that are covered by Email Sender.
 * * Bounce usually occurs when the recipient address does not exist, their inbox is full, the content of the message if flagged or other casuistics.
 * * Complaint indicates that the recipient does not want the email that was sent to them. It is usually a proactive action and it is best to remove the recipient address from the mailing list whenever it is.
 * * Delivery marks an email as correctly delivered.
 */
export enum NotificationTypes {
  Bounce = "Bounce",
  Complaint = "Complaint",
  Delivery = "Delivery",
}

/**
 * Arguments to define the extra Queues that are subscribed to the Notification Type Topic. All the parameters have to refer to the same Queue component.
 * You can use the same Queue for multiple Notification Type Topics.
 */
export interface AdditionalQueueArgs {
  /**
   * Amazon Resource Name for the Queue component.
   */
  arn: pulumi.Input<string>;
  /**
   * Endpoint of the Queue component in AWS.
   */
  url: pulumi.Input<string>;
}

/**
 * Arguments for the Queues subscribed to a Notification Type Topic. By default, Queues are only subscribed to a single Topic.
 */
interface NotificationTypeQueuesArgs {
  /**
   * Number of default Queues that will be created and attached to a Topic.
   */
  numberOfDefaultQueues: number;
  /**
   * Configuration for the Default Queues. If left blank, Queues created for this Notification Type will be standard, non-fifo, with a Dead Letter Queue attached to them.
   */
  defaultQueuesConfig?: QueueArgs;
  /**
   * Arguments to include Queues built and implemented outside of the Email Sender Component. Useful when subscribing a single Queue to two or more Topics or when migrating existing ones.
   */
  additionalQueues: AdditionalQueueArgs[];
}

/**
 * Arguments to establish the configuration about a Notification Type.
 */
export interface NotificationTypeArgs {
  /**
   * Enables the feature.
   */
  enabled: boolean;
  /**
   * Include original headers on the stored messages in the Queue(s).
   */
  includeOriginalHeaders?: boolean;
  /**
   * Arguments to configure the Queues subscribed to the Notification Type Topic.
   * If left blank, a default standard, non-fifo, Queue and a Dead Letter Queue that is attached to the former will be created. 
   */
  queues?: NotificationTypeQueuesArgs;
}

/**
 * Arguments to create a Cloud Toolkit Email Sender component.
 */
export interface EmailSenderArgs {
  /**
   * Address of the Domain or Email used to send the emails through Email Sender.
   * If an Email address is provided, Email Sender will set a Simple Email Service Email Identity. Verification will need to be manual.
   * Else, if a Domain address is configured, Email Sender will create a Simple Email Service Domain Identity. 
   * By default, it will attempt to verify the Domain by looking the Route 53 Domain Registry in the AWS account that is applying the infrastructure changes.
   * If the Domain is registered elsewhere, verification needs to be manual.
   */
  identity: string;
  /**
   * In the case of a Domain Identity, enables automatic verification by creating DKIM DNS Records in the domain registration on Route 53.
   * If the domain is not registered in the Route 53 on the same AWS account that is applying the infrastructure changes, the process will fail unless this flag is set to False.
   */
  configureDNS?: boolean;

  /**
   * Arguments to manage incoming Bounce notifications.
   */
  bounce?: NotificationTypeArgs;
  /**
   * Arguments to manage incoming Complaint notifications.
   */
  complaint?: NotificationTypeArgs;
  /**
   * Arguments to manage incoming Delivery notifications.
   */
  delivery?: NotificationTypeArgs;
}

/**
 * DKIM records associated with a Domain Identity.
 */
export interface DnsDkimRecordArgs {
  /**
   * Name of the Record.
   */
  name: pulumi.Input<string>;
  /**
   * Token of the Record.
  */
  token: pulumi.Input<string>;
}

/**
 * Default Arguments for the Queue(s) attached to a Notification Type Topic.
 */
export const defaultQueueConfig = <QueueArgs>{
  deadLetterQueueType: "permissive",
};

const defaultQueuesPerType = 1;
/**
 * Default Arguments for an Email Sender Component.
 */
export const defaultArgs = <QueueArgs>{
  defaultReputationMetricsEnable: false,
  defaultIncludeOriginalHeaders: true,
  configureDNS: true,
  bounce: {
    enabled: true,
    queues: {
      numberOfDefaultQueues: defaultQueuesPerType,
      additionalQueues: [],
    },
  },
  complaint: {
    enabled: true,
    queues: {
      numberOfDefaultQueues: defaultQueuesPerType,
      additionalQueues: [],
    },
  },
  delivery: {
    enabled: true,
    queues: {
      numberOfDefaultQueues: defaultQueuesPerType,
      additionalQueues: [],
    },
  },
};

const regularExpressionEmailOrDomain = /^[^\s@]+@?[^\s@]+\.[^\s@]+$/i;

export function validateArgs(a: EmailSenderArgs): EmailSenderArgs {
  if (!a.identity) {
    throw new Error("Identity address is not provided.");
  }

  if (!isDomain(a.identity) && a.configureDNS === true) {
    console.warn(
      "Email Identities do not need DNS configuration. Did you want to set a Domain Identity?"
    );
  }

  const args = defaultsDeep({ ...a }, defaultArgs);

  args.configureDNS = isDomain(args.identity) && args.configureDNS === true;

  const r = new RegExp(regularExpressionEmailOrDomain);
  if (!r.test(args.identity)) {
    throw new Error(`Invalid identity address: ${args.identity}.`);
  }

  if (args.bounce && args.bounce.enabled === true) {
    if (!args.bounce.queues) {
      console.warn(
        "Missing queue parameter for bounce notification topic. Setting it as default."
      );
      args.bounce.queues = <NotificationTypeQueuesArgs>{
        numberOfDefaultQueues: defaultQueuesPerType,
        additionalQueues: [],
      };
    } else if (!args.bounce.queues.numberOfDefaultQueues) {
      console.warn("Missing default queue number. Setting it as default.");
      args.bounce.queues.numberOfDefaultQueues = defaultQueuesPerType;
    }
  }

  if (args.complaint && args.complaint.enabled === true) {
    if (!args.complaint.queues) {
      console.warn(
        "Missing queue parameter for complaint notification topic. Setting it as default."
      );
      args.complaint.queues = <NotificationTypeQueuesArgs>{
        numberOfDefaultQueues: defaultQueuesPerType,
        additionalQueues: [],
      };
    } else if (!args.complaint.queues.numberOfDefaultQueues) {
      console.warn("Missing default queue number. Setting it as default.");
      args.complaint.queues.numberOfDefaultQueues = defaultQueuesPerType;
    }
  }

  if (args.delivery && args.delivery.enabled === true) {
    if (!args.delivery.queues) {
      console.warn(
        "Missing queue parameter for delivery notification topic. Setting it as default."
      );
      args.delivery.queues = <NotificationTypeQueuesArgs>{
        numberOfDefaultQueues: defaultQueuesPerType,
        additionalQueues: [],
      };
    } else if (!args.delivery.queues.numberOfDefaultQueues) {
      console.warn("Missing default queue number. Setting it as default.");
      args.delivery.queues.numberOfDefaultQueues = defaultQueuesPerType;
    }
  }

  return args;
}

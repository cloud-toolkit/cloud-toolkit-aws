import * as pulumi from "@pulumi/pulumi";

import { Queue, QueueArgs } from "./serverless/queue";
import { EmailSender, EmailSenderArgs } from "./email/sender";
import { Example, ExampleArgs } from "./example";

export class Provider implements pulumi.provider.Provider {
  constructor(readonly version: string, readonly schema: string) {}

  async construct(
    name: string,
    type: string,
    inputs: pulumi.Inputs,
    options: pulumi.ComponentResourceOptions
  ): Promise<pulumi.provider.ConstructResult> {
    switch (type) {
      case "cloud-toolkit-aws:index:Example":
        return await constructExample(name, inputs, options);
      case "cloud-toolkit-aws:serverless:Queue":
        return await constructQueue(name, inputs, options);
      case "cloud-toolkit-aws:email:EmailSender":
        return await constructEmailSender(name, inputs, options);
      default:
        throw new Error(`unknown resource type ${type}`);
    }
  }
}

async function constructExample(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const example = new Example(name, inputs as ExampleArgs, options);

  return {
    urn: example.urn,
    state: {
      bucket: example.bucket,
    },
  };
}

async function constructQueue(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const q = new Queue(name, inputs as  QueueArgs, options);

  return {
    urn: q.sqsQueue.urn,
    state: {
      sqsQueue: q.sqsQueue,
      deadLetterQueue: q.deadLetterQueue
    },
  };
}

async function constructEmailSender(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const emailSender = new EmailSender(name, inputs as EmailSenderArgs, options);

  return {
    urn: emailSender.urn,
    state: {
      resourceGroups: emailSender.resourceGroups,
      domainIdentity: emailSender.domainIdentity,
      emailIdentity: emailSender.emailIdentity,
      address: emailSender.address,
      domainDKIM: emailSender.domainDKIM,
      dnsDkimRecords: emailSender.dnsDkimRecords,
      dnsZoneId: emailSender.dnsZoneId,
      dnsRecords: emailSender.dnsRecords,
      bounceTopic: emailSender.bounceTopic,
      bounceIdentityNotificationTopic: emailSender.bounceIdentityNotificationTopic,
      bounceQueues: emailSender.bounceQueues,
      bounceAdditionalQueues: emailSender.bounceAdditionalQueues,
      bounceAdditionalQueuesPolicies: emailSender.bounceAdditionalQueuesPolicies,
      bounceTopicSubscriptions: emailSender.bounceTopicSubscriptions,
      complaintTopic: emailSender.complaintTopic,
      complaintIdentityNotificationTopic: emailSender.complaintIdentityNotificationTopic,
      complaintQueues: emailSender.complaintQueues,
      complaintAdditionalQueues: emailSender.complaintAdditionalQueues,
      complaintAdditionalQueuesPolicies: emailSender.complaintAdditionalQueuesPolicies,
      complaintTopicSubscriptions: emailSender.complaintTopicSubscriptions,
      deliveryTopic: emailSender.deliveryTopic,
      deliveryIdentityNotificationTopic: emailSender.deliveryIdentityNotificationTopic,
      deliveryQueues: emailSender.deliveryQueues,
      deliveryAdditionalQueues: emailSender.deliveryAdditionalQueues,
      deliveryAdditionalQueuesPolicies: emailSender.deliveryAdditionalQueuesPolicies,
      deliveryTopicSubscriptions: emailSender.deliveryTopicSubscriptions,
      senderPolicy: emailSender.senderPolicy,
      notificationsPolicy: emailSender.notificationsPolicy,
    },
  };
}

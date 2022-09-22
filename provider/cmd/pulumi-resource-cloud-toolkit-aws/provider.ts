import * as pulumi from "@pulumi/pulumi";
import * as bucket from "./storage/bucket";

import { Queue, QueueArgs } from "./serverless/queue";
import { EmailSender, EmailSenderArgs } from "./email/sender";
import { Cluster, ClusterArgs, NodeGroup, NodeGroupArgs } from "./kubernetes";
import { AccountIam, AccountIamArgs } from "./landingZone";
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
      case "cloud-toolkit-aws:kubernetes:Cluster":
        return await constructKubernetesCluster(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:NodeGroup":
        return await constructKubernetesNodeGroup(name, inputs, options);
      case "cloud-toolkit-aws:landingZone:AccountIam":
        return await constructLandingZoneAccountIam(name, inputs, options);
      case "cloud-toolkit-aws:storage:Bucket":
        return await constructBucket(name, inputs, options);
      default:
        throw new Error(`unknown resource type ${type}`);
    }
  }
}

async function constructKubernetesCluster(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new Cluster(name, inputs as ClusterArgs, options);

  return {
    urn: resource.urn,
    state: {
      cluster: resource.cluster,
      cniChart: resource.cniChart,
      defaultOidcProvider: resource.defaultOidcProvider,
      kubeconfig: resource.kubeconfig,
      nodeGroups: resource.nodeGroups,
      provider: resource.provider,
      provisionerRole: resource.provisionerRole,
      provisionerRolePolicy: resource.provisionerRolePolicy,
      provisionerProvider: resource.provisionerProvider,
      role: resource.role,
      rolePolicyAttachment: resource.rolePolicyAttachment,
      securityGroup: resource.securityGroup,
      subnetTags: resource.subnetTags,
    },
  };
}

async function constructKubernetesNodeGroup(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new NodeGroup(name, inputs as NodeGroupArgs, options);
  return {
    urn: resource.urn,
    state: {
      role: resource.role,
      rolePolcyAttachments: resource.rolePolicyAttachments,
      launchTemplate: resource.launchTemplate,
      nodeGroup: resource.nodeGroup,
    },
  };
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

async function constructLandingZoneAccountIam(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const component = new AccountIam(name, inputs as AccountIamArgs, options);

  return {
    urn: component.urn,
    state: {
      alias: component.alias,
      passwordPolicy: component.passwordPolicy,
    }
  };
}

async function constructBucket(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const q = new bucket.Bucket(name, inputs as bucket.BucketArgs, options);

  return {
    urn: q.urn,
    state: {
      role: q.role,
      bucket: q.bucket,
      bucketVersioning: q.bucketVersioning,
      writeBucketPolicy: q.writeBucketPolicy,
      readOnlyBucketPolicy: q.readOnlyBucketPolicy,
      website: q.website,
      bucketPublicAccess: q.bucketPublicAccess,
      bucketPublicAccessPolicy: q.bucketPublicAccessPolicy,
      bucketOwnership: q.bucketOwnership,
      replicationPolicyAttachment: q.replicationPolicyAttachment,
      replicationConfig: q.replicationConfig,
      bucketEncryption: q.bucketEncryption
    },
  };
}

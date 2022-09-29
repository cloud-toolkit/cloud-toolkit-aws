import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import {
  EmailSenderArgs,
  validateArgs,
  NotificationTypeArgs,
  NotificationTypes,
  defaultQueueConfig,
  DnsDkimRecordArgs,
  AdditionalQueueArgs,
} from "./emailSenderArgs";

import { DomainIdentity } from "@pulumi/aws/ses";
import { Queue } from "../serverless";

import defaultsDeep from "lodash.defaultsdeep";

export { EmailSenderArgs };

const DKIM_RECORD_COUNT = 3;

export function isDomain(address: string) {
  return !address.includes("@");
}

/**
 * Cloud Toolkit component for an Email Sender. Creates a Simple Email Service Email or Domain Identity alongside Simple Notification Service Topics and Simple Queue Service Queues to manage bounce, complaints or delivered messages.
 * In the case of building a Domain Identity, if it is registered in the Route 53 on the AWS account that is applying the infrastructure changes, Cloud Toolkit can verify it automatically by creating the DKIM DNS Records.
 */
export class EmailSender extends pulumi.ComponentResource {
  private args: EmailSenderArgs;
  private name: string;
  private tags: { [key: string]: string };

  /**
   * Resource Groups that contain the underlying components such as Topics or Queues that belong to the Email Sender.
   */
  public readonly resourceGroups: aws.resourcegroups.Group[] = [];

  private readonly identity: aws.ses.EmailIdentity | aws.ses.DomainIdentity;
  /**
   * Domain Identity component. Left blank if an Email Identity was used instead.
   */
  public readonly domainIdentity?: aws.ses.DomainIdentity;

  /**
   * Email Identity component. Left blank if a Domain Identity was used instead.
   */
  public readonly emailIdentity?: aws.ses.EmailIdentity;

  /**
   * Address of the Identity, regardless if it is a Domain or an Email.
   */
  public readonly address: string;

  /**
   * Domain DKIM. Only applies for Domain Identities.
   */
  public readonly domainDKIM?: aws.ses.DomainDkim;

  /**
   * DNS DKIM Records. Only applies for Domain Identities.
   */
  public readonly dnsDkimRecords: DnsDkimRecordArgs[] = [];
  
  /**
   * DNS zone identifier in Route 53 for the Domain. Only applies for Domain Identities that are registered using Route 53.
   */
  public readonly dnsZoneId?: pulumi.Input<string>;

  /**
   * DNS records stored in the Domain registration in Route 53. Only applies for Domain Identities that are registered using Route 53.
   */
  public readonly dnsRecords: aws.route53.Record[] = [];

  /**
   * SNS Topic for bounced emails.
   */
  public readonly bounceTopic?: aws.sns.Topic;

  /**
   * Identity Notification Topic for bounced emails.
   */
  public readonly bounceIdentityNotificationTopic?: aws.ses.IdentityNotificationTopic;
  
  /**
   * SQS Queues subscribed to the SNS Topic that receives bounced emails. These Queues were created automatically by the Email Sender component.
   */
  public readonly bounceQueues: Queue[] = [];
  
  /**
   * Additional SQS Queues subscribed to the SNS Topic that receives bounced emails. These Queues were created outside the Email Sender component.
   */
  public readonly bounceAdditionalQueues: AdditionalQueueArgs[] = [];
  
  /**
   * Queue Policies attached to the externally provided Bounce SQS Queues.
   */
  public readonly bounceAdditionalQueuesPolicies: aws.sqs.QueuePolicy[] = [];
  
  /**
   * SNS subscriptions of the SQS Queues to the Bounce SNS Topic.
   */
  public readonly bounceTopicSubscriptions: aws.sns.TopicSubscription[] = [];

  /**
   * SNS Topic for complained emails.
   */
  public readonly complaintTopic?: aws.sns.Topic;
  
  /**
   * Identity Notification Topic for complained emails.
   */
  public readonly complaintIdentityNotificationTopic?: aws.ses.IdentityNotificationTopic;
  
  /**
   * SQS Queues subscribed to the SNS Topic that receives complained emails. These Queues were created automatically by the Email Sender component.
   */
  public readonly complaintQueues: Queue[] = [];
  
  /**
   * Additional SQS Queues subscribed to the SNS Topic that receives complained emails. These Queues were created outside the Email Sender component.
   */
  public readonly complaintAdditionalQueues: AdditionalQueueArgs[] = [];
  
  /**
   * Queue Policies attached to the externally provided Complaint SQS Queues.
   */
  public readonly complaintAdditionalQueuesPolicies: aws.sqs.QueuePolicy[] = [];
  
  /**
   * SNS subscriptions of the SQS Queues to the Complaint SNS Topic.
   */
  public readonly complaintTopicSubscriptions: aws.sns.TopicSubscription[] = [];

  /**
   * SNS Topic for delivered emails.
   */
  public readonly deliveryTopic?: aws.sns.Topic;
  
  /**
   * Identity Notification Topic for delivered emails.
   */
  public readonly deliveryIdentityNotificationTopic?: aws.ses.IdentityNotificationTopic;
  
  /**
   * SQS Queues subscribed to the SNS Topic that receives delivered emails. These Queues were created automatically by the Email Sender component.
   */
  public readonly deliveryQueues: Queue[] = [];
  
  /**
   * Additional SQS Queues subscribed to the SNS Topic that receives delivered emails. These Queues were created outside the Email Sender component.
   */
  public readonly deliveryAdditionalQueues: AdditionalQueueArgs[] = [];
  
  /**
   * Queue Policies attached to the externally provided Delivery SQS Queues.
   */
  public readonly deliveryAdditionalQueuesPolicies: aws.sqs.QueuePolicy[] = [];
  
  /**
   * SNS subscriptions of the SQS Queues to the Delivery SNS Topic.
   */
  public readonly deliveryTopicSubscriptions: aws.sns.TopicSubscription[] = [];

  /**
   * Policy that when attached to an user, allows them to send messages using the Email Sender Identity.
   */
  public readonly senderPolicy: aws.iam.Policy;
  
  /**
   * Policy that when attached to an user, allows them to read the notification messages in the Queues.
   */
  public readonly notificationsPolicy?: aws.iam.Policy;

  constructor(
    name: string,
    args: EmailSenderArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloudToolkit:aws:email:EmailSender", name, args, opts);
    this.name = name;
    this.args = validateArgs(args);
    this.address = this.args.identity;

    this.tags = {
      ComponentName: this.name,
    };

    const resourceOpts = {
      ...opts,
      parent: this,
    };

    this.identity = this.setupIdentity(resourceOpts);

    const identityOpts = {
      ...opts,
      parent: this.identity,
    };

    if (this.identity instanceof DomainIdentity) {
      this.domainIdentity = this.identity;
      this.domainDKIM = this.obtainDomainDKIM(this.identity, identityOpts);
      this.dnsDkimRecords = this.constructDnsDkimRecords(
        this.address,
        this.domainDKIM
      );
      if (this.args.configureDNS) {
        this.dnsZoneId = this.getDnsZoneId(this.address);
        this.dnsRecords = this.verificateDomainIdentity(
          this.address,
          this.dnsZoneId,
          this.dnsDkimRecords,
          identityOpts
        );
      }
    } else {
      this.emailIdentity = this.identity;
    }

    if (this.args.bounce?.enabled) {
      const result = this.setupNotificationIdentity(
        NotificationTypes.Bounce,
        this.args.bounce,
        this.tags,
        identityOpts
      );
      this.bounceTopic = result.topic;
      this.bounceIdentityNotificationTopic = result.identityNotificationTopic;
      this.bounceQueues = result.queues;
      if (this.args.bounce.queues?.additionalQueues) {
        this.bounceAdditionalQueues = this.args.bounce.queues.additionalQueues;
        this.bounceAdditionalQueuesPolicies = result.additionalQueuesPolicies;
      }
      this.bounceTopicSubscriptions = result.topicSubscriptions;
    }

    if (this.args.complaint?.enabled) {
      const result = this.setupNotificationIdentity(
        NotificationTypes.Complaint,
        this.args.complaint,
        this.tags,
        identityOpts
      );
      this.complaintTopic = result.topic;
      this.complaintIdentityNotificationTopic =
        result.identityNotificationTopic;
      this.complaintQueues = result.queues;
      if (this.args.complaint.queues?.additionalQueues) {
        this.complaintAdditionalQueues =
          this.args.complaint.queues.additionalQueues;
        this.complaintAdditionalQueuesPolicies =
          result.additionalQueuesPolicies;
      }
      this.complaintTopicSubscriptions = result.topicSubscriptions;
    }

    if (this.args.delivery?.enabled) {
      const result = this.setupNotificationIdentity(
        NotificationTypes.Delivery,
        this.args.delivery,
        this.tags,
        identityOpts
      );
      this.deliveryTopic = result.topic;
      this.deliveryIdentityNotificationTopic = result.identityNotificationTopic;
      this.deliveryQueues = result.queues;
      if (this.args.delivery.queues?.additionalQueues) {
        this.deliveryAdditionalQueues =
          this.args.delivery.queues.additionalQueues;
        this.deliveryAdditionalQueuesPolicies = result.additionalQueuesPolicies;
      }
      this.deliveryTopicSubscriptions = result.topicSubscriptions;
    }

    this.senderPolicy = this.createSenderPolicy(
      this.address,
      this.identity.arn
    );

    if (this.bounceQueues || this.complaintQueues || this.deliveryQueues) {
      this.notificationsPolicy = this.createNotificationsPolicy(
        this.bounceQueues.concat(
          this.complaintQueues.concat(this.deliveryQueues)
        )
      );
    }

    this.resourceGroups = this.createResourceGroups(this.tags, identityOpts);
  }

  private setupNotificationIdentity(
    NotificationTypeArgs: NotificationTypes,
    args: NotificationTypeArgs,
    tags: { [key: string]: string },
    opts: pulumi.ResourceOptions
  ): {
    policyDocument: pulumi.Output<aws.iam.GetPolicyDocumentResult>;
    topic: aws.sns.Topic;
    identityNotificationTopic: aws.ses.IdentityNotificationTopic;
    queues: Queue[];
    additionalQueuesPolicies: aws.sqs.QueuePolicy[];
    topicSubscriptions: aws.sns.TopicSubscription[];
  } {
    const notificationTypeName = NotificationTypes[NotificationTypeArgs];

    let policyDocument: pulumi.Output<aws.iam.GetPolicyDocumentResult>;

    if (args.queues) {
      policyDocument = this.createPolicyDocument(
        notificationTypeName,
        args.queues.numberOfDefaultQueues,
        opts
      );
    } else {
      throw new Error(
        `Missing queues parameter for topic notification ${notificationTypeName}.`
      );
    }

    const topic = this.createTopic(
      notificationTypeName,
      policyDocument,
      tags,
      opts
    );
    const identityNotificationTopic = this.createIdentityNotification(
      notificationTypeName,
      topic,
      args.includeOriginalHeaders,
      opts
    );

    const queues = this.createDefaultQueues(
      notificationTypeName,
      args.queues.numberOfDefaultQueues,
      topic,
      tags,
      opts,
      args.queues.defaultQueuesConfig
    );

    const additionalQueuesPolicies = this.assignPolicyAdditionalQueues(
      args.queues.additionalQueues,
      topic,
      notificationTypeName,
      opts
    );

    const ntOpts = {
      ...opts,
      parent: topic,
    };

    const additionalQueuesArns = args.queues.additionalQueues.map((queue) => {
      return queue.arn;
    });

    const defaultQueuesArns = queues.map((queue) => {
      return queue.sqsQueue.arn;
    });

    const topicSubscriptions = this.createTopicSubscriptions(
      topic.arn,
      notificationTypeName,
      defaultQueuesArns,
      additionalQueuesArns,
      ntOpts
    );

    return {
      policyDocument: policyDocument,
      topic: topic,
      identityNotificationTopic: identityNotificationTopic,
      queues: queues,
      additionalQueuesPolicies: additionalQueuesPolicies,
      topicSubscriptions: topicSubscriptions,
    };
  }

  private setupIdentity(
    opts: pulumi.ResourceOptions
  ): aws.ses.EmailIdentity | aws.ses.DomainIdentity {
    if (isDomain(this.args.identity)) {
      return new aws.ses.DomainIdentity(
        this.temperName("domainIdentity"),
        {
          domain: this.args.identity,
        },
        opts
      );
    } else {
      return new aws.ses.EmailIdentity(
        this.temperName("emailIdentity"),
        {
          email: this.args.identity,
        },
        opts
      );
    }
  }

  private obtainDomainDKIM(
    identity: aws.ses.DomainIdentity,
    opts: pulumi.ResourceOptions
  ) {
    return new aws.ses.DomainDkim(
      `${this.name}-ses-domain-dkim`,
      {
        domain: identity.domain,
      },
      opts
    );
  }

  private constructDnsDkimRecords(
    domain: string,
    domainDKIM: aws.ses.DomainDkim
  ) {
    const dnsDkimRecords: DnsDkimRecordArgs[] = [];

    for (let i = 0; i < DKIM_RECORD_COUNT; i++) {
      const token = domainDKIM.dkimTokens[i].apply(
        (t) => `${t}.dkim.amazonses.com`
      );
      const name = domainDKIM.dkimTokens[i].apply(
        (t) => `${t}._domainkey.${domain}`
      );

      dnsDkimRecords.push({ name: name, token: token });
    }

    return dnsDkimRecords;
  }

  private getDnsZoneId(domain: string) {
    return aws.route53.getZone({ name: domain }, { async: true }).then(
      (zone) => zone.zoneId,
      (err) => {
        console.log(
          `It is possible that the source of this error is that the domain provided is not found in the Route53 registry.`
        );
        return Promise.reject(err);
      }
    );
  }

  private verificateDomainIdentity(
    domain: string,
    zoneId: pulumi.Input<string>,
    dnsDkimRecords: DnsDkimRecordArgs[],
    opts: pulumi.ResourceOptions
  ) {
    const dnsRecords: aws.route53.Record[] = [];

    for (let i = 0; i < DKIM_RECORD_COUNT; i++) {
      const name = dnsDkimRecords[i].name;
      const token = dnsDkimRecords[i].token;

      const dkimRecord = new aws.route53.Record(
        `${this.name}-dkim-record-${i + 1}-of-${DKIM_RECORD_COUNT}-${domain}`,
        {
          zoneId: zoneId,
          name,
          type: "CNAME",
          ttl: 3600,
          records: [token],
        },
        opts
      );

      dnsRecords.push(dkimRecord);
    }

    return dnsRecords;
  }

  private createPolicyDocument(
    notificationTypeName: string,
    additionalQueuesNumber: number,
    opts: pulumi.ResourceOptions
  ): pulumi.Output<aws.iam.GetPolicyDocumentResult> {
    const region = aws.getRegionOutput();
    const awsIdentity = aws.getCallerIdentity({});
    const accountId = awsIdentity.then((awsIdentity) => awsIdentity.accountId);

    const statements = [];
    const genericStatement = {
      sid: `default-${this.temperName("snsTopic", notificationTypeName)}`,
      effect: "Allow",
      principals: [
        {
          type: "AWS",
          identifiers: ["*"],
        },
      ],
      actions: [
        "SNS:Subscribe",
        "SNS:SetTopicAttributes",
        "SNS:RemovePermission",
        "SNS:Publish",
        "SNS:ListSubscriptionsByTopic",
        "SNS:GetTopicAttributes",
        "SNS:DeleteTopic",
        "SNS:AddPermission",
      ],
      resources: [
        pulumi.interpolate`arn:aws:sns:${
          region.name
        }:${accountId}:${this.temperName("snsTopic", notificationTypeName)}`,
      ],
      conditions: [
        {
          test: "StringEquals",
          variable: "AWS:SourceOwner",
          values: [accountId],
        },
      ],
    };

    statements.push(genericStatement);
    for (const i of [...Array(additionalQueuesNumber).keys()]) {
      const statement = {
        sid: `statement-${i}`,
        effect: "Allow",
        principals: [
          {
            type: "AWS",
            identifiers: ["*"],
          },
        ],
        actions: ["SNS:Subscribe", "SNS:Receive"],
        resources: [
          pulumi.interpolate`arn:aws:sns:${
            region.name
          }:${accountId}:${this.temperName("snsTopic", notificationTypeName)}`,
        ],
        conditions: [
          {
            test: "StringLike",
            variable: "SNS:Endpoint",
            values: [
              pulumi.interpolate`arn:aws:sqs:${
                region.name
              }:${accountId}:${this.temperName(
                "sqsQueue",
                `default-${notificationTypeName}-${i}-standard`
              )}`,
            ],
          },
        ],
      };
      statements.push(statement);
    }
    return aws.iam.getPolicyDocumentOutput(
      {
        statements: statements,
      },
      opts
    );
  }

  private createTopic(
    notificationTypeName: string,
    policyDocument: pulumi.Output<aws.iam.GetPolicyDocumentResult>,
    tags: { [key: string]: string },
    opts: pulumi.ResourceOptions
  ): aws.sns.Topic {
    return new aws.sns.Topic(
      this.temperName("snsTopic", notificationTypeName),
      {
        name: this.temperName("snsTopic", notificationTypeName),
        policy: policyDocument.json,
        tags: tags,
      },
      {
        ...opts,
        parent: this,
      }
    );
  }

  private createIdentityNotification(
    notificationTypeName: string,
    snsTopic: aws.sns.Topic,
    includeOriginalHeaders = false,
    opts: pulumi.ResourceOptions
  ): aws.ses.IdentityNotificationTopic {
    return new aws.ses.IdentityNotificationTopic(
      this.temperName("snsTopic", notificationTypeName),
      {
        identity: this.identity.arn,
        notificationType: notificationTypeName,
        topicArn: snsTopic.arn,
        includeOriginalHeaders: includeOriginalHeaders,
      },
      opts
    );
  }

  private createTopicSubscriptions(
    topicArn: pulumi.Input<string>,
    notificationTypeName: string,
    queues: pulumi.Input<string>[],
    additionalQueues: pulumi.Input<string>[] = [],
    opts: pulumi.ResourceOptions
  ) {
    const tss: aws.sns.TopicSubscription[] = [];
    for (const [key, q] of queues.entries()) {
      const ts = new aws.sns.TopicSubscription(
        this.temperName("topicSubscription", `${notificationTypeName}-${key}`),
        { protocol: "sqs", endpoint: q, topic: topicArn },
        opts
      );

      tss.push(ts);
    }

    for (const [key, q] of additionalQueues.entries()) {
      const ts = new aws.sns.TopicSubscription(
        this.temperName(
          "topicSubscription",
          `${notificationTypeName}-additional-${key}`
        ),
        { protocol: "sqs", endpoint: q, topic: topicArn },
        opts
      );

      tss.push(ts);
    }

    return tss;
  }

  private createDefaultQueues(
    notificationTypeName: string,
    numberOfQueues: number,
    topic: aws.sns.Topic,
    tags: { [key: string]: string },
    opts: pulumi.ResourceOptions,
    queueConfig = defaultQueueConfig,
    startingKey = 0
  ) {
    opts = {
      ...opts,
      parent: this,
    };

    const defaultQueues: Queue[] = [];

    const region = aws.getRegionOutput();
    const awsIdentity = aws.getCallerIdentity({});
    const accountId = awsIdentity.then((awsIdentity) => awsIdentity.accountId);

    for (let i = 0; numberOfQueues && i < numberOfQueues; i++) {
      const statement = {
        sid: this.temperName(
          "sqsQueue",
          `${notificationTypeName}-${i + startingKey}`
        ),
        effect: "Allow",
        principals: [
          {
            type: "AWS",
            identifiers: ["*"],
          },
        ],
        actions: ["SQS:SendMessage"],
        resources: [
          pulumi.interpolate`arn:aws:sqs:${
            region.name
          }:${accountId}:${this.temperName(
            "sqsQueue",
            `${notificationTypeName}-${i + startingKey}`
          )}-standard`,
        ],
        conditions: [
          {
            test: "ArnEquals",
            variable: "aws:SourceArn",
            values: [topic.arn],
          },
        ],
      };

      const policyDocument = aws.iam.getPolicyDocumentOutput({
        statements: [statement],
      });

      const config = defaultsDeep(
        { ...queueConfig, policy: policyDocument.json, tags: tags },
        defaultQueueConfig
      );

      const queue = new Queue(
        this.temperName(
          "sqsQueue",
          `${notificationTypeName}-${i + startingKey}`
        ),
        config,
        opts
      );
      defaultQueues.push(queue);
    }

    return defaultQueues;
  }

  private createSenderPolicy(
    identityAddress: string,
    identityARN: pulumi.Input<string>
  ): aws.iam.Policy {
    let address: string;

    if (isDomain(identityAddress)) {
      address = `*@${identityAddress}`;
    } else {
      address = identityAddress;
    }

    const statement = <aws.types.input.iam.GetPolicyDocumentStatementArgs>{
      effect: "Allow",
      resources: [identityARN],
      actions: [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:SendTemplatedEmail",
        "ses:SendBulkTemplatedEmail",
      ],
    };

    const policyDocument = aws.iam.getPolicyDocumentOutput({
      statements: [statement],
    });

    return new aws.iam.Policy(`${this.name}-sender-policy`, {
      policy: policyDocument.json,
    });
  }

  private createNotificationsPolicy(queues: Queue[]): aws.iam.Policy {
    const queuesARNs = queues.map((queue) => {
      return queue.sqsQueue.arn;
    });

    const statement = <aws.types.input.iam.GetPolicyDocumentStatementArgs>{
      effect: "Allow",
      resources: queuesARNs,
      actions: [
        "sqs:ChangeMessageVisibility",
        "sqs:ChangeMessageVisibilityBatch",
        "sqs:GetQueueAttributes",
        "sqs:GetQueueUrl",
        "sqs:ListDeadLetterSourceQueues",
        "sqs:ListQueueTags",
        "sqs:DeleteMessage",
        "sqs:DeleteMessageBatch",
        "sqs:ReceiveMessage",
      ],
    };

    const policyDocument = aws.iam.getPolicyDocumentOutput({
      statements: [statement],
    });

    return new aws.iam.Policy(`${this.name}-notifications-policy`, {
      policy: policyDocument.json,
    });
  }

  private assignPolicyAdditionalQueues(
    queues: AdditionalQueueArgs[],
    topic: aws.sns.Topic,
    notificationTypeName: string,
    opts: pulumi.ResourceOptions
  ) {
    const additionalQueuesPolicies: aws.sqs.QueuePolicy[] = [];

    for (let i = 0; i < queues.length; i++) {
      const statement = {
        sid: `${this.name}-${notificationTypeName}-additional-${i}`,
        effect: "Allow",
        principals: [
          {
            type: "AWS",
            identifiers: ["*"],
          },
        ],
        actions: ["SQS:SendMessage"],
        resources: [queues[i].arn],
        conditions: [
          {
            test: "ArnEquals",
            variable: "aws:SourceArn",
            values: [topic.arn],
          },
        ],
      };

      const policyDocument = aws.iam.getPolicyDocumentOutput({
        statements: [statement],
      });

      additionalQueuesPolicies.push(
        new aws.sqs.QueuePolicy(
          `${this.name}-${notificationTypeName}-additional-${i}`,
          { queueUrl: queues[i].url, policy: policyDocument.json },
          opts
        )
      );
    }

    return additionalQueuesPolicies;
  }

  private createResourceGroups(
    tags: {
      [key: string]: string;
    },
    opts: pulumi.ResourceOptions
  ): aws.resourcegroups.Group[] {
    const result: aws.resourcegroups.Group[] = [];
    for (const key in tags) {
      result.push(
        new aws.resourcegroups.Group(
          `EmailSender-${this.name}`,
          {
            resourceQuery: {
              query: `{
              "ResourceTypeFilters": [
                "AWS::SQS::Queue", "AWS::SNS::Topic"
              ],
              "TagFilters": [
                {
                  "Key": "${key}",
                  "Values": [
                    "${tags[key]}"
                  ]
                }
              ]
            }
  `,
            },
            name: `EmailSender-${this.name}`,
          },
          opts
        )
      );
    }
    return result;
  }
  /**
   * Constructs a Pulumi resource name using a template. Throws an error if the provided resource is not supported.
   * We could use the type class and avoid passing the "resourceType" parameter.
   * @param resourceType
   * @param resourceName
   */
  private temperName(resourceType: string, resourceName?: string): string {
    switch (resourceType) {
      case "sqsQueue":
        return `${this.name}-${resourceName}`;
      case "snsTopic":
        return `${this.name}-${resourceName}`;
      case "topicSubscription":
        return `${this.name}-${resourceName}`;
      case "emailIdentity":
        return this.name;
      case "domainIdentity":
        return this.name;
      default:
        throw new Error(`No template found for ${resourceType} resource type.`);
    }
  }
}

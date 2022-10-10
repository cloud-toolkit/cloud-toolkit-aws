import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
import * as pulumiAws from "@pulumi/aws";
import { Queue } from "../serverless";
/**
 * Cloud Toolkit component for an Email Sender. Creates a Simple Email Service Email or Domain Identity alongside Simple Notification Service Topics and Simple Queue Service Queues to manage bounce, complaints or delivered messages.
 * In the case of building a Domain Identity, if it is registered in the Route 53 on the AWS account that is applying the infrastructure changes, Cloud Toolkit can verify it automatically by creating the DKIM DNS Records.
 */
export declare class EmailSender extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of EmailSender.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is EmailSender;
    /**
     * Address of the Identity, regardless if it is a Domain or an Email.
     */
    readonly address: pulumi.Output<string>;
    /**
     * Additional SQS Queues subscribed to the SNS Topic that receives bounced emails. These Queues were created outside the Email Sender component.
     */
    readonly bounceAdditionalQueues: pulumi.Output<outputs.email.AdditionalQueueArgs[]>;
    /**
     * Queue Policies attached to the externally provided Bounce SQS Queues.
     */
    readonly bounceAdditionalQueuesPolicies: pulumi.Output<pulumiAws.sqs.QueuePolicy[]>;
    /**
     * Identity Notification Topic for bounced emails.
     */
    readonly bounceIdentityNotificationTopic: pulumi.Output<pulumiAws.ses.IdentityNotificationTopic | undefined>;
    /**
     * SQS Queues subscribed to the SNS Topic that receives bounced emails. These Queues were created automatically by the Email Sender component.
     */
    readonly bounceQueues: pulumi.Output<Queue[]>;
    /**
     * SNS Topic for bounced emails.
     */
    readonly bounceTopic: pulumi.Output<pulumiAws.sns.Topic | undefined>;
    /**
     * SNS subscriptions of the SQS Queues to the Bounce SNS Topic.
     */
    readonly bounceTopicSubscriptions: pulumi.Output<pulumiAws.sns.TopicSubscription[]>;
    /**
     * Additional SQS Queues subscribed to the SNS Topic that receives complained emails. These Queues were created outside the Email Sender component.
     */
    readonly complaintAdditionalQueues: pulumi.Output<outputs.email.AdditionalQueueArgs[]>;
    /**
     * Queue Policies attached to the externally provided Complaint SQS Queues.
     */
    readonly complaintAdditionalQueuesPolicies: pulumi.Output<pulumiAws.sqs.QueuePolicy[]>;
    /**
     * Identity Notification Topic for complained emails.
     */
    readonly complaintIdentityNotificationTopic: pulumi.Output<pulumiAws.ses.IdentityNotificationTopic | undefined>;
    /**
     * SQS Queues subscribed to the SNS Topic that receives complained emails. These Queues were created automatically by the Email Sender component.
     */
    readonly complaintQueues: pulumi.Output<Queue[]>;
    /**
     * SNS Topic for complained emails.
     */
    readonly complaintTopic: pulumi.Output<pulumiAws.sns.Topic | undefined>;
    /**
     * SNS subscriptions of the SQS Queues to the Complaint SNS Topic.
     */
    readonly complaintTopicSubscriptions: pulumi.Output<pulumiAws.sns.TopicSubscription[]>;
    /**
     * Additional SQS Queues subscribed to the SNS Topic that receives delivered emails. These Queues were created outside the Email Sender component.
     */
    readonly deliveryAdditionalQueues: pulumi.Output<outputs.email.AdditionalQueueArgs[]>;
    /**
     * Queue Policies attached to the externally provided Delivery SQS Queues.
     */
    readonly deliveryAdditionalQueuesPolicies: pulumi.Output<pulumiAws.sqs.QueuePolicy[]>;
    /**
     * Identity Notification Topic for delivered emails.
     */
    readonly deliveryIdentityNotificationTopic: pulumi.Output<pulumiAws.ses.IdentityNotificationTopic | undefined>;
    /**
     * SQS Queues subscribed to the SNS Topic that receives delivered emails. These Queues were created automatically by the Email Sender component.
     */
    readonly deliveryQueues: pulumi.Output<Queue[]>;
    /**
     * SNS Topic for delivered emails.
     */
    readonly deliveryTopic: pulumi.Output<pulumiAws.sns.Topic | undefined>;
    /**
     * SNS subscriptions of the SQS Queues to the Delivery SNS Topic.
     */
    readonly deliveryTopicSubscriptions: pulumi.Output<pulumiAws.sns.TopicSubscription[]>;
    /**
     * DNS DKIM Records. Only applies for Domain Identities.
     */
    readonly dnsDkimRecords: pulumi.Output<outputs.email.DnsDkimRecordArgs[]>;
    /**
     * DNS records stored in the Domain registration in Route 53. Only applies for Domain Identities that are registered using Route 53.
     */
    readonly dnsRecords: pulumi.Output<pulumiAws.route53.Record[]>;
    /**
     * DNS zone identifier in Route 53 for the Domain. Only applies for Domain Identities that are registered using Route 53.
     */
    readonly dnsZoneId: pulumi.Output<string | undefined>;
    /**
     * Domain DKIM. Only applies for Domain Identities.
     */
    readonly domainDKIM: pulumi.Output<pulumiAws.ses.DomainDkim | undefined>;
    /**
     * Domain Identity component. Left blank if an Email Identity was used instead.
     */
    readonly domainIdentity: pulumi.Output<pulumiAws.ses.DomainIdentity | undefined>;
    /**
     * Email Identity component. Left blank if a Domain Identity was used instead.
     */
    readonly emailIdentity: pulumi.Output<pulumiAws.ses.EmailIdentity | undefined>;
    /**
     * Policy that when attached to an user, allows them to read the notification messages in the Queues.
     */
    readonly notificationsPolicy: pulumi.Output<pulumiAws.iam.Policy | undefined>;
    /**
     * Resource Groups that contain the underlying components such as Topics or Queues that belong to the Email Sender.
     */
    readonly resourceGroups: pulumi.Output<pulumiAws.resourcegroups.Group[]>;
    /**
     * Policy that when attached to an user, allows them to send messages using the Email Sender Identity.
     */
    readonly senderPolicy: pulumi.Output<pulumiAws.iam.Policy>;
    /**
     * Create a EmailSender resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: EmailSenderArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a EmailSender resource.
 */
export interface EmailSenderArgs {
    /**
     * Arguments to manage incoming Bounce notifications.
     */
    bounce?: pulumi.Input<inputs.email.NotificationTypeArgsArgs>;
    /**
     * Arguments to manage incoming Complaint notifications.
     */
    complaint?: pulumi.Input<inputs.email.NotificationTypeArgsArgs>;
    /**
     * In the case of a Domain Identity, enables automatic verification by creating DKIM DNS Records in the domain registration on Route 53.
     * If the domain is not registered in the Route 53 on the same AWS account that is applying the infrastructure changes, the process will fail unless this flag is set to False.
     */
    configureDNS?: pulumi.Input<boolean>;
    /**
     * Arguments to manage incoming Delivery notifications.
     */
    delivery?: pulumi.Input<inputs.email.NotificationTypeArgsArgs>;
    /**
     * Address of the Domain or Email used to send the emails through Email Sender.
     * If an Email address is provided, Email Sender will set a Simple Email Service Email Identity. Verification will need to be manual.
     * Else, if a Domain address is configured, Email Sender will create a Simple Email Service Domain Identity.
     * By default, it will attempt to verify the Domain by looking the Route 53 Domain Registry in the AWS account that is applying the infrastructure changes.
     * If the Domain is registered elsewhere, verification needs to be manual.
     */
    identity: pulumi.Input<string>;
}

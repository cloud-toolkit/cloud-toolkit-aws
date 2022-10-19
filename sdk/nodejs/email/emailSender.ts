// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
import * as enums from "../types/enums";
import * as utilities from "../utilities";

import * as pulumiAws from "@pulumi/aws";

import {Queue} from "../serverless";

/**
 * Cloud Toolkit component for an Email Sender. Creates a Simple Email Service Email or Domain Identity alongside Simple Notification Service Topics and Simple Queue Service Queues to manage bounce, complaints or delivered messages.
 * In the case of building a Domain Identity, if it is registered in the Route 53 on the AWS account that is applying the infrastructure changes, Cloud Toolkit can verify it automatically by creating the DKIM DNS Records.
 */
export class EmailSender extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'cloud-toolkit-aws:email:EmailSender';

    /**
     * Returns true if the given object is an instance of EmailSender.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is EmailSender {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === EmailSender.__pulumiType;
    }

    /**
     * Address of the Identity, regardless if it is a Domain or an Email.
     */
    public /*out*/ readonly address!: pulumi.Output<string>;
    /**
     * Additional SQS Queues subscribed to the SNS Topic that receives bounced emails. These Queues were created outside the Email Sender component.
     */
    public /*out*/ readonly bounceAdditionalQueues!: pulumi.Output<outputs.email.AdditionalQueueArgs[]>;
    /**
     * Queue Policies attached to the externally provided Bounce SQS Queues.
     */
    public /*out*/ readonly bounceAdditionalQueuesPolicies!: pulumi.Output<pulumiAws.sqs.QueuePolicy[]>;
    /**
     * Identity Notification Topic for bounced emails.
     */
    public /*out*/ readonly bounceIdentityNotificationTopic!: pulumi.Output<pulumiAws.ses.IdentityNotificationTopic | undefined>;
    /**
     * SQS Queues subscribed to the SNS Topic that receives bounced emails. These Queues were created automatically by the Email Sender component.
     */
    public /*out*/ readonly bounceQueues!: pulumi.Output<Queue[]>;
    /**
     * SNS Topic for bounced emails.
     */
    public /*out*/ readonly bounceTopic!: pulumi.Output<pulumiAws.sns.Topic | undefined>;
    /**
     * SNS subscriptions of the SQS Queues to the Bounce SNS Topic.
     */
    public /*out*/ readonly bounceTopicSubscriptions!: pulumi.Output<pulumiAws.sns.TopicSubscription[]>;
    /**
     * Additional SQS Queues subscribed to the SNS Topic that receives complained emails. These Queues were created outside the Email Sender component.
     */
    public /*out*/ readonly complaintAdditionalQueues!: pulumi.Output<outputs.email.AdditionalQueueArgs[]>;
    /**
     * Queue Policies attached to the externally provided Complaint SQS Queues.
     */
    public /*out*/ readonly complaintAdditionalQueuesPolicies!: pulumi.Output<pulumiAws.sqs.QueuePolicy[]>;
    /**
     * Identity Notification Topic for complained emails.
     */
    public /*out*/ readonly complaintIdentityNotificationTopic!: pulumi.Output<pulumiAws.ses.IdentityNotificationTopic | undefined>;
    /**
     * SQS Queues subscribed to the SNS Topic that receives complained emails. These Queues were created automatically by the Email Sender component.
     */
    public /*out*/ readonly complaintQueues!: pulumi.Output<Queue[]>;
    /**
     * SNS Topic for complained emails.
     */
    public /*out*/ readonly complaintTopic!: pulumi.Output<pulumiAws.sns.Topic | undefined>;
    /**
     * SNS subscriptions of the SQS Queues to the Complaint SNS Topic.
     */
    public /*out*/ readonly complaintTopicSubscriptions!: pulumi.Output<pulumiAws.sns.TopicSubscription[]>;
    /**
     * Additional SQS Queues subscribed to the SNS Topic that receives delivered emails. These Queues were created outside the Email Sender component.
     */
    public /*out*/ readonly deliveryAdditionalQueues!: pulumi.Output<outputs.email.AdditionalQueueArgs[]>;
    /**
     * Queue Policies attached to the externally provided Delivery SQS Queues.
     */
    public /*out*/ readonly deliveryAdditionalQueuesPolicies!: pulumi.Output<pulumiAws.sqs.QueuePolicy[]>;
    /**
     * Identity Notification Topic for delivered emails.
     */
    public /*out*/ readonly deliveryIdentityNotificationTopic!: pulumi.Output<pulumiAws.ses.IdentityNotificationTopic | undefined>;
    /**
     * SQS Queues subscribed to the SNS Topic that receives delivered emails. These Queues were created automatically by the Email Sender component.
     */
    public /*out*/ readonly deliveryQueues!: pulumi.Output<Queue[]>;
    /**
     * SNS Topic for delivered emails.
     */
    public /*out*/ readonly deliveryTopic!: pulumi.Output<pulumiAws.sns.Topic | undefined>;
    /**
     * SNS subscriptions of the SQS Queues to the Delivery SNS Topic.
     */
    public /*out*/ readonly deliveryTopicSubscriptions!: pulumi.Output<pulumiAws.sns.TopicSubscription[]>;
    /**
     * DNS DKIM Records. Only applies for Domain Identities.
     */
    public /*out*/ readonly dnsDkimRecords!: pulumi.Output<outputs.email.DnsDkimRecordArgs[]>;
    /**
     * DNS records stored in the Domain registration in Route 53. Only applies for Domain Identities that are registered using Route 53.
     */
    public /*out*/ readonly dnsRecords!: pulumi.Output<pulumiAws.route53.Record[]>;
    /**
     * DNS zone identifier in Route 53 for the Domain. Only applies for Domain Identities that are registered using Route 53.
     */
    public /*out*/ readonly dnsZoneId!: pulumi.Output<string | undefined>;
    /**
     * Domain DKIM. Only applies for Domain Identities.
     */
    public /*out*/ readonly domainDKIM!: pulumi.Output<pulumiAws.ses.DomainDkim | undefined>;
    /**
     * Domain Identity component. Left blank if an Email Identity was used instead.
     */
    public /*out*/ readonly domainIdentity!: pulumi.Output<pulumiAws.ses.DomainIdentity | undefined>;
    /**
     * Email Identity component. Left blank if a Domain Identity was used instead.
     */
    public /*out*/ readonly emailIdentity!: pulumi.Output<pulumiAws.ses.EmailIdentity | undefined>;
    /**
     * Policy that when attached to an user, allows them to read the notification messages in the Queues.
     */
    public /*out*/ readonly notificationsPolicy!: pulumi.Output<pulumiAws.iam.Policy | undefined>;
    /**
     * Resource Groups that contain the underlying components such as Topics or Queues that belong to the Email Sender.
     */
    public /*out*/ readonly resourceGroups!: pulumi.Output<pulumiAws.resourcegroups.Group[]>;
    /**
     * Policy that when attached to an user, allows them to send messages using the Email Sender Identity.
     */
    public /*out*/ readonly senderPolicy!: pulumi.Output<pulumiAws.iam.Policy>;

    /**
     * Create a EmailSender resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: EmailSenderArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.identity === undefined) && !opts.urn) {
                throw new Error("Missing required property 'identity'");
            }
            resourceInputs["bounce"] = args ? args.bounce : undefined;
            resourceInputs["complaint"] = args ? args.complaint : undefined;
            resourceInputs["configureDNS"] = args ? args.configureDNS : undefined;
            resourceInputs["delivery"] = args ? args.delivery : undefined;
            resourceInputs["identity"] = args ? args.identity : undefined;
            resourceInputs["address"] = undefined /*out*/;
            resourceInputs["bounceAdditionalQueues"] = undefined /*out*/;
            resourceInputs["bounceAdditionalQueuesPolicies"] = undefined /*out*/;
            resourceInputs["bounceIdentityNotificationTopic"] = undefined /*out*/;
            resourceInputs["bounceQueues"] = undefined /*out*/;
            resourceInputs["bounceTopic"] = undefined /*out*/;
            resourceInputs["bounceTopicSubscriptions"] = undefined /*out*/;
            resourceInputs["complaintAdditionalQueues"] = undefined /*out*/;
            resourceInputs["complaintAdditionalQueuesPolicies"] = undefined /*out*/;
            resourceInputs["complaintIdentityNotificationTopic"] = undefined /*out*/;
            resourceInputs["complaintQueues"] = undefined /*out*/;
            resourceInputs["complaintTopic"] = undefined /*out*/;
            resourceInputs["complaintTopicSubscriptions"] = undefined /*out*/;
            resourceInputs["deliveryAdditionalQueues"] = undefined /*out*/;
            resourceInputs["deliveryAdditionalQueuesPolicies"] = undefined /*out*/;
            resourceInputs["deliveryIdentityNotificationTopic"] = undefined /*out*/;
            resourceInputs["deliveryQueues"] = undefined /*out*/;
            resourceInputs["deliveryTopic"] = undefined /*out*/;
            resourceInputs["deliveryTopicSubscriptions"] = undefined /*out*/;
            resourceInputs["dnsDkimRecords"] = undefined /*out*/;
            resourceInputs["dnsRecords"] = undefined /*out*/;
            resourceInputs["dnsZoneId"] = undefined /*out*/;
            resourceInputs["domainDKIM"] = undefined /*out*/;
            resourceInputs["domainIdentity"] = undefined /*out*/;
            resourceInputs["emailIdentity"] = undefined /*out*/;
            resourceInputs["notificationsPolicy"] = undefined /*out*/;
            resourceInputs["resourceGroups"] = undefined /*out*/;
            resourceInputs["senderPolicy"] = undefined /*out*/;
        } else {
            resourceInputs["address"] = undefined /*out*/;
            resourceInputs["bounceAdditionalQueues"] = undefined /*out*/;
            resourceInputs["bounceAdditionalQueuesPolicies"] = undefined /*out*/;
            resourceInputs["bounceIdentityNotificationTopic"] = undefined /*out*/;
            resourceInputs["bounceQueues"] = undefined /*out*/;
            resourceInputs["bounceTopic"] = undefined /*out*/;
            resourceInputs["bounceTopicSubscriptions"] = undefined /*out*/;
            resourceInputs["complaintAdditionalQueues"] = undefined /*out*/;
            resourceInputs["complaintAdditionalQueuesPolicies"] = undefined /*out*/;
            resourceInputs["complaintIdentityNotificationTopic"] = undefined /*out*/;
            resourceInputs["complaintQueues"] = undefined /*out*/;
            resourceInputs["complaintTopic"] = undefined /*out*/;
            resourceInputs["complaintTopicSubscriptions"] = undefined /*out*/;
            resourceInputs["deliveryAdditionalQueues"] = undefined /*out*/;
            resourceInputs["deliveryAdditionalQueuesPolicies"] = undefined /*out*/;
            resourceInputs["deliveryIdentityNotificationTopic"] = undefined /*out*/;
            resourceInputs["deliveryQueues"] = undefined /*out*/;
            resourceInputs["deliveryTopic"] = undefined /*out*/;
            resourceInputs["deliveryTopicSubscriptions"] = undefined /*out*/;
            resourceInputs["dnsDkimRecords"] = undefined /*out*/;
            resourceInputs["dnsRecords"] = undefined /*out*/;
            resourceInputs["dnsZoneId"] = undefined /*out*/;
            resourceInputs["domainDKIM"] = undefined /*out*/;
            resourceInputs["domainIdentity"] = undefined /*out*/;
            resourceInputs["emailIdentity"] = undefined /*out*/;
            resourceInputs["notificationsPolicy"] = undefined /*out*/;
            resourceInputs["resourceGroups"] = undefined /*out*/;
            resourceInputs["senderPolicy"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(EmailSender.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
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
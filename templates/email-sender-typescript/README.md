# Cloud Toolkit Email Sender template

## The Gist

This is a template for the Cloud Toolkit Email Sender component. Here you can find a provisional configuration to start your own Simple Email Service instance. 

You will learn:

* The base structure of both the code and YAML configuration for this component.
* How to verify either a Domain or an Email Identity.  
* About the possible Notifications concerning your sent emails.

## Architecture

The Email Sender is composed by **at least** the Identity. This Identity is the Domain or single Email that you will be using to send out your messages. 

A Domain Identity will allow you to send email with any address that belongs to it. If for example your domain is *ecorp.com*, you can send messages with *admin@ecorp.com*, *user@ecorp.com*, *marketing@ecorp.com* and any other. Subdomains are also supported, like *elliot@it.ecorp*. By default, Domain Identities are verified automatically if your organization rents the domain with AWS Route53 domain registry. If not, you will need to set the flag `configureDNS` to `false` in the configuration and set the DKIM records manually.

![](assets/EmailSender%20Architecture%20-%20Domain%20Identity.svg)

On contrast, an Email Identity will use a single address to send out email. The verification process consists on clicking a link that AWS will send to the specified address of the component. Email Identity can only use the exact address that is being provided, not other ones in the same domain or subdomain. If using an Email Identity with the same domain as other Domain Identity, the former will override the configuration of the latter.

![](assets/EmailSender%20Architecture%20-%20Email%20Identity.svg)

Keep in mind that an Identity being verified does not mean that it can send messages to anyone. First, you **must** request to AWS to move your Identities out of the sandbox. You can find more in [this AWS article](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html).

Sent emails do not always end in the place that you want. To manage that, an Email Server instance can store the notifications regarding your messages into *Simple Notification Service* Topics. There are currently three events that can be catched, **Bounce**, **Complaint** and **Delivery**. Every type of notification will be sent to a different Topic. Then, to retrieve the Topic information, you can use *Simple Queue Service* Queues. By default, Email Sender creates a Queue for each Notification Type that's being enabled, but you can modify its configuration, add more Queues or disabling Queue creation so that you are free to manage your Topic messages with your own mechanism.

To control Topics and Queues easily, a Resource Group with them will be created after the changes are applied. It will be identified by the name set to the component instance.

## Usage

### Applying the stack

The stack can be applied like every other Pulumi project.

```bash
pulumi up
``` 

Check the Stack Tree. It should look like the following:

```
     Type                                        Name                                    Plan       
 +   pulumi:pulumi:Stack                         aproject-email-sender-basic             create     
 +   └─ cloudToolkit:aws:email:EmailSender       emailSenderName                         create     
 +      ├─ cloudToolkit:aws:serverless:queue     emailSenderName-Bounce-0                create     
 +      │  ├─ aws:sqs:Queue                      emailSenderName-Bounce-0-deadletter     create     
 +      │  └─ aws:sqs:Queue                      emailSenderName-Bounce-0-standard       create     
 +      ├─ cloudToolkit:aws:serverless:queue     emailSenderName-Delivery-0              create     
 +      │  ├─ aws:sqs:Queue                      emailSenderName-Delivery-0-deadletter   create     
 +      │  └─ aws:sqs:Queue                      emailSenderName-Delivery-0-standard     create     
 +      ├─ cloudToolkit:aws:serverless:queue     emailSenderName-Complaint-0             create     
 +      │  ├─ aws:sqs:Queue                      emailSenderName-Complaint-0-deadletter  create     
 +      │  └─ aws:sqs:Queue                      emailSenderName-Complaint-0-standard    create     
 +      ├─ aws:ses:EmailIdentity                 emailSenderName                         create     
 +      │  ├─ aws:resourcegroups:Group           EmailSender-emailSenderName             create     
 +      │  ├─ aws:ses:IdentityNotificationTopic  emailSenderName-Bounce                  create     
 +      │  ├─ aws:ses:IdentityNotificationTopic  emailSenderName-Complaint               create     
 +      │  └─ aws:ses:IdentityNotificationTopic  emailSenderName-Delivery                create     
 +      ├─ aws:sns:Topic                         emailSenderName-Bounce                  create     
 +      │  └─ aws:sns:TopicSubscription          emailSenderName-Bounce-0                create     
 +      ├─ aws:sns:Topic                         emailSenderName-Complaint               create     
 +      │  └─ aws:sns:TopicSubscription          emailSenderName-Complaint-0             create     
 +      └─ aws:sns:Topic                         emailSenderName-Delivery                create     
 +         └─ aws:sns:TopicSubscription          emailSenderName-Delivery-0              create 
```

### Testing

Use the `send-email.sh` script to send emails to authorized addresses while inside the sandbox. An email will be sent to special addresses that will return a bounce, a complaint and a delivery.

```bash
EMAIL_ADDRESS=myaddres@example.com send-email.sh
```

## Troubleshooting

If you find any problem, you can open an issue in the Cloud Toolkit AWS Templates repository.

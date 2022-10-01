import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as enums from "../types/enums";
export declare namespace email {
    interface AdditionalQueueArgsArgs {
        /**
         * Amazon Resource Name for the Queue component.
         */
        arn?: pulumi.Input<string>;
        /**
         * Endpoint of the Queue component in AWS.
         */
        url?: pulumi.Input<string>;
    }
    interface NotificationTypeArgsArgs {
        /**
         * Enables the feature.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * Include original headers on the stored messages in the Queue(s).
         */
        includeOriginalHeaders?: pulumi.Input<boolean>;
        /**
         * Arguments to configure the Queues subscribed to the Notification Type Topic.
         * If left blank, a default standard, non-fifo, Queue and a Dead Letter Queue that is attached to the former will be created.
         */
        queues?: pulumi.Input<inputs.email.NotificationTypeQueuesArgsArgs>;
    }
    interface NotificationTypeQueuesArgsArgs {
        /**
         * Arguments to include Queues built and implemented outside of the Email Sender Component. Useful when subscribing a single Queue to two or more Topics or when migrating existing ones.
         */
        additionalQueues?: pulumi.Input<pulumi.Input<inputs.email.AdditionalQueueArgsArgs>[]>;
        /**
         * Configuration for the Default Queues. If left blank, Queues created for this Notification Type will be standard, non-fifo, with a Dead Letter Queue attached to them.
         */
        defaultQueuesConfig?: pulumi.Input<inputs.serverless.QueueArgsArgs>;
        /**
         * Number of default Queues that will be created and attached to a Topic.
         */
        numberOfDefaultQueues?: pulumi.Input<number>;
    }
}
export declare namespace kubernetes {
    interface ClusterApiArgsArgs {
        /**
         * Configure the private endpoint for the Kubernetes API.
         */
        private?: pulumi.Input<inputs.kubernetes.ClusterPrivateApiArgsArgs>;
        /**
         * Configure the public endpoint for the Kubernetes API.
         */
        public?: pulumi.Input<inputs.kubernetes.ClusterPublicApiArgsArgs>;
    }
    interface ClusterNodeGroupArgsArgs {
        /**
         * The EC2 Instance Type to be used to create the Nodes.
         */
        instanceType?: pulumi.Input<string>;
        /**
         * The maxium number of nodes running in the node group. Defaults to 2.
         */
        maxCount?: pulumi.Input<number>;
        /**
         * The maximum number of nodes unavailable at once during a version update. Defaults to 1.
         */
        maxUnavailable?: pulumi.Input<number>;
        /**
         * The minimum number of nodes running in the node group. Defaults to 1.
         */
        minCount?: pulumi.Input<number>;
        /**
         * The Node Group name.
         */
        name?: pulumi.Input<string>;
        /**
         * The subnets type to be used to deploy the Node Groups.
         */
        subnetsType?: pulumi.Input<enums.kubernetes.ClusterSubnetsType>;
    }
    interface ClusterOidcProvidersArgsArgs {
        /**
         * Enable the default OIDC Provider that is used in the cluster to let Service Accounts to authenticate against AWS with a given IAM Role.
         */
        enableDefaultProvider?: pulumi.Input<boolean>;
    }
    interface ClusterPrivateApiArgsArgs {
        /**
         * Enable the private endpoint for Kubernetes API.
         */
        enabled?: pulumi.Input<boolean>;
    }
    interface ClusterPublicApiArgsArgs {
        /**
         * Enable the public endpoint for Kubernetes API.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * The list of CIDR that will be allowed to reach the public endpoint for Kubernetes API.
         */
        whitelist?: pulumi.Input<pulumi.Input<string>[]>;
    }
}
export declare namespace landingZone {
    interface AccountPasswordPolicyArgsArgs {
        /**
         * Enable the creation of IAM Password Policy. Defaults to 'true'.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * The rules to be applied to the IAM Password Policy
         */
        rules?: pulumi.Input<inputs.landingZone.AccountPasswordPolicyRulesArgsArgs>;
    }
    interface AccountPasswordPolicyRulesArgsArgs {
        /**
         * Whether to allow users to change their own password. Defaults to 'true'.
         */
        allowUsersToChangePassword?: pulumi.Input<boolean>;
        /**
         * Whether users are prevented from setting a new password after their password has expired (i.e., require administrator reset). Defaults to 'true'.
         */
        hardExpiry?: pulumi.Input<boolean>;
        /**
         * The number of days that an user password is valid. Defaults to '90'.
         */
        maxPasswordAge?: pulumi.Input<number>;
        /**
         * Minimum length to require for user passwords. Defaults to '14'.
         */
        minimumPasswordLength?: pulumi.Input<number>;
        /**
         * The number of previous passwords that users are prevented from reusing. Defaults to '0'.
         */
        passwordReusePrevention?: pulumi.Input<number>;
        /**
         * Whether to require lowercase characters for user passwords. Defaults to 'true'.
         */
        requireLowercaseCharacters?: pulumi.Input<boolean>;
        /**
         * Whether to require numbers for user passwords. Defaults to 'true'.
         */
        requireNumbers?: pulumi.Input<boolean>;
        /**
         * Whether to require symbols for user passwords. Defaults to 'true'.
         */
        requireSymbols?: pulumi.Input<boolean>;
        /**
         * Whether to require uppercase characters for user passwords. Defaults to 'true'.
         */
        requireUppercaseCharacters?: pulumi.Input<boolean>;
    }
    interface OrganizationAccountArgsArgs {
        /**
         * The AWS Account ID to be used to import the Account in the Organization. If not set, a new AWS Account will be created.
         */
        accountId?: pulumi.Input<string>;
        /**
         * Admin role for the IAM Account.
         */
        adminRoleName?: pulumi.Input<string>;
        /**
         * The email associated to the IAM Account.
         */
        email?: pulumi.Input<string>;
        /**
         * The name of the IAM Account.
         */
        name?: pulumi.Input<string>;
        ou?: pulumi.Input<string>;
        /**
         * The parentId of the imported account.
         */
        parentId?: pulumi.Input<string>;
    }
    interface OrganizationPoliciesArgsArgs {
        /**
         * Deny IAM Account to leave the organization. Enabled by default.
         */
        denyLeaveOrganization?: pulumi.Input<inputs.landingZone.OrganizationPolicyArgsArgs>;
    }
    interface OrganizationPolicyArgsArgs {
        /**
         * Enable the policy/
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * Import the policy with the given id
         */
        policyId?: pulumi.Input<string>;
    }
}
export declare namespace serverless {
    interface DeadLetterQueueTypeArgsArgs {
        /**
         * Enables the feature.
         */
        enable?: pulumi.Input<boolean>;
        /**
         * Placing a Queue ARN will set said already existing Queue as a Dead Letter Queue for the new one.
         */
        existingDeadLetterQueueArn?: pulumi.Input<string>;
        /**
         * The amount of time that a message will be stored in the Dead Letter Queue without being deleted. Minimum is 60 seconds (1 minutes) and Maximum 1,209,600 (14 days) seconds. By default a message is retained 4 days.
         */
        messageRetentionSeconds?: pulumi.Input<number>;
        /**
         * Dead Letter Queue type attached to the component to create.
         */
        type?: pulumi.Input<enums.serverless.DeadLetterQueueTypes>;
    }
    interface QueueArgsArgs {
        /**
         * Dead Letter Queue attached to the component to create.
         */
        DeadLetterQueueTypeArgs?: pulumi.Input<inputs.serverless.DeadLetterQueueTypeArgsArgs>;
        /**
         * Set to true to create the Queue as FiFo. False for a Standard Queue.
         */
        isFifo?: pulumi.Input<boolean>;
        /**
         * The limit for a Queue message size in bytes. Minimum is 1 byte (1 character) and Maximum 262,144 bytes (256 KiB). By default a message can be 256 KiB large.
         */
        maxMessageSize?: pulumi.Input<number>;
        /**
         * The amount of time that a message will be stored in the Queue without being deleted. Minimum is 60 seconds (1 minutes) and Maximum 1,209,600 (14 days) seconds. By default a message is retained 4 days.
         */
        messageRetentionSeconds?: pulumi.Input<number>;
        /**
         * Custom policy for the Queue.
         */
        policy?: pulumi.Input<string>;
    }
}
export declare namespace storage {
    interface BucketEncryptionArgsArgs {
        customKeyId?: pulumi.Input<string>;
        enabled?: pulumi.Input<boolean>;
    }
    interface BucketReplicationArgsArgs {
        bucketArn?: pulumi.Input<string>;
    }
    interface BucketWebsiteArgsArgs {
        errorDocument?: pulumi.Input<string>;
        indexDocument?: pulumi.Input<string>;
    }
}

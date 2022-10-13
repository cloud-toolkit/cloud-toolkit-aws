import * as pulumiAws from "@pulumi/aws";
export declare namespace databases {
}
export declare namespace email {
    interface AdditionalQueueArgs {
        /**
         * Amazon Resource Name for the Queue component.
         */
        arn?: string;
        /**
         * Endpoint of the Queue component in AWS.
         */
        url?: string;
    }
    interface DnsDkimRecordArgs {
        /**
         * Name of the Record.
         */
        name?: string;
        /**
         * Token of the Record.
         */
        token?: string;
    }
}
export declare namespace kubernetes {
}
export declare namespace landingzone {
    interface AccountMappingArgs {
        account?: pulumiAws.organizations.Account;
        accountName?: string;
    }
    interface IamTrustedAccountRoleGroupMapping {
        group?: pulumiAws.iam.Group;
        roleName?: string;
    }
    interface IamTrustedAccountRoleGroupPolicyMapping {
        groupPolicy?: pulumiAws.iam.GroupPolicy;
        roleName?: string;
    }
    interface IamTrustingAccountRoleMapping {
        role?: pulumiAws.iam.Role;
        roleName?: string;
    }
    interface IamTrustingAccountRolePolicyAttachmentMapping {
        roleName?: string;
        rolePolicyAttachment?: pulumiAws.iam.RolePolicyAttachment[];
    }
    interface OrganizationAccountProviderMapping {
        accountName?: string;
        provider?: pulumiAws.Provider;
    }
    interface OrganizationalUnitMapping {
        accountName?: string;
        organizationalUnit?: pulumiAws.organizations.OrganizationalUnit;
    }
}
export declare namespace serverless {
}
export declare namespace storage {
}

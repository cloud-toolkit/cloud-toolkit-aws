import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { AccountIamArgs } from "./accountIamArgs";

export interface OrganizationArgs {
  /**
   * The organization ID to import the Organization in the stack. If not set a new AWS Organization will be created. Defaults to undefined.
   */
  organizationId?: string;

  /**
   * The Organization policies to be applied.
   */
  policies?: OrganizationPoliciesArgs;

  /**
   * The list of AWS Account to be configured in the Organization.
   */
  accounts?: OrganizationAccountArgs[];

  /**
   * The list of AWS Service Access Principals enabled in the organization.
   */
  services?: pulumi.Input<string>[];

  /**
   * The list of enabled Organizations Policies in the organization.
   */
  enabledPolicies?: pulumi.Input<string>[];

  /**
   * The FeatureSet in the Organization..
   */
  featureSet?: pulumi.Input<string>;
}

export interface OrganizationPoliciesArgs {
  /**
   * Deny IAM Account to leave the organization. Enabled by default.
   */
  denyLeaveOrganization?: OrganizationPolicyArgs;
}

export interface OrganizationPolicyArgs {
  /**
   * Enable the policy/
   */
  enabled?: boolean;

  /**
   * Import the policy with the given id
   */
  policyId?: string;
}

export interface OrganizationAccountArgs {
  /**
   * The name of the IAM Account.
   */
  name: string;

  /**
   * The email associated to the IAM Account.
   */
  email: string;

  /**
   * Admin role for the IAM Account.
   */
  adminRoleName?: string;

  /*
   *  The Organizational Unit to be used for the account.
   */
  ou?: string;

  /**
   * The AWS Account ID to be used to import the Account in the Organization. If not set, a new AWS Account will be created.
   */
  accountId?: string;

  /**
   * The parentId of the imported account.
   */
  parentId?: string;

  /**
   * The configuration for IAM.
   */
  iam: AccountIamArgs;
}

export const defaultOrganizationAccount = {
  adminRoleName: "root",
};

export interface PolicyData {
  name: string;
  description: string;
  policy: any;
}

export interface OrganizationPoliciesData {
  data: { [key: string]: PolicyData };
}

export const organizationPoliciesData: OrganizationPoliciesData = {
  data: {
    denyLeaveOrganization: {
      name: "Deny Leave Organization",
      description: "Prevent member accounts from leaving the organization",
      policy: {
        sid: "DenyLeaveOrganization",
        effect: "Deny",
        actions: ["organizations:LeaveOrganization"],
        resources: ["*"],
      },
    },
  },
};

export const defaultPolicies = {
  denyLeaveOrganization: {
    enabled: false,
  },
};

export const defaultOrganizationArgs = {
  allowedRegions: [],
  policies: defaultPolicies,
  accounts: [],
  services: ["cloudtrail.amazonaws.com"],
  enabledPolicies: ["SERVICE_CONTROL_POLICY"],
  featureSet: "ALL",
};

export interface OrganizationalUnitMapping {
  accountName: string;
  organizationalUnit: aws.organizations.OrganizationalUnit;
}

export interface OrganizationAccountProviderMapping {
  accountName: string;
  provider: aws.Provider;
}

export interface AccountMappingArgs {
  accountName: string;
  account: aws.organizations.Account;
}

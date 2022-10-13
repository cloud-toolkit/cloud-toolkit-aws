import { OrganizationArgs } from "./organizationArgs";
import { AuditLoggingArgs } from "./auditLoggingArgs";

export interface LandingZoneArgs {
  organization?: OrganizationArgs;
  audit?: LandingZoneAuditArgs;
  iam?: LandingZoneIamArgs;
}

export interface LandingZoneAuditArgs {
  /**
   * Enable audit logging. Defaults to 'true'.
   */
  enabled?: boolean;

  /**
   * Select the Organization account to be used to store the audit logs.
   */
  accountName?: string;

  /**
   * The data retention in days. Defaults to '7'.
   */
  retentionDays?: number;

  /**
   * Store the audit logs in CloudWatch to enable easy searching.
   */
  cloudwatch?: LandingZoneAuditCloudWatchArgs;
}

export interface LandingZoneAuditCloudWatchArgs {
  /**
   * Enable storing audit logs in CloudWatch. Defaults to 'false'.
   */
  enabled: boolean;

  /**
   * The data retention in days. Defaults to '1'.
   */
  retentionDays?: number;
}

export interface LandingZoneIamArgs {
  accountName?: string;
  roles?: LandingZoneIamRoleArgs[];
}

export interface LandingZoneIamRoleArgs {
  name: string;
  policyNames: string[];
}

export const landingZoneDefaultIamRoles = [
  {
    name: "Admin",
    policyNames: ["AdministratorAccess"],
  },
  {
    name: "Billing",
    policyNames: ["Billing"],
  },
  {
    name: "ReadOnly",
    policyNames: ["ReadOnlyAccess"],
  },
];

export const landingZoneDefaultArgs = {
  audit: {
    enabled: false,
    retentionDays: 7,
    cloudwatch: {
      enabled: false,
      retentionDays: 1,
    }
  },
};

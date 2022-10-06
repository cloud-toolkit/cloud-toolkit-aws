import { OrganizationArgs } from "./organizationArgs";

export interface LandingZoneArgs {
  organization?: OrganizationArgs;
  audit?: LandingZoneAuditArgs;
  iam?: LandingZoneIamArgs;
}

export interface LandingZoneAuditArgs {
  enabled?: boolean;
  accountName?: string;
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
  },
};

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { LandingZoneArgs, landingZoneDefaultIamRoles } from "./landingZoneArgs";
import { AccountIam } from "./accountIam";
import { AuditLogging } from "./auditLogging";
import { IamTrustingAccount } from "./iamTrustingAccount";
import { IamTrustedAccount } from "./iamTrustedAccount";
import { Organization } from "./organization";

export { LandingZoneArgs };

/**
 * Create a Landing Zone with the Organization, the AuditLogging, the AWS Accounts and the 
 *
 * @extends {pulumi.ComponentResource}
 */
export class LandingZone extends pulumi.ComponentResource {
  private args: LandingZoneArgs;
  private name: string;

  /**
   * The Organization components.
   */
  public readonly organization: Organization;

  /**
   * The AuditLogging component.
   */
  public readonly auditLogging?: AuditLogging;

  private readonly iamTrustingAccountMap: Map<string, IamTrustingAccount>;
  private readonly iamTrustedAccount: Map<string, IamTrustedAccount>;

  constructor(
    name: string,
    args: LandingZoneArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:landingzone:LandingZone", name, args, opts);
    this.name = name;
    this.args = this.validateArgs(args);

    const resourceOpts = pulumi.mergeOptions(opts, { parent: this });
    this.organization = this.setupOrganization(resourceOpts);
    this.auditLogging = this.setupAuditLogging(resourceOpts);
    this.iamTrustedAccount = this.setupIamTrustedAccount(resourceOpts);
    this.iamTrustingAccountMap = this.steupIamTrustingAccountMap(resourceOpts);

    this.registerOutputs({
      organization: this.organization,
      auditLogging: this.auditLogging,
    });
  }

  private validateArgs(args: LandingZoneArgs): LandingZoneArgs {
    return args;
  }

  private setupOrganization(opts?: pulumi.ResourceOptions): Organization {
    return new Organization(this.name, this.args.organization || {}, opts);
  }

  private setupAuditLogging(opts?: pulumi.ResourceOptions): AuditLogging | undefined {
    if (this.args.audit === undefined || !this.args.audit.enabled) {
      return undefined;
    }

    let bucketProvider = undefined;
    if (this.args.audit?.accountName !== undefined) {
      bucketProvider = this.getAccountProvider(this.args.audit.accountName); 
      if (bucketProvider === undefined) {
        pulumi.log.warn(
          `Audit account "${this.args.audit.accountName}"" not found. Please set the property "audit.accountName" with the name of one of the organization accounts.`,
          this
        );
      }
    }

    const auditLogging = new AuditLogging(
      this.name,
      {
        retentionDays: this.args.audit?.retentionDays,
        bucketProvider: bucketProvider,
      },
      opts
    );

    return auditLogging;
  }

  private setupIamTrustedAccount(
    opts?: pulumi.ResourceOptions
  ): Map<string, IamTrustedAccount> {
    const map = new Map<string, IamTrustedAccount>();

    if (this.args.iam?.accountName === undefined) {
      return map;
    }

    const trustedAccountProvider = this.getAccountProvider(this.args.iam?.accountName);
    if (trustedAccountProvider === undefined) {
      pulumi.log.error(
          `IAM account "${this.args.iam.accountName}"" not found. Please set the property "iam.accountName" with the name of one of the organization accounts.`,
        this
      );
    }
    const trustedAccountName = this.args.iam?.accountName;

    for (const accountMapping of this.organization.accounts) {
      if (this.args.iam.accountName == accountMapping.accountName) {
        continue;
      }

      const iamTrustedAccount = new IamTrustedAccount(
        `${this.name}-${trustedAccountName}-${accountMapping.accountName}`,
        {
          roles: landingZoneDefaultIamRoles,
          trustingAccountId: accountMapping.account.id,
          trustingAccountName: accountMapping.account.name,
        },
        pulumi.mergeOptions(opts, { provider: trustedAccountProvider })
      );
      map.set(accountMapping.accountName, iamTrustedAccount);
    }
    return map;
  }

  private getAccountProvider(name: string): aws.Provider | undefined {
    for (const accountProviderMapping of this.organization.accountProviders) {
      if (accountProviderMapping.accountName == name) {
        return accountProviderMapping.provider;
      }
    }
    return;
  }

  private steupIamTrustingAccountMap(
    opts?: pulumi.ResourceOptions
  ): Map<string, IamTrustingAccount> {
    const map = new Map<string, IamTrustingAccount>();

    if (this.args.iam?.accountName === undefined) {
      return map;
    }
    const trustedAccoutIds = this.getIamTrustedAccountIds();

    for (const accountProviderMapping of this.organization.accountProviders) {
      if (this.args.iam?.accountName != accountProviderMapping.accountName) {
        const iamTrustingAccount = new IamTrustingAccount(
          `${this.name}-${accountProviderMapping.accountName}`,
          {
            delegatedRoles: landingZoneDefaultIamRoles,
            delegatedAccountIds: trustedAccoutIds,
          },
          pulumi.mergeOptions(opts, { provider: accountProviderMapping.provider })
        );
        map.set(accountProviderMapping.accountName, iamTrustingAccount);
      }
    }

    return map;
  }

  private getIamTrustedAccountIds(): pulumi.Input<string>[] {
    let ids = [this.organization.organization.masterAccountId];
    for (const accountMapping of this.organization.accounts) {
      if (accountMapping.accountName == this.args.iam?.accountName) {
        ids = [accountMapping.account.id];
      }
    }

    return ids;
  }
}

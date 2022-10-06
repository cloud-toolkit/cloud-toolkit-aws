import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import defaultsDeep from "lodash.defaultsdeep";
import { AccountIam } from "./accountIam";
import {
  AccountMappingArgs,
  OrganizationAccountArgs,
  OrganizationAccountProviderMapping,
  OrganizationArgs,
  OrganizationPoliciesArgs,
  OrganizationPolicyArgs,
  OrganizationalUnitMapping,
  defaultOrganizationAccount,
  defaultOrganizationArgs,
  organizationPoliciesData,
} from "./organizationArgs";

export {
  OrganizationAccountArgs,
  OrganizationArgs,
  OrganizationPoliciesArgs,
  OrganizationPolicyArgs,
};

/**
 * Organization is the component that configure the AWS Orgazination, AWS Accounts and AWS Organization Policies.
 */
export class Organization extends pulumi.ComponentResource {
  private args: OrganizationArgs;
  private name: string;

  /**
   * The AWS Organization.
   */
  public readonly organization: aws.organizations.Organization;

  /**
   * The list of AWS Accounts inside the Organization.
   */
  public readonly accountIds: pulumi.Output<string>[];

  /**
   * The list of Policies used in the Organization.
   */
  public readonly policies: aws.organizations.Policy[];

  /**
   * The list of Policy Attachments used in the Organization.
   */
  public readonly policyAttachments: aws.organizations.PolicyAttachment[];

  /**
   * The list Organizatoinal Units.
   */
  public readonly organizationalUnits: OrganizationalUnitMapping[];

  /**
   * The list of Accounts.
   */
  public readonly accounts: AccountMappingArgs[];

  /**
   * The list of AWS Provider for the managed accounts by this component.
   */
  public readonly accountProviders: OrganizationAccountProviderMapping[];

  private readonly policyMap: Map<string, aws.organizations.Policy>;
  private readonly policyAttachmentMap: Map<
    string,
    aws.organizations.PolicyAttachment
  >;
  private readonly organizationalUnitMap: Map<string, aws.organizations.OrganizationalUnit>;
  private readonly accountMap: Map<string, aws.organizations.Account>;
  private readonly accountProviderMap: Map<string, aws.Provider>;
  private readonly accountIamMap: Map<string, AccountIam>;

  constructor(
    name: string,
    args: OrganizationArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:landingZone:Organization", name, {}, opts);
    this.name = name;
    this.args = this.validateArgs(args);

    const resourceOpts = {
      ...opts,
      parent: this,
    };

    this.organization = this.setupOrganization(resourceOpts);

    this.policyMap = this.setupPolicyMap(resourceOpts);
    this.policies = Array.from(this.policyMap.values());

    this.policyAttachmentMap = this.setupPolicyAttachmentMap(resourceOpts);
    this.policyAttachments = Array.from(this.policyAttachmentMap.values());

    this.organizationalUnitMap = this.setupOrganizationalUnits(resourceOpts);
    this.organizationalUnits = [];
    for (const [index, organizationalUnit] of this.organizationalUnitMap.entries()) {
      this.organizationalUnits.push({
        accountName: index,
        organizationalUnit: organizationalUnit,
      });
    }

    this.accountMap = this.setupAccountMap(resourceOpts);
    this.accounts = [];
    for (const [index, account] of this.accountMap.entries()) {
      this.accounts.push({
        accountName: index,
        account: account,
      });
    }

    this.accountProviderMap = this.setupAccountProviderMap(resourceOpts);
    this.accountProviders = [];
    for (const [index, provider] of this.accountProviderMap.entries()) {
      this.accountProviders.push({
        accountName: index,
        provider: provider,
      });
    }

    this.accountIamMap = this.setupAccountIamMap(resourceOpts);

    this.accountIds = this.setupAccountIds();

    this.registerOutputs({
      accountIds: this.accountIds,
      accounts: this.accounts,
      organization: this.organization,
      organizationalUnits: this.organizationalUnits,
      policies: this.policies,
      policyAttachments: this.policyAttachments,
    });
  }

  private validateArgs(args: OrganizationArgs): OrganizationArgs {
    const a = defaultsDeep({ ...args }, defaultOrganizationArgs);

    for (const [index, account] of a.accounts.entries()) {
      a.accounts[index] = defaultsDeep(
        { ...account },
        defaultOrganizationAccount
      );
    }

    return a;
  }

  /**
   * Setup and returns the AWS Organization
   */
  private setupOrganization(
    opts: pulumi.ResourceOptions
  ): aws.organizations.Organization {
    const organization = new aws.organizations.Organization(
      this.name,
      {
        awsServiceAccessPrincipals: ["cloudtrail.amazonaws.com"],
        enabledPolicyTypes: ["SERVICE_CONTROL_POLICY"],
        featureSet: "ALL",
      },
      pulumi.mergeOptions(opts, {
        import: this.args.organizationId,
        retainOnDelete: true,
      })
    );

    return organization;
  }

  private setupPolicyMap(
    opts?: pulumi.ResourceOptions
  ): Map<string, aws.organizations.Policy> {
    const map = new Map<string, aws.organizations.Policy>();

    for (const [id, policy] of Object.entries(this.args.policies || {})) {
      if (policy.enabled) {
        map.set(id, this.setupPolicy(id, policy, opts));
      }
    }

    return map;
  }

  /**
   * Setup a single Organizations Policy
   */
  private setupPolicy(
    name: string,
    policy: OrganizationPolicyArgs,
    opts?: pulumi.ResourceOptions
  ): aws.organizations.Policy {
    const policyData = organizationPoliciesData.data[name];
    const statements: aws.types.input.iam.GetPolicyDocumentStatementArgs[] = [];
    statements.push(policyData.policy);

    const policyDocument = aws.iam.getPolicyDocumentOutput({
      statements: statements,
    });

    const awsPolicy = new aws.organizations.Policy(
      `${this.name}-${name}`,
      {
        name: policyData.name,
        description: policyData.description,
        content: policyDocument.json,
      },
      pulumi.mergeOptions(opts, { import: policy.policyId })
    );

    return awsPolicy;
  }

  private setupPolicyAttachmentMap(
    opts?: pulumi.ResourceOptions
  ): Map<string, aws.organizations.PolicyAttachment> {
    const map = new Map<string, aws.organizations.PolicyAttachment>();

    for (const [id, policy] of Object.entries(this.args.policies || {})) {
      const awsPolicy = this.policyMap.get(id);
      if (awsPolicy) {
        map.set(id, this.setupPolicyAttachment(id, policy, awsPolicy, opts));
      }
    }

    return map;
  }

  private setupPolicyAttachment(
    name: string,
    policy: OrganizationPolicyArgs,
    awsPolicy: aws.organizations.Policy,
    opts?: pulumi.ResourceOptions
  ): aws.organizations.PolicyAttachment {
    return new aws.organizations.PolicyAttachment(
      `${this.name}-${name}`,
      {
        policyId: awsPolicy.id,
        targetId: this.organization.roots[0].id,
      },
      opts
    );
  }

  private setupOrganizationalUnits(
    opts: pulumi.ResourceOptions
  ): Map<string, aws.organizations.OrganizationalUnit> {
    const map = new Map<string, aws.organizations.OrganizationalUnit>();

    if (this.args.accounts === undefined) {
      return map;
    }

    for (const account of this.args.accounts) {
      // Organizational Unit is not defined in account
      if (account.ou === undefined) {
        continue;
      }

      // Organizational Unit already created
      if (map.get(account.ou) !== undefined) {
        continue;
      }

      const organizationalUnit = new aws.organizations.OrganizationalUnit(
        `${this.name}-${account.ou}`,
        {
          name: account.ou,
          parentId: this.organization.roots[0].id,
        },
        opts
      );

      map.set(account.ou, organizationalUnit);
    }

    return map;
  }

  private setupAccountMap(
    opts?: pulumi.ResourceOptions
  ): Map<string, aws.organizations.Account> {
    const map = new Map<string, aws.organizations.Account>();

    for (const accountData of this.args.accounts || []) {
      const acc = this.setupAccount(accountData, opts);
      map.set(accountData.name, acc);
    }

    return map;
  }

  private setupAccount(
    accountData: OrganizationAccountArgs,
    opts?: pulumi.ResourceOptions
  ): aws.organizations.Account {
    let parentId = this.organization.roots[0].id;

    // Set Organization Unit as parent if defined
    if (accountData.ou !== undefined) {
      const ou = this.organizationalUnitMap.get(accountData.ou);
      if (ou !== undefined) {
        parentId = ou.id;
      }
    }

    // Create the account
    return new aws.organizations.Account(
      `${this.name}-${accountData.name}`,
      {
        closeOnDeletion: false,
        email: accountData.email,
        iamUserAccessToBilling: "ALLOW",
        name: accountData.name,
        parentId: accountData.parentId || parentId,
        roleName: accountData.adminRoleName,
      },
      pulumi.mergeOptions(opts, {
        import: accountData.accountId,
        ignoreChanges: ["roleName", "iamUserAccessToBilling"],
        retainOnDelete: true,
      })
    );
  }

  private setupAccountProviderMap(
    opts?: pulumi.ResourceOptions
  ): Map<string, aws.Provider> {
    const map = new Map<string, aws.Provider>();

    for (const accountData of this.args.accounts || []) {
      const account = this.accountMap.get(accountData.name);
      if (account === undefined) {
        continue;
      }
      const provider = new aws.Provider(
        accountData.name,
        {
          // https://github.com/pulumi/pulumi-aws/issues/2144
          skipCredentialsValidation: true,
          assumeRole: {
            roleArn: this.getAssumeRoleArn(accountData, account),
          },
        },
        pulumi.mergeOptions(opts, {
          dependsOn: [account],
        })
      );
      map.set(accountData.name, provider);
    }

    return map;
  }

  private setupAccountIamMap(opts: pulumi.ResourceOptions): Map<string, AccountIam> {
    const map = new Map<string, AccountIam>();
    for (const accountData of this.args.accounts || []) {
      const account = this.accountMap.get(accountData.name);
      const provider = this.accountProviderMap.get(accountData.name);
      const accountOpts = pulumi.mergeOptions(opts, {
        parent: account,
        provider: provider,
        deleteBeforeReplace: true,
      });
      const accountIam = new AccountIam(`${this.name}-${accountData.name}`, accountData.iam, accountOpts);
      map.set(accountData.name, accountIam);
    }
    return map;
  }

  private getAssumeRoleArn(
    accountData: OrganizationAccountArgs,
    account: aws.organizations.Account
  ): pulumi.Output<string> {
    return pulumi.interpolate`arn:aws:iam::${account.id}:role/${accountData.adminRoleName}`;
  }

  private setupAccountIds() {
    const list: pulumi.Output<string>[] = [];
    for (const [name, account] of this.accountMap) {
      list.push(account.id);
    }

    return list;
  }
}

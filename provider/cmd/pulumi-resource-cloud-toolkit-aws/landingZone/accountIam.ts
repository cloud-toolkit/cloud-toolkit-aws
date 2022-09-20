import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import defaultsDeep from "lodash.defaultsdeep";
import {
  AccountIamArgs,
  AccountPasswordPolicyArgs,
  AccountPasswordPolicyRulesArgs,
  defaultArgs,
} from "./accountIamArgs";

export {
  AccountIamArgs,
  AccountPasswordPolicyArgs,
  AccountPasswordPolicyRulesArgs,
};

/**
 * Cluster is a component that configure the IAM service for a given account.
 */
export class AccountIam extends pulumi.ComponentResource {
  private args: AccountIamArgs;
  private name: string;

  /**
   * The IAM Account Alias.
   */
  public alias?: aws.iam.AccountAlias;

  /**
   * The IAM Account Password policy.
   */
  public passwordPolicy?: aws.iam.AccountPasswordPolicy;

  constructor(name: string, args: AccountIamArgs, opts?: pulumi.ResourceOptions) {
    super("cloud-toolkit-aws:landingZone:AccountIam", name, args, opts);
    this.name = name;
    this.args = this.validateArgs(args);

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    this.alias = this.setupAlias(resourceOpts);
    this.passwordPolicy = this.setupPasswordPolicy(resourceOpts);

    this.registerOutputs({
      alias: this.alias,
      passwordPolicy: this.passwordPolicy,
    });
  }

  private validateArgs(args: AccountIamArgs): AccountIamArgs {
    const a = defaultsDeep({ ...args }, defaultArgs);
    return a;
  }

  private setupAlias(
    opts: pulumi.ResourceOptions
  ): aws.iam.AccountAlias | undefined {
    if (this.args.alias === undefined) {
      return;
    }

    return new aws.iam.AccountAlias(
      this.name,
      {
        accountAlias: this.args.alias,
      },
      {
        ...opts,
        deleteBeforeReplace: true,
      }
    );
  }

  private setupPasswordPolicy(
    opts: pulumi.ResourceOptions
  ): aws.iam.AccountPasswordPolicy | undefined {
    if (
      this.args.passwordPolicy === undefined ||
      !this.args.passwordPolicy.enabled
    ) {
      return;
    }

    const rules = this.args.passwordPolicy.rules;
    if (rules === undefined) {
      return;
    }

    return new aws.iam.AccountPasswordPolicy(
      this.name,
      {
        allowUsersToChangePassword: rules.allowUsersToChangePassword,
        hardExpiry: rules.hardExpiry,
        maxPasswordAge: rules.maxPasswordAge,
        minimumPasswordLength: rules.minimumPasswordLength,
        passwordReusePrevention: rules.passwordReusePrevention,
        requireLowercaseCharacters: rules.requireLowercaseCharacters,
        requireNumbers: rules.requireNumbers,
        requireSymbols: rules.requireSymbols,
        requireUppercaseCharacters: rules.requireUppercaseCharacters,
      },
      opts
    );
  }
}

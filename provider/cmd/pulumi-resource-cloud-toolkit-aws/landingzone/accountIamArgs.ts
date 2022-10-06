export interface AccountIamArgs {
  /**
   * The alias to be used for IAM.
   */
  alias?: string;

  /**
   * The IAM password policy configuration.
   */
  passwordPolicy?: AccountPasswordPolicyArgs;
}

export interface AccountPasswordPolicyArgs {
  /**
   * Enable the creation of IAM Password Policy. Defaults to 'true'.
   */
  enabled?: boolean;

  /**
   * The rules to be applied to the IAM Password Policy
   */
  rules?: AccountPasswordPolicyRulesArgs;
}

export interface AccountPasswordPolicyRulesArgs {
  /**
   * Whether to allow users to change their own password. Defaults to 'true'.
   */
  allowUsersToChangePassword?: boolean;

  /**
   * Whether users are prevented from setting a new password after their password has expired (i.e., require administrator reset). Defaults to 'true'.
   */
  hardExpiry?: boolean;

  /**
   * The number of days that an user password is valid. Defaults to '90'.
   */
  maxPasswordAge?: number;

  /**
   * Minimum length to require for user passwords. Defaults to '14'.
   */
  minimumPasswordLength?: number;

  /**
   * The number of previous passwords that users are prevented from reusing. Defaults to '0'.
   */
  passwordReusePrevention?: number;

  /**
   * Whether to require lowercase characters for user passwords. Defaults to 'true'.
   */
  requireLowercaseCharacters?: boolean;

  /**
   * Whether to require numbers for user passwords. Defaults to 'true'.
   */
  requireNumbers?: boolean;

  /**
   * Whether to require symbols for user passwords. Defaults to 'true'.
   */
  requireSymbols?: boolean;

  /**
   * Whether to require uppercase characters for user passwords. Defaults to 'true'.
   */
  requireUppercaseCharacters?: boolean;
}

export const defaultPasswordPolicy = {
  enabled: true,
  rules: {
    allowUsersToChangePassword: true,
    hardExpiry: true,
    maxPasswordAge: 90,
    minimumPasswordLength: 14,
    passwordReusePrevention: 0,
    requireLowercaseCharacters: true,
    requireNumbers: true,
    requireSymbols: true,
    requireUppercaseCharacters: true,
  },
};
export const defaultArgs = {
  passwordPolicy: defaultPasswordPolicy,
};

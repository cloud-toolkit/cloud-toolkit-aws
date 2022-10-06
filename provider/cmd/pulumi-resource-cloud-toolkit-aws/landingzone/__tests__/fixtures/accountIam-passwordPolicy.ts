export default {
  passwordPolicy: {
    enabled: true,
    rules: {
      allowUsersToChangePassword: false,
      hardExpiry: false,
      maxPasswordAge: 91,
      minimumPasswordLength: 15,
      passwordReusePrevention: 4,
      requireLowercaseCharacters: false,
      requireNumbers: false,
      requireSymbols: false,
      requireUppercaseCharacters: false,
    },
  }
}

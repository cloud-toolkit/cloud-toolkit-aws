import * as pulumi from "@pulumi/pulumi";
import aliasConfig from "./fixtures/accountIam-alias";
import passwordPolicyConfig from "./fixtures/accountIam-passwordPolicy";

import {
  defaultArgs,
} from "../accountIamArgs";

function promiseOf<T>(output: pulumi.Output<T>): Promise<T> {
    return new Promise(resolve => output.apply(resolve));
}

pulumi.runtime.setMocks(
  {
    newResource: function (args: pulumi.runtime.MockResourceArgs): {
      id: string;
      state: any;
    } {
      return {
        id: args.inputs.name + "_id",
        state: args.inputs,
      };
    },
    call: function (args: pulumi.runtime.MockCallArgs) {
      return args.inputs;
    },
  },
  "project",
  "stack",
  true
);

describe("Minimal configuration", function () {
  let component: typeof import("../accountIam");

  beforeAll(async function () {
    component = await import("../accountIam");
  });

  test("It should not create the IAM Alias", async function () {
    const componentName = "test";
    const instance = new component.AccountIam("test", {});
    expect(instance.alias).toBeUndefined();
  });

  test("It should create the IAM Password Policy with default values", async function () {
    const instance = new component.AccountIam("test", {});
    expect(instance.passwordPolicy).toBeDefined();
    expect(await promiseOf(instance.passwordPolicy!.allowUsersToChangePassword)).toBe(defaultArgs.passwordPolicy.rules.allowUsersToChangePassword);
    expect(await promiseOf(instance.passwordPolicy!.hardExpiry)).toBe(defaultArgs.passwordPolicy.rules.hardExpiry);
    expect(await promiseOf(instance.passwordPolicy!.maxPasswordAge)).toBe(defaultArgs.passwordPolicy.rules.maxPasswordAge);
    expect(await promiseOf(instance.passwordPolicy!.minimumPasswordLength)).toBe(defaultArgs.passwordPolicy.rules.minimumPasswordLength);
    expect(await promiseOf(instance.passwordPolicy!.passwordReusePrevention)).toBe(defaultArgs.passwordPolicy.rules.passwordReusePrevention);
    expect(await promiseOf(instance.passwordPolicy!.requireLowercaseCharacters)).toBe(defaultArgs.passwordPolicy.rules.requireLowercaseCharacters);
    expect(await promiseOf(instance.passwordPolicy!.requireNumbers)).toBe(defaultArgs.passwordPolicy.rules.requireNumbers);
    expect(await promiseOf(instance.passwordPolicy!.requireSymbols)).toBe(defaultArgs.passwordPolicy.rules.requireSymbols);
    expect(await promiseOf(instance.passwordPolicy!.requireUppercaseCharacters)).toBe(defaultArgs.passwordPolicy.rules.requireUppercaseCharacters);
  });
});

describe("Set alias", function () {
  let component: typeof import("../accountIam");

  beforeAll(async function () {
    component = await import("../accountIam");
  });

  test("It should not create the IAM Alias", async function () {
    const componentName = "test";
    const instance = new component.AccountIam("test", aliasConfig);

    expect(instance.alias).toBeDefined();
    expect(await promiseOf(instance.alias!.accountAlias)).toBe(aliasConfig.alias);
  });
});

describe("Custom password policy", function () {
  let component: typeof import("../accountIam");

  beforeAll(async function () {
    component = await import("../accountIam");
  });

  test("It should create the IAM Password Policy with custom values", async function () {
    const instance = new component.AccountIam("test", passwordPolicyConfig);
    expect(instance.passwordPolicy).toBeDefined();
    expect(await promiseOf(instance.passwordPolicy!.allowUsersToChangePassword)).toBe(passwordPolicyConfig.passwordPolicy.rules.allowUsersToChangePassword);
    expect(await promiseOf(instance.passwordPolicy!.hardExpiry)).toBe(passwordPolicyConfig.passwordPolicy.rules.hardExpiry);
    expect(await promiseOf(instance.passwordPolicy!.maxPasswordAge)).toBe(passwordPolicyConfig.passwordPolicy.rules.maxPasswordAge);
    expect(await promiseOf(instance.passwordPolicy!.minimumPasswordLength)).toBe(passwordPolicyConfig.passwordPolicy.rules.minimumPasswordLength);
    expect(await promiseOf(instance.passwordPolicy!.passwordReusePrevention)).toBe(passwordPolicyConfig.passwordPolicy.rules.passwordReusePrevention);
    expect(await promiseOf(instance.passwordPolicy!.requireLowercaseCharacters)).toBe(passwordPolicyConfig.passwordPolicy.rules.requireLowercaseCharacters);
    expect(await promiseOf(instance.passwordPolicy!.requireNumbers)).toBe(passwordPolicyConfig.passwordPolicy.rules.requireNumbers);
    expect(await promiseOf(instance.passwordPolicy!.requireSymbols)).toBe(passwordPolicyConfig.passwordPolicy.rules.requireSymbols);
    expect(await promiseOf(instance.passwordPolicy!.requireUppercaseCharacters)).toBe(passwordPolicyConfig.passwordPolicy.rules.requireUppercaseCharacters);
  });
});

describe("Disable password policy", function () {
  let component: typeof import("../accountIam");

  beforeAll(async function () {
    component = await import("../accountIam");
  });

  test("It should not create the IAM Password Policy", async function () {
    const instance = new component.AccountIam("test", {passwordPolicy: {enabled: false}});
    expect(instance.passwordPolicy).toBeUndefined();
  });
});

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import { defaultOrganizationArgs } from "../organizationArgs";
import minimalConfiguration from "./fixtures/organizationMinimalConfiguration";
import setAccountsConfiguration from "./fixtures/organizationSetAccountsConfiguration";

function GetValue<T>(output: pulumi.Output<T>) {
  return new Promise<T>((resolve, reject) => {
    output.apply((value) => {
      resolve(value);
    });
  });
}

pulumi.runtime.setMocks({
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
});

describe("Minimal configuration", function () {
  let component: typeof import("../index");

  beforeAll(async function () {
    component = await import("../index");
  });

  test("It should create the AWS Organization", async function () {
    const componentName = "test";
    const instance = new component.Organization(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.organization).toBeDefined();
  });

  test("It should create the default Policies", async function () {
    const componentName = "test";
    const instance = new component.Organization(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.policies).toBeDefined();
    expect(instance.policies.length).toBe(1);
  });

  test("It should create the default PolicyAttachments", async function () {
    const componentName = "test";
    const instance = new component.Organization(
      componentName,
      minimalConfiguration,
      {}
    );

    expect(instance.policyAttachments).toBeDefined();
    expect(instance.policyAttachments.length).toBe(1);
  });

  test("It shouldn't create any AWS Account", async function () {
    const componentName = "test";
    const instance = new component.Organization(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.accounts).toBeDefined();
    expect(instance.accounts.length).toBe(0);
  });

  test("It shouldn't create any Organizational Unit", async function () {
    const componentName = "test";
    const instance = new component.Organization(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.organizationalUnits).toBeDefined();
    expect(Object.keys(instance.organizationalUnits).length).toBe(0);
  });
});

describe("Set accounts", function () {
  let component: typeof import("../index");

  beforeAll(async function () {
    component = await import("../index");
  });

  test("It should create the AWS Accounts from the configuration", async function () {
    const componentName = "test";
    const instance = new component.Organization(
      componentName,
      setAccountsConfiguration,
      {}
    );
    expect(instance.accounts).toBeDefined();
    expect(instance.accounts.length).toBe(setAccountsConfiguration.accounts.length);

    for (const accountData of setAccountsConfiguration.accounts) {
      let account: aws.organizations.Account;
      for (const accountMapping of instance.accounts) {
        if (accountData.name == accountMapping.accountName) {
          account = accountMapping.account;
          break;
        }
      }
      expect(account).toBeDefined();
      expect(await GetValue(account.name)).toBe(accountData.name);
      expect(await GetValue(account.email)).toBe(accountData.email);
    }
  });

  test("It should create the Organizational Unit", async function () {
    const componentName = "test";
    const instance = new component.Organization(
      componentName,
      setAccountsConfiguration,
      {}
    );
    expect(instance.organizationalUnits).toBeDefined();

    for (const accountConfig of setAccountsConfiguration.accounts) {
      if (accountConfig.ou === undefined) {
        continue;
      }

      let organizationalUnit: aws.organizations.OrganizationalUnit;
      for (const ouMapping of instance.organizationalUnits) {
        if (accountConfig.ou == ouMapping.accountName) {
          organizationalUnit = ouMapping.organizationalUnit;
          break;
        }
      }

      expect(organizationalUnit).toBeDefined();
      expect(await GetValue(organizationalUnit.name)).toBe(accountConfig.ou);
    }
  });
});

import * as pulumi from "@pulumi/pulumi";
import defaultConfig from "./fixtures/iamTrustingAccount";

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
  let component: typeof import("../iamTrustingAccount");

  beforeAll(async function () {
    component = await import("../iamTrustingAccount");
  });

  test("It should create the delegated Roles from given configuration", async function () {
    const instance = new component.IamTrustingAccount("test", defaultConfig);
    expect(instance.delegatedRoles.length).toBe(defaultConfig.delegatedRoles.length);
  });

  test("It should create the delegated Role Policy Attachments from given configuration", async function () {
    const instance = new component.IamTrustingAccount("test", defaultConfig);
    expect(instance.delegatedRolePolicyAttachments.length).toBe(defaultConfig.delegatedRoles.length);
  });

});

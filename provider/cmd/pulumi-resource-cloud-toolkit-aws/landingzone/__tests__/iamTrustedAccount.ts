import * as pulumi from "@pulumi/pulumi";
import defaultConfig from "./fixtures/iamTrustedAccount";

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
  let component: typeof import("../iamTrustedAccount");

  beforeAll(async function () {
    component = await import("../iamTrustedAccount");
  });

  test("It should create the Groups from given configuration", async function () {
    const instance = new component.IamTrustedAccount("test", defaultConfig);
    expect(instance.roleGroups.length).toBe(defaultConfig.roles.length);
  });

  test("It should create the Group Policies from given configuration", async function () {
    const instance = new component.IamTrustedAccount("test", defaultConfig);
    expect(instance.roleGroupPolicies.length).toBe(defaultConfig.roles.length);
  });

});

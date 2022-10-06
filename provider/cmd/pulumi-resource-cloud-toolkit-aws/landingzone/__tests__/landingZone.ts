import * as pulumi from "@pulumi/pulumi";
import auditConfig from "./fixtures/landingZoneAudit";

import {
  landingZoneDefaultArgs,
} from "../landingZoneArgs";

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
  let component: typeof import("../landingZone");

  beforeAll(async function () {
    component = await import("../landingZone");
  });

  test("It should create the Organization component", async function () {
    const instance = new component.LandingZone("test", {});
    expect(instance.organization).toBeDefined();
  });

  test("It shouldn't create the AuditLogging component", async function () {
    const instance = new component.LandingZone("test", {});
    expect(instance.auditLogging).toBeUndefined();
  });
});

describe("Audit configuration", function () {
  let component: typeof import("../landingZone");

  beforeAll(async function () {
    component = await import("../landingZone");
  });

  test("It should create the AuditLogging component", async function () {
    const instance = new component.LandingZone("test", auditConfig);
    expect(instance.auditLogging).toBeDefined();
  });
});

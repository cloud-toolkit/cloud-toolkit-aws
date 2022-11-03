import * as pulumi from "@pulumi/pulumi";
import minimalConfiguration from "./fixtures/minimal-configuration";

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
  let component: typeof import("../staticweb");

  beforeAll(async function () {
    component = await import("../staticweb");
  });

  test("It should create the S3 Bucket for content", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(componentName, minimalConfiguration, {});
    expect(instance.contentBucket).toBeDefined();
  });

  test("It should create the S3 Bucket for logs", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(componentName, minimalConfiguration, {});
    expect(instance.logsBucket).toBeDefined();
  });

  test("It should create the Origin Access Identity", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(componentName, minimalConfiguration, {});
    expect(instance.originAccessIdentity).toBeDefined();
  });

  test("It should create the Cloudfront Distribution", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(componentName, minimalConfiguration, {});
    expect(instance.originAccessIdentity).toBeDefined();
  });

  test("It should create the Certificate", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(componentName, minimalConfiguration, {});
    expect(instance.certificate).toBeDefined();
  });

  test("It should create the Certificate Validation", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(componentName, minimalConfiguration, {});
    expect(instance.certificateValidation).toBeDefined();
  });

  test("It should create the DNS Records", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(componentName, minimalConfiguration, {});
    expect(instance.DNSRecords).toBeDefined();
  });

  test("It should create the DNS Records for validation", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(componentName, minimalConfiguration, {});
    expect(instance.DNSRecordsForValidation).toBeDefined();
  });

  test("It should not create the Certificate Validation", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(
      componentName,
      { configureDNS: false },
      {}
    );
    expect(instance.certificateValidation).toBeUndefined();
  });

  test("It should not create the DNS Records", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(
      componentName,
      { configureDNS: false },
      {}
    );
    expect(instance.DNSRecords).toBeUndefined();
  });

  test("It should not create the DNS Records for validation", async function () {
    const componentName = "test";
    const instance = new component.StaticWeb(
      componentName,
      { configureDNS: false },
      {}
    );
    expect(instance.DNSRecordsForValidation).toBeUndefined();
  });

  test("It should throw and error because domain value is defined but configureDNS = `false`", async function () {
    const componentName = "test";
    const throwError = () => {
      const instance = new component.StaticWeb(
        componentName,
        { ...minimalConfiguration, configureDNS: false },
        {}
      );
    };

    expect(throwError).toThrow(
      /It's\snot\spossible\sto\sconfig\sthe\sdomain\.*/
    );
  });
});

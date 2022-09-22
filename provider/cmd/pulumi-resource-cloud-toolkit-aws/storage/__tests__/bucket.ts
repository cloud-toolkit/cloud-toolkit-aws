import * as pulumi from "@pulumi/pulumi";
import minimalConfiguration from "./fixtures/minimal-configuration";
import fullConfiguration from "./fixtures/full-configuration";
import fullConfigurationReplication from "./fixtures/full-configurationReplication";

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

  test("It should create the Bucket component", async function () {
    const componentName = "test";
    const instance = new component.Bucket(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance).toBeDefined();
  });

  test("It should assign public or private visibility to bucket", async function () {
    const componentName = "test";
    const instance = new component.Bucket(
      componentName,
      minimalConfiguration,
      {}
    );

    expect(await GetValue(instance.bucketPublicAccess.blockPublicAcls)).toBe(
      !minimalConfiguration.public
    );

    expect(await GetValue(instance.bucketPublicAccess.blockPublicPolicy)).toBe(
      !minimalConfiguration.public
    );

    expect(await GetValue(instance.bucketPublicAccess.ignorePublicAcls)).toBe(
      !minimalConfiguration.public
    );

    expect(
      await GetValue(instance.bucketPublicAccess.restrictPublicBuckets)
    ).toBe(!minimalConfiguration.public);
  });

  test("It should set enforce object ownership to bucket owner", async function () {
    const componentName = "test";
    const instance = new component.Bucket(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(await GetValue(instance.bucketOwnership.rule.objectOwnership)).toBe(
      "BucketOwnerEnforced"
    );
  });
});

describe("Full configuration", function () {
  let component: typeof import("../index");

  beforeAll(async function () {
    component = await import("../index");
  });

  test("It should encrypt our bucket", async function () {
    const componentName = "test";
    const instance = new component.Bucket(componentName, fullConfiguration, {});

    expect(instance.bucketEncryption).toBeDefined();
  });

  test("It should encrypt our bucket with a custom aws kms key", async function () {
    const componentName = "test";
    const instance = new component.Bucket(componentName, fullConfiguration, {});

    expect(instance.bucketEncryption).toBeDefined();
  });

  test("It should enable bucket versioning", async function () {
    const componentName = "test";
    const instance = new component.Bucket(componentName, fullConfiguration, {});

    expect(
      await GetValue(instance.bucketVersioning.versioningConfiguration.status)
    ).toBe(fullConfiguration.versioning);
  });

  test("It should be set as a website", async function () {
    const componentName = "test";
    const instance = new component.Bucket(
      componentName,
      {
        ...fullConfiguration,
        website: {
          indexDocument: "index.html",
          errorDocument: "error.html",
        },
      },
      {}
    );

    expect(instance.website).toBeDefined();
  });

  test("It should replicate bucket data to destination bucket", async function () {
    const componentName = "test";
    const instance = new component.Bucket(
      componentName,
      fullConfigurationReplication,
      {}
    );

    if (instance.replicationConfig !== undefined) {
      expect(
        await GetValue(instance.replicationConfig?.rules[0].destination.bucket)
      ).toBe(fullConfigurationReplication.replication.bucketArn);
    }
  });
});

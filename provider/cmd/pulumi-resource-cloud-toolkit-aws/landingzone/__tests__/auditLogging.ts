import * as pulumi from "@pulumi/pulumi";

import { defaultAuditLoggingArgs } from "../auditLoggingArgs";
import minimalConfiguration from "./fixtures/auditLoggingMinimalConfiguration";
import retentionDaysConfiguration from "./fixtures/auditLoggingRetentionDays";

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
  let component: typeof import("../auditLogging");

  beforeAll(async function () {
    component = await import("../auditLogging");
  });

  test("It should create the AWS Cloudwatch resources", async function () {
    const instance = new component.AuditLogging("test", minimalConfiguration);

    expect(instance.cloudWatchLogGroup).toBeDefined();
    expect(instance.cloudWatchRole).toBeDefined();
    expect(instance.cloudWatchPolicy).toBeDefined();
    expect(instance.cloudWatchRolePolicyAttachment).toBeDefined();
    expect(instance.cloudWatchDashboard).toBeDefined();
  });

  test("It should create the AWS S3 resources", async function () {
    const instance = new component.AuditLogging("test", minimalConfiguration);

    expect(instance.bucket).toBeDefined();
    expect(instance.bucketAcl).toBeDefined();
    expect(instance.bucketPublicAccessBlock).toBeDefined();
    expect(instance.bucketLifecycleConfiguration).toBeDefined();
    expect(instance.bucketPolicy).toBeDefined();
  });

  test("It should create the AWS Cloudtrail resources", async function () {
    const instance = new component.AuditLogging("test", minimalConfiguration);

    expect(instance.trail).toBeDefined();
  });

  test("It should set the appropiate retention days in Cloudwatch LogGroup", async function () {
    const instance = new component.AuditLogging("test", minimalConfiguration);

    expect(await GetValue(instance.cloudWatchLogGroup.retentionInDays)).toBe(
      defaultAuditLoggingArgs.retentionDays
    );
  });

  test("It should set the appropiate retention days in S3 Bucket", async function () {
    const instance = new component.AuditLogging("test", minimalConfiguration);

    const rules = await GetValue(instance.bucketLifecycleConfiguration.rules);
    expect(rules.length).toBe(1);

    const rule = rules[0];
    if (rule !== undefined) {
      expect(rule.expiration?.days).toBe(defaultAuditLoggingArgs.retentionDays);
    }
  });
});

describe("RetentionDays configuration", function () {
  let component: typeof import("../auditLogging");

  beforeAll(async function () {
    component = await import("../auditLogging");
  });

  test("It should set the appropiate retention days in Cloudwatch LogGroup", async function () {
    const instance = new component.AuditLogging("test", retentionDaysConfiguration);

    expect(await GetValue(instance.cloudWatchLogGroup.retentionInDays)).toBe(
      retentionDaysConfiguration.retentionDays
    );
  });

  test("It should set the appropiate retention days in S3 Bucket", async function () {
    const instance = new component.AuditLogging("test", retentionDaysConfiguration);

    const rules = await GetValue(instance.bucketLifecycleConfiguration.rules);
    expect(rules.length).toBe(1);

    const rule = rules[0];
    if (rule !== undefined) {
      expect(rule.expiration?.days).toBe(
        retentionDaysConfiguration.retentionDays
      );
    }
  });
});

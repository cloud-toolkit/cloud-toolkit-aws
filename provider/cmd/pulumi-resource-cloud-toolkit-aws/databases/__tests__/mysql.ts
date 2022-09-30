import * as pulumi from "@pulumi/pulumi";

import { defaultSize } from "./../mysqlArgs";
import minimalConfiguration from "./fixtures/mysql-minimal-configuration";
import fullConfiguration from "./fixtures/mysql-full-configuration";
import { Mysql} from "../mysql";

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

  test("It should create the database component", async function () {
    const componentName = "test";
    const instance = new Mysql(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.instance).toBeDefined();
  });

  test("It should select instance size", async function () {
    const componentName = "test";
    const instance = new Mysql(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(await GetValue(instance.instance.instanceClass)).toBe(
      minimalConfiguration.instance
    );
  });

  test("It should assign database name and credentials", async function () {
    const componentName = "test";
    const instance = new Mysql(
      componentName,
      minimalConfiguration,
      {}
    );

    expect(await GetValue(instance.instance.dbName)).toBe(
      minimalConfiguration.database.name
    );
    expect(await GetValue(instance.instance.username)).toBe(
      minimalConfiguration.database.username
    );
    expect(instance.instance.password).toBeDefined();
  });

  test("It should assign storage to database", async function () {
    const componentName = "test";
    const instance = new Mysql(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(await GetValue(instance.instance.allocatedStorage)).toBe(
      minimalConfiguration.storage.size
    );
  });

  test("It should create AWS secret credentials", async function () {
    const componentName = "test";
    const instance = new Mysql(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.secret).toBeDefined();
    expect(instance.secretVersion).toBeDefined();
  });
});

describe("Full configuration", function () {
  let component: typeof import("../index");

  beforeAll(async function () {
    component = await import("../index");
  });

  test("It should assign storage type to database", async function () {
    const componentName = "test";
    const instance = new Mysql(componentName, fullConfiguration, {});
    expect(await GetValue(instance.instance.storageType)).toBe(
      fullConfiguration.storage.type
    );

  });

  test("It should configure database backup", async function () {
    const componentName = "test";
    const instance = new Mysql(componentName, fullConfiguration, {});
    expect(await GetValue(instance.instance.backupRetentionPeriod)).toBe(
      fullConfiguration.backup.retentionDays
    );
    expect(await GetValue(instance.instance.backupWindow)).toBe(
      fullConfiguration.backup.preferredWindow
    );
  });

  test("It should configure subnet group", async function () {
    const componentName = "test";
    const instance = new Mysql(componentName, fullConfiguration, {});
    expect(instance.subnetGroup).toBeDefined();

    if (instance.subnetGroup?.subnetIds !== undefined) {
      expect(await GetValue(instance.subnetGroup?.subnetIds.length)).toBe(
        fullConfiguration.networking.subnetIds.length
      );
    }
  });

  test("It should create a security group", async function () {
    const componentName = "test";
    const instance = new Mysql(componentName, fullConfiguration, {});
    expect(instance.securityGroup).toBeDefined();
  });

  test("It should configure a security group with firewall rules", async function () {
    const componentName = "test";
    const instance = new Mysql(componentName, fullConfiguration, {});
    expect(instance.ingressSecurityGroupRules.length).toBe(
      fullConfiguration.networking.allowedCidr.length
    );
  });
});

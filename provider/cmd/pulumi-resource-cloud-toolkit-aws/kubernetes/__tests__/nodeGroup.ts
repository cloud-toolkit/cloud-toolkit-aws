import * as pulumi from "@pulumi/pulumi";
import minimalConfiguration from "./fixtures/nodeGroup-minimal-configuration";
import nodeCountConfiguration from "./fixtures/nodeGroup-nodecount";

import { defaultNodeGroupArgs } from "../nodeGroupArgs";

function GetValue<T>(output?: pulumi.Output<T>) {
  if (!output) {
    return Promise.resolve();
  }
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
  let component: typeof import("../nodeGroup");

  beforeAll(async function () {
    component = await import("../nodeGroup");
  });

  test("It should create the IAM Role for the NodeGroup", async function () {
    const componentName = "test";
    const instance = new component.NodeGroup(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.role).toBeDefined();
  });

  test("It should create the 3 IAM Roles for the NodeGroup", async function () {
    const componentName = "test";
    const instance = new component.NodeGroup(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.rolePolicyAttachments).toBeDefined();
    expect(instance.rolePolicyAttachments.length).toBe(3);
  });

  test("It should create the Launch Template", async function () {
    const componentName = "test";
    const instance = new component.NodeGroup(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.launchTemplate).toBeDefined();
  });

  test("It should create the Node Group with the default subnets configuration", async function () {
    const componentName = "test";
    const instance = new component.NodeGroup(
      componentName,
      minimalConfiguration,
      {}
    );
    expect(instance.nodeGroup).toBeDefined();

    const subnetIdsFromConfig = [...minimalConfiguration.subnetIds];
    const subnetIds = await GetValue(instance.nodeGroup.subnetIds);
    for (const subnetId of subnetIdsFromConfig) {
      expect(subnetIds).toContain(subnetId);
    }
  });

  test("It should create the Node Group with the default node count configuration", async function () {
    const componentName = "test";
    const instance = new component.NodeGroup(
      componentName,
      minimalConfiguration,
      {}
    );

    expect(
      await GetValue(instance.nodeGroup.nodeGroupNamePrefix)
    ).toBeDefined();
    expect(await GetValue(instance.nodeGroup.scalingConfig.desiredSize)).toBe(
      defaultNodeGroupArgs.minCount
    );
    expect(await GetValue(instance.nodeGroup.scalingConfig.maxSize)).toBe(
      defaultNodeGroupArgs.maxCount
    );
    expect(await GetValue(instance.nodeGroup.scalingConfig.minSize)).toBe(
      defaultNodeGroupArgs.minCount
    );
    expect(await GetValue(instance.nodeGroup.instanceTypes)).toStrictEqual([
      defaultNodeGroupArgs.instanceType,
    ]);
  });
});

describe("Node count", function () {
  let component: typeof import("../nodeGroup");

  beforeAll(async function () {
    component = await import("../nodeGroup");
  });

  test("It should create the Node Group with the given configuration", async function () {
    const componentName = "test";
    const instance = new component.NodeGroup(
      componentName,
      minimalConfiguration,
      {}
    );

    expect(
      await GetValue(instance.nodeGroup.nodeGroupNamePrefix)
    ).toBeDefined();
    expect(await GetValue(instance.nodeGroup.scalingConfig.desiredSize)).toBe(
      nodeCountConfiguration.minCount
    );
    expect(await GetValue(instance.nodeGroup.scalingConfig.maxSize)).toBe(
      nodeCountConfiguration.maxCount
    );
    expect(await GetValue(instance.nodeGroup.scalingConfig.minSize)).toBe(
      nodeCountConfiguration.minCount
    );
  });
});

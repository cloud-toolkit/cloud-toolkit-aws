import * as pulumi from "@pulumi/pulumi";
import minimalConfiguration from "./fixtures/cluster-minimal-configuration";
import customNetworking from "./fixtures/cluster-custom-netwokring";
import nodeGroupConfiguration from "./fixtures/cluster-node-group";

import {
  defaultNodeGroups,
  defaultPrivateApiEnabled,
  defaultPublicApiEnabled,
  defaultPublicApiWhitelist,
} from "../clusterArgs";

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
      switch(args.token) {
        case "aws:ec2/getVpc:getVpc":
          return {
            id: "vpc-1",
          };
        case "aws:ec2/getSubnets:getSubnets": {
          return {
            ids: ["sub1", "sub2", "sub3"]
          };
        }
        case "aws:ec2/getInternetGateway:getInternetGateway":
          return {
            id: "igw-1",
          };
        case "aws:ec2/getInternetGateway:getRouteTable":
          return {
            id: "rt-1",
          };
        case "aws:ec2/getInternetGateway:getRoute":
          return {
            id: "r-1",
          };
      }
      return args.inputs;
    },
  },
  "project",
  "stack",
  true
);

describe("Minimal configuration", function () {
  let component: typeof import("../cluster");
  let instance;

  beforeAll(async function () {
    component = await import("../cluster");
  });

  beforeEach(async function () {
    instance = new component.Cluster("test", {});
  });

  test("It should create the IAM Role for cluster provisioning", async function () {
    expect(instance.provisionerRole).toBeDefined();
  });

  test("It should create the IAM Role Policy for cluster provisioning", async function () {
    expect(instance.provisionerRolePolicy).toBeDefined();
  });

  test("It should create the AWS Provider for cluster provisioning", async function () {
    expect(instance.provisionerRolePolicy).toBeDefined();
  });

  test("It should create the IAM Role for the Cluster", async function () {
    expect(instance.role).toBeDefined();
  });

  test("It should create the IAM Role Policy Attachment for the Cluster", async function () {
    expect(instance.rolePolicyAttachment).toBeDefined();
    expect(await promiseOf(instance.rolePolicyAttachment.role)).toBe(
      await promiseOf(instance.role.name)
    );
  });

  test("It should create the EKS cluster", async function () {
    expect(instance.cluster).toBeDefined();
  });

  test("It should set the default values for public API", async function () {
    expect(
      await promiseOf(instance.cluster.vpcConfig)
    ).toBeDefined();
    expect(
      await promiseOf(instance.cluster.vpcConfig.endpointPublicAccess)
    ).toBe(defaultPublicApiEnabled);
    expect(
      await promiseOf(instance.cluster.vpcConfig.publicAccessCidrs)
    ).toBe(defaultPublicApiWhitelist);
  });

  test("It should set the default values for private API", async function () {
    expect(
      await promiseOf(instance.cluster.vpcConfig)
    ).toBeDefined();
    expect(
      await promiseOf(instance.cluster.vpcConfig.endpointPrivateAccess)
    ).toBe(defaultPrivateApiEnabled);
  });

  test("It should set the default values for node groups", async function () {
    expect(instance.nodeGroups.length).toBe(defaultNodeGroups.length);
  });

  test("It should create the default oidc provider", async function () {
    expect(instance.defaultOidcProvider).toBeDefined();
  });
});

describe("Node Groups", function () {
  let component: typeof import("../cluster");
  let instance;

  beforeAll(async function () {
    component = await import("../cluster");
  });

  beforeEach(async function () {
    instance = new component.Cluster(
      "custom-node-group",
      nodeGroupConfiguration
    );
  });

  test("It should create the NodeGroups defined in the custom configuration", async function () {
    expect(instance.nodeGroups.length).toBe(
      nodeGroupConfiguration.nodeGroups.length
    );
  });
});

describe("Custom network", function () {
  let component: typeof import("../cluster");
  let instance;

  beforeAll(async function () {
    component = await import("../cluster");
  });

  beforeEach(async function () {
    instance = new component.Cluster(
      "custom-network",
      customNetworking
    );
  });

  test("It should create the NodeGroups defined in the custom configuration", async function () {
    expect(instance.cluster.vpcConfig.subnetIds).toBeDefined();
    const subnetIds = await promiseOf(instance.cluster.vpcConfig.subnetIds);
    expect(subnetIds.length).toBe(6);

    const subnetIdsFromConfig = [
      ...customNetworking.privateSubnetIds,
      ...customNetworking.publicSubnetIds,
    ];
    for (const subnetId of subnetIdsFromConfig) {
      expect(subnetIds).toContain(subnetId);
    }
  });
});

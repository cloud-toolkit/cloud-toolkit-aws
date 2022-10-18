import * as pulumi from "@pulumi/pulumi";
import minimalConfiguration from "./fixtures/cluster-minimal-configuration";
import customNetworking from "./fixtures/cluster-custom-netwokring";
import nodeGroupConfiguration from "./fixtures/cluster-node-group";
import customVpcConfiguration from "./fixtures/cluster-customVpc";
import publicSubnetIdsConfiguration from "./fixtures/cluster-customPublicSubnetIds";
import privateSubnetIdsConfiguration from "./fixtures/cluster-customPrivateSubnetIds";
import customBaseDomainConfiguration from "./fixtures/cluster-customBaseDomain";

import {
  defaultNodeGroups,
  defaultPrivateApiEnabled,
  defaultPublicApiEnabled,
  defaultPublicApiWhitelist,
} from "../clusterArgs";

function promiseOf<T>(output: pulumi.Output<T>): Promise<T> {
  return new Promise(resolve => output.apply(resolve));
}

const defaultVpcId = "vpc-1"
const defaultSubnetIds = ["sub-1", "sub-2", "sub-3"];

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
            id: defaultVpcId,
          };
        case "aws:ec2/getSubnets:getSubnets": {
          return {
            ids: defaultSubnetIds,
          };
        }
        case "aws:ec2/getInternetGateway:getInternetGateway":
          return {
            id: "igw-1",
          };
        case "aws:ec2/getRouteTable:getRouteTable":
          return {
            routeTableId: `rt-1-${args.inputs.subnetId}`,
            vpcId: defaultVpcId,
          };
        case "aws:ec2/getRoute:getRoute":
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

  beforeAll(async function () {
    component = await import("../cluster");
  });

  test("It should use the default VPC", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.vpcId).toBeDefined();
    instance.vpcId.then(vpcId => {
      expect(vpcId).toBe(defaultVpcId);
    });
  });

  test("It should use the default Subnets", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.allSubnetIds).toBeDefined();
    instance.allSubnetIds.then(subnetIds => {
      for (const subnetId of subnetIds)  {
        expect(defaultSubnetIds).toContain(subnetId);
      }
    });
  });

  test("It should create the IAM Role for cluster provisioning", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.provisionerRole).toBeDefined();
  });

  test("It should create the IAM Role Policy for cluster provisioning", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.provisionerRolePolicy).toBeDefined();
  });

  test("It should create the AWS Provider for cluster provisioning", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.provisionerRolePolicy).toBeDefined();
  });

  test("It should create the IAM Role for the Cluster", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.role).toBeDefined();
  });

  test("It should create the IAM Role Policy Attachment for the Cluster", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.rolePolicyAttachment).toBeDefined();
    expect(await promiseOf(instance.rolePolicyAttachment.role)).toBe(
      await promiseOf(instance.role.name)
    );
  });

  test("It should create the EKS cluster", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.cluster).toBeDefined();
  });

  test("It should set the default values for public API", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
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
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(
      await promiseOf(instance.cluster.vpcConfig)
    ).toBeDefined();
    expect(
      await promiseOf(instance.cluster.vpcConfig.endpointPrivateAccess)
    ).toBe(defaultPrivateApiEnabled);
  });

  test("It should set the default values for node groups", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.nodeGroups.length).toBe(defaultNodeGroups.length);
  });

  test("It should create the default oidc provider", async function () {
    const instance = new component.Cluster("test", minimalConfiguration);
    expect(instance.defaultOidcProvider).toBeDefined();
  });

  //test("It should create the ClusterAddons", async function () {
  //  const instance = new component.Cluster("test", {});
  //  expect(instance.clusterAddons).toBeDefined();
  //});

});

describe("Custom Node Groups", function () {
  let component: typeof import("../cluster");
  let instance;

  beforeAll(async function () {
    component = await import("../cluster");
  });

  test("It should create the NodeGroups defined in the custom configuration", async function () {
    instance = new component.Cluster(
      "custom-node-group",
      nodeGroupConfiguration
    );
    expect(instance.nodeGroups.length).toBe(
      nodeGroupConfiguration.nodeGroups.length
    );
  });
});

describe("Custom networking", function () {
  let component: typeof import("../cluster");

  beforeAll(async function () {
    component = await import("../cluster");
  });

  test("It should use the custom VPC", async function () {
    const instance = new component.Cluster("test", customVpcConfiguration);
    expect(instance.vpcId).toBeDefined();
    instance.vpcId.then(vpcId => {
      expect(vpcId).toBe(customVpcConfiguration.vpcId);
    });
  });

  test("It should use the custom public Subnets", async function () {
    const instance = new component.Cluster("test", publicSubnetIdsConfiguration);

    expect(instance.allSubnetIds).toBeDefined();
    expect(instance.publicSubnetIds).toBeDefined();

    instance.publicSubnetIds.then(subnetIds => {
      for (const subnetId of subnetIds)  {
        expect(publicSubnetIdsConfiguration.publicSubnetIds).toContain(subnetId);
      }
    });
  });

  test("It should use the custom private Subnets", async function () {
    const privateSubnetIds = ["mysub-4", "mysub-5", "mysub-6"];
    const instance = new component.Cluster("test", privateSubnetIdsConfiguration);

    expect(instance.allSubnetIds).toBeDefined();
    expect(instance.privateSubnetIds).toBeDefined();

    instance.privateSubnetIds.then(subnetIds => {
      for (const subnetId of subnetIds)  {
        expect(privateSubnetIdsConfiguration.privateSubnetIds).toContain(subnetId);
      }
    });
  });

  test("It should use the custom private Subnets", async function () {
    const instance = new component.Cluster("test", customNetworking);

    expect(instance.privateSubnetIds).toBeDefined();
    expect(instance.publicSubnetIds).toBeDefined();

    instance.privateSubnetIds.then(subnetIds => {
      for (const subnetId of subnetIds)  {
        expect(customNetworking.privateSubnetIds).toContain(subnetId);
        expect(customNetworking.publicSubnetIds).not.toContain(subnetId);
      }
    });
    instance.publicSubnetIds.then(subnetIds => {
      for (const subnetId of subnetIds)  {
        expect(customNetworking.publicSubnetIds).toContain(subnetId);
        expect(customNetworking.privateSubnetIds).not.toContain(subnetId);
      }
    });
  });

  test("It should create the NodeGroups defined in the custom configuration", async function () {
    const instance = new component.Cluster(
      "custom-network",
      customNetworking
    );
    expect(instance.cluster.vpcConfig.subnetIds).toBeDefined();
    const subnetIds = await promiseOf<string[]>(instance.cluster.vpcConfig.subnetIds);
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

describe("Custom base domain", function () {
  let component: typeof import("../cluster");

  beforeAll(async function () {
    component = await import("../cluster");
  });

  test("It should use the default VPC", async function () {
    const instance = new component.Cluster("test", customBaseDomainConfiguration);
    expect(instance.vpcId).toBeDefined();
  });
});

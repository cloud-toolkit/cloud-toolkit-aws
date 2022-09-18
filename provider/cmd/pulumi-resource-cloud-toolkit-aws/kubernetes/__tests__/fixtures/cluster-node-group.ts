export default {
  vpcId: "vpc-1",
  privateSubnetIds: ["subnet-1", "subnet-2", "subnet-3"],
  publicSubnetIds: ["subnet-4", "subnet-5", "subnet-6"],
  nodeGroups: [
    {
      name: "wg1",
      desiredCount: 1,
      minCount: 1,
      maxCount: 5,
      maxUnavailable: 2,
      subnetIds: ["subnet-1", "subnet-2", "subnet-3"],
      instanceType: "t3.medium",
    },
  ],
};

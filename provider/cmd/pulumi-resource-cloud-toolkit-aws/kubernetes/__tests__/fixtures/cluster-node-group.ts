export default {
  addons: {
    enabled: false,
  },
  nodeGroups: [
    {
      name: "wg1",
      desiredCount: 1,
      minCount: 1,
      maxCount: 5,
      maxUnavailable: 2,
      instanceType: "t3.medium",
    },
    {
      name: "wg2",
      desiredCount: 1,
      minCount: 2,
      maxCount: 4,
      maxUnavailable: 2,
      instanceType: "t3.large",
    },
  ],
};

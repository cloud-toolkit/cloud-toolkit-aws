import * as pulumi from "@pulumi/pulumi";

export default {
  clusterVersion: "1.23",
  clusterEndpoint: pulumi.output("https://test"),
  clusterCA: pulumi.output("my-ca"),
  clusterName: pulumi.output("test"),
  name: "test-ng",
  subnetIds: ["subnet-1", "subnet-2", "subnet-3"],
  minCount: 1,
  maxCount: 3,
  maxUnavailable: 1,
};

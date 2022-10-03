import * as pulumi from "@pulumi/pulumi";

import {
  Cluster,
} from "@cloud-toolkit/cloud-toolkit-aws/kubernetes";

const config = new pulumi.Config();

// Get config
const clusterName = config.require("cluster-name");

// Create Kubernetes Cluster
const cluster = new Cluster(clusterName, {});

export const kubeconfig = cluster.kubeconfig;

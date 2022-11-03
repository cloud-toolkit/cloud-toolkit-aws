import * as ct from "@cloud-toolkit/cloud-toolkit-aws";

const example = new ct.kubernetes.Cluster("component-test", {baseDomain: "astrokube.es"});

export const kubeconfig = example.kubeconfig

import * as ct from "@cloudtoolkit/aws";

const component_testing = new ct.kubernetes.Cluster("component-testing", {});

export const kubeconfig = component_testing.kubeconfig

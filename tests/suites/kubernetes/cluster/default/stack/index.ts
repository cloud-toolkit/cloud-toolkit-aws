import * as pulumi from "@pulumi/pulumi";
import * as ct from "@cloudtoolkit/aws";

const name = pulumi.getStack();
const component = new ct.kubernetes.Cluster(name);
export const kubeconfig = component.kubeconfig;

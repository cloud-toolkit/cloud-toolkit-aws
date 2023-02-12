import * as pulumi from "@pulumi/pulumi";
import * as ct from "@cloudtoolkit/aws";

const name = pulumi.getStack();
const component = new ct.kubernetes.Cluster(name, {
  networking: {
    admin: {
      domain: `${name}-admin.cloudtoolkit.io`,
    },
    default: {
      domain: `${name}-default.cloudtoolkit.io`,
    },
  },
});
export const kubeconfig = component.kubeconfig;

import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import {
  ClusterAdminsArgs,
} from "./clusterAdminsArgs";

export { ClusterAdminsArgs };

/**
 * ClusterAdmins is a component that create the resources in the Cluster for a set of AWS IAM Users and Roles, managing the access with the integration with AWS IAM.
 */
export class ClusterAdmins extends pulumi.ComponentResource {
  private args: ClusterAdminsArgs;

  private name: string;

  /**
   * The Kubernetes provider used to provision Kubernetes resources.
   */
  public readonly provider: kubernetes.Provider;

  /**
   * The Kubernetes ClusterRoleBinding to associate the ClusterRole to the project.
   */
  public readonly clusterRoleBinding: kubernetes.rbac.v1.ClusterRoleBinding;

  constructor(
    name: string,
    args: ClusterAdminsArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:ClusterAdmins", name, args, opts);
    this.name = name;
    this.args = args;

    this.provider = new kubernetes.Provider(this.name, {
      kubeconfig: this.args.kubeconfig,
    });

    const k8sOpts = pulumi.mergeOptions(opts, {
      parent: this,
      provider: this.provider,
    });

    this.clusterRoleBinding = this.setupClusterRoleBinding(k8sOpts);

    this.registerOutputs({
      clusterRoleBinding: this.clusterRoleBinding,
      name: this.args.name,
      provider: this.provider,
    });
  }

  private setupClusterRoleBinding(opts: pulumi.ResourceOptions): kubernetes.rbac.v1.ClusterRoleBinding {
    const subjects = [];
    for (const user of this.args.userArns || []) {
      subjects.push({
        kind: "User",
        name: user,
        apiGroup: "rbac.authorization.k8s.io",
      });
    }

    return new kubernetes.rbac.v1.ClusterRoleBinding(this.name, {
      metadata: {
        name: this.args.name,
      },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: "cluster-admin",
      },
      subjects: subjects,
    }, opts);
  }


}

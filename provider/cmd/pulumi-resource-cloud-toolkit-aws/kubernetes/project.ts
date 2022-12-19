import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import {
  ProjectArgs,
  defaultProjectArgs,
} from "./projectArgs";

export { ProjectArgs };

/**
 * Project is a component that create the resources in the Cluster for a set of AWS IAM Users and Roles, managing the access with the integration with AWS IAM.
 */
export class Project extends pulumi.ComponentResource {
  private args: ProjectArgs;

  private name: string;

  /**
   * The Kubernetes provider used to provision Kubernetes resources.
   */
  public readonly provider: kubernetes.Provider;

  /**
   * The Namespace used by the project.
   */
  public readonly namespace: kubernetes.core.v1.Namespace;

  /**
   * ResourceQuota for the provisioned Namespace.
   */
  public readonly resourceQuota: kubernetes.core.v1.ResourceQuota;

  /**
   * The Kubernetes ClusterRole used to grant minimal access to the cluster.
   */
  public readonly clusterRole: kubernetes.rbac.v1.ClusterRole;

  /**
   * The Kubernetes ClusterRoleBinding to associate the ClusterRole to the project.
   */
  public readonly clusterRoleBinding: kubernetes.rbac.v1.ClusterRoleBinding;

  /**
   * The Kubernetes RoleBinding for admin users.
   */
  public readonly adminRoleBinding: kubernetes.rbac.v1.RoleBinding;

  /**
   * The Kubernetes RoleBinding for edit users.
   */
  public readonly editRoleBinding: kubernetes.rbac.v1.RoleBinding;

  /**
   * The Kubernetes RoleBinding for view users.
   */
  public readonly viewRoleBinding: kubernetes.rbac.v1.RoleBinding;

  constructor(
    name: string,
    args: ProjectArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:Project", name, args, opts);
    this.name = name;
    this.args = this.validateArgs(args);

    this.provider = new kubernetes.Provider(this.name, {
      kubeconfig: this.args.kubeconfig,
    });

    const namespaceOpts = pulumi.mergeOptions(opts, {
      parent: this,
      provider: this.provider,
    });
    this.namespace = this.setupNamespace(namespaceOpts);

    const k8sOpts = pulumi.mergeOptions(opts, {
      parent: this,
      provider: this.provider,
      dependsOn: [this.namespace],
    });

    this.resourceQuota = this.setupResourceQuota(k8sOpts);
    this.clusterRole = this.setupClusterRole(k8sOpts);
    this.clusterRoleBinding = this.setupClusterRoleBinding(k8sOpts);
    this.adminRoleBinding = this.setupRoleBinding(this.args.adminUserArns || [], "admin", k8sOpts);
    this.editRoleBinding = this.setupRoleBinding(this.args.editUserArns || [], "edit", k8sOpts);
    this.viewRoleBinding = this.setupRoleBinding(this.args.viewUserArns || [], "view", k8sOpts);

    this.registerOutputs({
      adminRoleBinding: this.adminRoleBinding,
      clusterRole: this.clusterRole,
      clusterRoleBinding: this.clusterRoleBinding,
      editRoleBinding: this.editRoleBinding,
      namespace: this.namespace,
      resourceQuota: this.resourceQuota,
      viewRoleBinding: this.viewRoleBinding,
    });
  }

  private validateArgs(a: ProjectArgs): ProjectArgs {
    const args = defaultsDeep({ ...a }, defaultProjectArgs);
    return args;
  }

  private setupNamespace(opts: pulumi.ResourceOptions): kubernetes.core.v1.Namespace {
    return new kubernetes.core.v1.Namespace(this.name, {
      metadata: {
        name: this.args.namespace,
      }
    }, opts);
  }

  private setupClusterRole(opts: pulumi.ResourceOptions): kubernetes.rbac.v1.ClusterRole {
    return new kubernetes.rbac.v1.ClusterRole(this.name, {
      metadata: {
        name: this.args.name,
        namespace: this.args.namespace,
      },
      rules: [{
        apiGroups: [""],
        resources:["namespaces", "nodes"],
        verbs: ["get", "list", "watch"],
    }],
    }, opts);
  }
 
  private setupClusterRoleBinding(opts: pulumi.ResourceOptions): kubernetes.rbac.v1.ClusterRoleBinding {
    const subjects = [];
    for (const user of this.args.adminUserArns || []) {
      subjects.push({
        kind: "User",
        name: user,
        apiGroup: "rbac.authorization.k8s.io",
        namespace: this.namespace.metadata.name,
      });
    }
    for (const user of this.args.editUserArns || []) {
      subjects.push({
        kind: "User",
        name: user,
        apiGroup: "rbac.authorization.k8s.io",
        namespace: this.namespace.metadata.name,
      });
    }
    for (const user of this.args.viewUserArns || []) {
      subjects.push({
        kind: "User",
        name: user,
        apiGroup: "rbac.authorization.k8s.io",
        namespace: this.namespace.metadata.name,
      });
    }

    return new kubernetes.rbac.v1.ClusterRoleBinding(this.name, {
      metadata: {
        name: this.args.name,
        namespace: this.args.namespace,
      },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: this.clusterRole.metadata.name,
      },
      subjects: subjects,
    }, opts);
  }

  private setupRoleBinding(users: pulumi.Input<string>[], clusterRole: string, opts: pulumi.ResourceOptions): kubernetes.rbac.v1.RoleBinding {
    const subjects = [];
    for (const user of users) {
      subjects.push({
        kind: "User",
        name: user,
        apiGroup: "rbac.authorization.k8s.io",
        namespace: this.namespace.metadata.name,
      });
    }

    return new kubernetes.rbac.v1.RoleBinding(`${this.name}-${clusterRole}`, {
      metadata: {
        name: clusterRole,
        namespace: this.args.namespace,
      },
      roleRef: {
        apiGroup: "rbac.authorization.k8s.io",
        kind: "ClusterRole",
        name: clusterRole,
      },
      subjects: subjects,
    }, opts);
  }

  private setupResourceQuota(opts: pulumi.ResourceOptions): kubernetes.core.v1.ResourceQuota {
    const hard: {[key: string]: pulumi.Input<string>} = {};

    if (this.args.resources?.cpu !== undefined) {
      hard["requests.cpu"] = this.args.resources.cpu;
    }

    if (this.args.resources?.memory !== undefined) {
      hard["requests.memory"] = this.args.resources.memory;
    }

    if (this.args.resources?.limitCpu !== undefined) {
      hard["limits.cpu"] = this.args.resources.limitCpu;
    }

    if (this.args.resources?.limitMemory !== undefined) {
      hard["limits.memory"] = this.args.resources.limitMemory;
    }

    return new kubernetes.core.v1.ResourceQuota(this.name, {
      metadata: {
        name: "default",
        namespace: this.namespace.metadata.name,
        annotations: {
          "pulumi.com/skipAwait": "true",
        },
      },
      spec: {
        hard: hard,
      }
    }, opts);
  }
}

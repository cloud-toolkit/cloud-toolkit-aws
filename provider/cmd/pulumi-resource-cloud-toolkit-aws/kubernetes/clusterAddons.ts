import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import * as tls from "@pulumi/tls";
import defaultsDeep from "lodash.defaultsdeep";
import { ArgoCD } from "./argocd";
import {
  ClusterAddonsArgs,
  defaultClusterAddonsArgs,
} from "./clusterAddonsArgs";

export { ClusterAddonsArgs };

/**
 * ClusterAddons is a component that manages the Lubernetes addons to setup a production-ready cluster.
 */
export class ClusterAddons extends pulumi.ComponentResource {
  private args: ClusterAddonsArgs;
  private name: string;

  public readonly argocd: ArgoCD;

  constructor(
    name: string,
    args: ClusterAddonsArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:ClusterAddons", name, args, opts);
    this.name = name;
    this.args = this.validateArgs(args);

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });
    this.argocd = this.setupArgoCD(resourceOpts);
  }

  private validateArgs(a: ClusterAddonsArgs): ClusterAddonsArgs {
    const args = defaultsDeep({ ...a }, defaultClusterAddonsArgs);

    return args;
  }

  private setupArgoCD(opts?: pulumi.ResourceOptions): ArgoCD {
    return new ArgoCD(this.name, {
      name: "argocd",
      namespace: "system-argocd",
      k8sProvider: this.args.k8sProvider,
    }, opts);
  }
}

import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddonArgs } from "./applicationAddonArgs";

/**
 * IRSAAddon is a component that deploy an HelmChart as ArgoCD Application.
 */
export abstract class ApplicationAddon<T extends ApplicationAddonArgs
> extends pulumi.ComponentResource {
  protected readonly args: T;
  protected name: string;

  constructor(
    addonId: string,
    name: string,
    args: T,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super(addonId, name, args, opts);
    this.args = args;
    this.name = name;
  }

  protected abstract getApplicationSpec(): any;

  protected abstract validateArgs(a: T): T;

  protected _validateArgs(a: T): T {
    const args = defaultsDeep({ ...a }, { createNamespace: true });
    return this.validateArgs(args);
  }

  protected setupNamespace(
    opt?: pulumi.CustomResourceOptions
  ): k8s.core.v1.Namespace | undefined {
    if (this.args.createNamespace) {
      return new k8s.core.v1.Namespace(
        `${this.name}-${this.args.namespace}`,
        {
          metadata: {
            name: this.args.namespace,
          },
        },
        {
          ...opt,
          provider: this.args.k8sProvider,
        }
      );
    }

    return;
  }

  /**
   * Deploy Helm Chart with ArgoCD Application
   */
  protected  setupApplication(
    opt?: pulumi.CustomResourceOptions
  ): k8s.apiextensions.CustomResource {
    return new k8s.apiextensions.CustomResource(
      this.name,
      {
        apiVersion: "argoproj.io/v1alpha1",
        kind: "Application",
        metadata: {
          name: this.name,
          namespace: "system-argocd",
        },
        spec: this.getApplicationSpec(),
      },
      pulumi.mergeOptions(opt, {
        provider: this.args.k8sProvider,
      })
    );
  }
}

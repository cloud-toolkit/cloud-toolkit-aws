import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";
import { AdotOperatorArgs, AdotOperatorDefaultArgs } from "./adotOperatorArgs"

export class AdotOperator extends ApplicationAddon<AdotOperatorArgs> {
  public readonly namespace?: kubernetes.core.v1.Namespace;

  public readonly application: kubernetes.apiextensions.CustomResource;

  constructor(
    name: string,
    args: AdotOperatorArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super(
      "cloud-toolkit-aws:kubernetes:AdotOperator",
      name,
      args,
      opts
    );

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });
    this.namespace = this.setupNamespace(resourceOpts);
    this.application = this.setupApplication(resourceOpts);
  }

  protected validateArgs(
    a: AdotOperatorArgs
  ): AdotOperatorArgs {
    return defaultsDeep({ ...a }, AdotOperatorDefaultArgs);
  }

  getApplicationSpec(): any {
    return {
      project: "default",
      source: {
        repoURL: "https://open-telemetry.github.io/opentelemetry-helm-charts",
        chart: "opentelemetry-operator",
        targetRevision: "0.17.0",
        helm: {
          releaseName: "opentelemetry-operator",
        },
      },
      destination: {
        server: "https://kubernetes.default.svc",
        namespace: this.namespace?.metadata.name || this.args.namespace,
      },
      syncPolicy: {
        automated: {
          prune: true,
          selfHeal: true,
          allowEmpty: false,
        },
        retry: {
          limit: 10,
          backoff: {
            duration: "5s",
            factor: 2,
            maxDuration: "1m",
          },
        },
        syncOptions: [
          "Validate=false",
          "PrunePropagationPolicy=foreground",
          "PruneLast=true",
        ],
      },
    };
  }
}

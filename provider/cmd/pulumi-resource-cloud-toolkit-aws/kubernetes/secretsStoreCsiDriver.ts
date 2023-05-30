import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import { ApplicationAddon } from "./applicationAddon";
import { SecretsStoreCsiDriverArgs } from "./secretsStoreCsiDriverArgs";

export { SecretsStoreCsiDriverArgs };

export class SecretsStoreCsiDriver extends ApplicationAddon<SecretsStoreCsiDriverArgs> {
  public readonly namespace?: kubernetes.core.v1.Namespace;

  public readonly application: kubernetes.apiextensions.CustomResource;

  constructor(
    name: string,
    args: SecretsStoreCsiDriverArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:SecretsStoreCsiDriver", name, args, opts);

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    this.namespace = this.setupNamespace(resourceOpts);

    this.application = this.setupApplication(resourceOpts);

    this.registerOutputs({
      chart: this.application,
      namespace: this.namespace,
    });
  }

  protected validateArgs(a: SecretsStoreCsiDriverArgs): SecretsStoreCsiDriverArgs {
    return a;
  }

  protected getApplicationSpec(): any {
    return {
      project: "default",
      source: {
        repoURL: "https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts",
        chart: "secrets-store-csi-driver",
        targetRevision: "v1.3.0",
        helm: {
          releaseName: this.args.name,
          parameters: [
            {
              name: "syncSecret.enabled",
              value: this.args.syncSecretEnabled,
            },
          ],
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

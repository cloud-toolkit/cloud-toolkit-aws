import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import { ApplicationAddon } from "./applicationAddon";
import { AwsSecretsStoreCsiDriverArgs } from "./awsSecretsStoreCsiDriverArgs";

export { AwsSecretsStoreCsiDriverArgs };

export class AwsSecretsStoreCsiDriver extends ApplicationAddon<AwsSecretsStoreCsiDriverArgs> {
  public readonly namespace?: kubernetes.core.v1.Namespace;

  public readonly application: kubernetes.apiextensions.CustomResource;

  constructor(
    name: string,
    args: AwsSecretsStoreCsiDriverArgs,
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

  protected validateArgs(a: AwsSecretsStoreCsiDriverArgs): AwsSecretsStoreCsiDriverArgs {
    return a;
  }

  protected getApplicationSpec(): any {
    return {
      project: "default",
      source: {
        repoURL: "https://aws.github.io/secrets-store-csi-driver-provider-aws",
        chart: "secrets-store-csi-driver-provider-aws",
        targetRevision: "0.3.2",
        helm: {
          releaseName: this.args.name,
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

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import { ApplicationAddon } from "./applicationAddon";
import { ExternalDnsArgs } from "./externalDnsArgs";
import { Irsa } from "./irsa";

export { ExternalDnsArgs };

/**
 * ExternalDns is a component to manage DNS records according to the Ingresses created in the cluster.
 */
export class ExternalDns extends ApplicationAddon<ExternalDnsArgs> {
  /**
   * The Namespace used to deploy the component.
   */
  public readonly namespace?: kubernetes.core.v1.Namespace;

  /**
   * The Namespace used to deploy the component.
   */
  public readonly application: kubernetes.apiextensions.CustomResource;

  /**
   * The IAM roles for service accounts.
   */
  public readonly irsa: Irsa;

  constructor(
    name: string,
    args: ExternalDnsArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:ExternalDns", name, args, opts);

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    this.namespace = this.setupNamespace(resourceOpts);
    this.irsa = this.setupIrsa(resourceOpts);
    this.application = this.setupApplication(resourceOpts);

    this.registerOutputs({
      chart: this.application,
      irsa: this.irsa,
      namespace: this.namespace,
    });
  }

  protected validateArgs(a: ExternalDnsArgs): ExternalDnsArgs {
    return a;
  }

  private setupIrsa(opts?: pulumi.ResourceOptions): Irsa {
    return new Irsa(this.name, {
      identityProvidersArn: [...this.args.identityProvidersArn],
      issuerUrl: this.args.issuerUrl,
      k8sProvider: this.args.k8sProvider,
      namespace: this.args.namespace,
      serviceAccountName: this.args.serviceAccountName,
      policies: [this.getIAMPolicy()],
    }, opts);
  }

  protected getIAMPolicy(): pulumi.Output<string> {
    const policyObject = <aws.iam.GetPolicyDocumentOutputArgs>{
      statements: [
        {
          effect: "Allow",
          resources: ["*"],
          actions: [
            "route53:ListHostedZones",
            "route53:ListresourceRecordSets",
          ],
        },
        {
          effect: "Allow",
          resources: this.args.zoneArns,
          actions: ["route53:ChangeresourceRecordSets"],
        },
      ],
    };

    const policyDocument = aws.iam.getPolicyDocumentOutput(policyObject);
    return policyDocument.json;
  }

  protected getApplicationSpec(): any {
    const region = aws.getRegionOutput();
    return {
      project: "default",
      source: {
        repoURL: "https://charts.bitnami.com/bitnami",
        chart: "external-dns",
        targetRevision: "6.5.6",
        helm: {
          releaseName: this.args.name,
          parameters: [
            {
              name: "aws.region",
              value: region.name,
            },
            {
              name: "serviceAccount.create",
              value: "false",
            },
            {
              name: "serviceAccount.name",
              value: this.irsa.serviceAccount.metadata.name,
            },
          ],
        },
      },
      destination: {
        server: "https://kubernetes.default.svc",
        namespace: this.args.namespace,
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

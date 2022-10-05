import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";
import { ApplicationAddon } from "./applicationAddon";
import { CertManagerArgs } from "./certManagerArgs";
import { Irsa } from "./irsa";

export class CertManager extends ApplicationAddon<CertManagerArgs> {
  public readonly namespace?: kubernetes.core.v1.Namespace;

  public readonly application: kubernetes.apiextensions.CustomResource;

  public readonly irsa: Irsa;

  constructor(
    name: string,
    args: CertManagerArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super("cloudToolkit:aws:kubernetes:CertManager", name, args, opts);

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    this.namespace = this.setupNamespace(resourceOpts);
    this.irsa = this.setupIrsa(resourceOpts);
    this.application = this.setupApplication(resourceOpts);
  }

  protected validateArgs(a: CertManagerArgs): CertManagerArgs {
    return a;
  }

  private setupIrsa(opts?: pulumi.ResourceOptions): Irsa {
    return new Irsa(`${this.name}-cert-manager`, {
      identityProvidersArn: [...this.args.identityProvidersArn],
      issuerUrl: this.args.issuerUrl,
      k8sProvider: this.args.k8sProvider,
      namespace: this.args.namespace,
      serviceAccountName: this.args.serviceAccountName,
      policies: [this.getIAMPolicy()],
    }, opts);
  }

  protected getIAMPolicy(): pulumi.Output<string> {
    const policyObject = {
      statements: [
        {
          effect: "Allow",
          resources: ["arn:aws:route53:::change/*"],
          actions: ["route53:GetChange"],
        },
        {
          effect: "Allow",
          resources: ["*"],
          actions: ["route53:ListHostedZonesByName"],
        },
      ],
    };

    for (const zoneArn of this.args.zoneArns) {
      policyObject.statements.push({
        effect: "Allow",
        resources: [zoneArn as string],
        actions: [
          "route53:ChangeresourceRecordSets",
          "route53:ListresourceRecordSets",
        ],
      });
    }

    const policyDocument = aws.iam.getPolicyDocumentOutput(policyObject);
    return policyDocument.json;
  }

  protected getApplicationSpec(): any {
    return {
      project: "default",
      source: {
        repoURL: "https://charts.jetstack.io",
        chart: "cert-manager",
        targetRevision: "v1.7.1",
        helm: {
          releaseName: this.args.name,
          parameters: [
            {
              name: "extraArgs[0]",
              value: "--enable-certificate-owner-ref=true",
            },
            {
              name: "installCRDs",
              value: "true",
            },
            {
              name: "serviceAccount.create",
              value: "false",
            },
            {
              name: "serviceAccount.name",
              value: this.irsa.name,
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

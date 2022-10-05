import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import * as tls from "@pulumi/tls";
import defaultsDeep from "lodash.defaultsdeep";
import { ArgoCD } from "./argocd";
import { IngressNginx } from "./ingressNginx";
import { CertManager } from "./certManager";
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
  public readonly certManager: CertManager;
  public readonly adminIngressNginx: IngressNginx;

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

    // Create ResourceOptions for Applications
    const argocdApplicationsOpts = pulumi.mergeOptions(opts, {
      parent: this,
      dependsOn: [
        this.argocd.chart.getResource(
          "apps/v1/Deployment",
          "system-argocd/kluster1-argocd-server"
        ),
        this.argocd.chart.getResource(
          "apiextensions.k8s.io/v1/CustomResourceDefinition",
          "argocdextensions.argoproj.io"
        ),
      ],
    });
    this.certManager = this.setupCertManager(argocdApplicationsOpts);

    const ingressOpts = pulumi.mergeOptions(argocdApplicationsOpts, {
      dependsOn: [this.certManager],
    });
    this.adminIngressNginx = this.setupAdminIngressNginx(ingressOpts);
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
      hostname: `argocd.${this.args.domain}`,
    }, opts);
  }

  private setupCertManager(opts?: pulumi.ResourceOptions): CertManager {
    return new CertManager(`${this.name}-cert-manager`, {
      name: "cert-manager",
      namespace: "system-cert-manager",
      createNamespace: true,
      k8sProvider: this.args.k8sProvider,
      identityProvidersArn: [...this.args.identityProvidersArn],
      serviceAccountName: "cert-manager",
      issuerUrl: this.args.issuerUrl,
      zoneArns: this.args.zoneArns,
    }, opts);
  }

  private setupAdminIngressNginx(opts?: pulumi.ResourceOptions): IngressNginx {
    return new IngressNginx(`${this.name}-ingress-nginx-admin`, {
      createNamespace: true,
      name: "ingress-admin",
      namespace: "system-ingress",
      k8sProvider: this.args.k8sProvider,
      className: "admin",
      public: true,
    }, opts);
  }
}

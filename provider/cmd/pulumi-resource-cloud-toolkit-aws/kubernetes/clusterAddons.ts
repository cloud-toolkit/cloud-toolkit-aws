import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import * as tls from "@pulumi/tls";
import defaultsDeep from "lodash.defaultsdeep";
import { ArgoCD } from "./argocd";
import { IngressNginx } from "./ingressNginx";
import { CertManager } from "./certManager";
import { ExternalDns } from "./externalDns";
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

  /**
   * The ArgoCD addon.
   */
  public readonly argocd: ArgoCD;

  /**
   * The CertManager addon.
   */
  public readonly certManager: CertManager;

  /**
   * The IngressNginx addon used for admin access.
   */
  public readonly adminIngressNginx: IngressNginx;

  /**
   * The ExternalDns addon.
   */
  public readonly externalDns: ExternalDns;

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
    this.externalDns = this.setupExternalDns(argocdApplicationsOpts);

    const ingressOpts = pulumi.mergeOptions(argocdApplicationsOpts, {
      dependsOn: [this.certManager],
    });
    this.adminIngressNginx = this.setupAdminIngressNginx(ingressOpts);

    this.registerOutputs({
      argocd: this.argocd,
      certManager: this.certManager,
      externalDns: this.externalDns,
      adminIngressNginx: this.adminIngressNginx,
    });
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

  private setupExternalDns(opts?: pulumi.ResourceOptions): ExternalDns {
    return new ExternalDns(`${this.name}-external-dns`, {
      name: "external-dns",
      namespace: "system-external-dns",
      createNamespace: true,
      k8sProvider: this.args.k8sProvider,
      identityProvidersArn: [...this.args.identityProvidersArn],
      serviceAccountName: "external-dns",
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

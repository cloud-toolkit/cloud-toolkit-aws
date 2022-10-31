import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import * as tls from "@pulumi/tls";
import defaultsDeep from "lodash.defaultsdeep";
import { ArgoCD } from "./argocd";
import { IngressNginx } from "./ingressNginx";
import { CertManager } from "./certManager";
import { ExternalDns } from "./externalDns";
import { Dashboard } from "./dashboard";
import { Calico } from "./calico";
import { AwsEbsCsiDriver } from "./ebsCsiDriver"
import { ClusterAutoscaler } from "./clusterAutoscaler"
import { AwsLoadBalancerController } from "./awsLoadBalancerController";

import {
  ClusterAddonsArgs,
  defaultClusterAddonsArgs,
} from "./clusterAddonsArgs";
import { AdotApplication } from "./adotApplication";
import { AdotOperator } from "./adotOperator";

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
  /**
   * The Kubernetes dashboard addon.
   */
  public readonly dashboard: Dashboard;

  /**
   * The Calico addon used to manage network policies.
   */
     public readonly calico: Calico;

     /**
      * The EBS CSI driver that allows to create volumes using the block storage service of AWS.
      */
     public readonly ebsCsiDriver: AwsEbsCsiDriver;

  /**
   * The Kubernetes ClusterAutoscaler addon.
   */
  public readonly clusterAutoscaler: ClusterAutoscaler;

  /**
   * The AWS LoadBalancer Controller.
   */
  public readonly awsLoadBalancerController: AwsLoadBalancerController;

  /**
   * The OpenTelemetry (ADOT) application that sends logs to CloudWatch.
   */
  public readonly adotApplication: AdotApplication

  /**
   * The OpenTelemetry (ADOT) operator that sends logs to CloudWatch.
   */
  public readonly adotOperator: AdotOperator

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
    this.awsLoadBalancerController = this.setupAwsLoadBalancerController(argocdApplicationsOpts);

    const ingressOpts = pulumi.mergeOptions(argocdApplicationsOpts, {
      dependsOn: [
        this.certManager,
        this.awsLoadBalancerController,
      ],
    });
    this.adminIngressNginx = this.setupAdminIngressNginx(ingressOpts);

    this.dashboard = this.setupDashboard(argocdApplicationsOpts)
    this.calico = this.setupCalico(argocdApplicationsOpts);
    this.ebsCsiDriver = this.setupAwsEbsCsiDriver(argocdApplicationsOpts)
    this.clusterAutoscaler = this.setupClusterAutoscaler(argocdApplicationsOpts);

    this.adotOperator = this.setupAdotOperator(argocdApplicationsOpts);

    const adotApplicationOpts = pulumi.mergeOptions(opts, {
      parent: this,
      dependsOn: [this.adotOperator],
    });
    this.adotApplication = this.setupAdotApplication(adotApplicationOpts);


    this.registerOutputs({
      argocd: this.argocd,
      certManager: this.certManager,
      externalDns: this.externalDns,
      adminIngressNginx: this.adminIngressNginx,
      dashboard: this.dashboard,
      calico: this.calico,
      ebsCsiDriver: this.ebsCsiDriver,
      clusterAutoscaler: this.clusterAutoscaler
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
      tls: {
        enabled: this.args.ingress?.admin?.enableTlsTermination,
        domain: this.args.domain,
        zoneId: this.args.zoneId,
      },
    }, opts);
  }

  private setupDashboard(
    opts?: pulumi.ResourceOptions
  ): Dashboard {
    return new Dashboard(
      `${this.name}-dashboard`,
      {
        createNamespace: true,
        name: "dashboard",
        namespace: "system-dashboard",
        k8sProvider: this.args.k8sProvider,
        hostname: `dashboard.${this.args.domain}`,
      },
      opts
    );
  }

  private setupCalico(opts?: pulumi.ResourceOptions): Calico {
    return new Calico(
      `${this.name}-calico`,
      {
        name: "calico",
        namespace: "system-calico",
        k8sProvider: this.args.k8sProvider,
        createNamespace: true
      },
      opts
    );
  }

  private setupAwsEbsCsiDriver(
    opts?: pulumi.ResourceOptions
  ): AwsEbsCsiDriver {
    return new AwsEbsCsiDriver(
      `${this.name}-aws-ebs-csi-driver`,
      {
        name: "aws-ebs-csi-driver",
        namespace: "kube-system",
        serviceAccountName: "ebs-csi-driver",
        k8sProvider: this.args.k8sProvider,
        createNamespace: false,
        identityProvidersArn: this.args.identityProvidersArn,
        issuerUrl: this.args.issuerUrl,
      },
      opts
    );
  }

  private setupClusterAutoscaler(opts?: pulumi.ResourceOptions): ClusterAutoscaler {
    return new ClusterAutoscaler(`${this.name}-cluster-autoscaler`, {
      name: "cluster-autoscaler",
      namespace: "system-cluster-autoscaler",
      createNamespace: true,
      k8sProvider: this.args.k8sProvider,
      identityProvidersArn: [...this.args.identityProvidersArn],
      serviceAccountName: "cluster-autoscaler",
      issuerUrl: this.args.issuerUrl,
      clusterName: this.args.clusterName
    }, opts);
  }

  private setupAwsLoadBalancerController(
    opts?: pulumi.ResourceOptions
  ): AwsLoadBalancerController {
    return new AwsLoadBalancerController(
      `${this.name}-aws-lb-controller`,
      {
        name: "aws-lb-controller",
        namespace: "kube-system",
        serviceAccountName: "aws-lb-controller",
        k8sProvider: this.args.k8sProvider,
        createNamespace: false,
        identityProvidersArn: this.args.identityProvidersArn,
        issuerUrl: this.args.issuerUrl,
        clusterName: this.args.clusterName,
      },
      opts
    );
  }

  private setupAdotApplication(
    opts?: pulumi.ResourceOptions
  ): AdotApplication {
    const region = pulumi.output(aws.getRegion());
    return new AdotApplication(
      `${this.name}-adot`,
      {
        name: "adotApplication",
        namespace: "system-observability",
        k8sProvider: this.args.k8sProvider,
        identityProvidersArn: [...this.args.identityProvidersArn],
        serviceAccountName: "adot-applications",
        issuerUrl: this.args.issuerUrl,
        logging: this.args.observability?.logging,
        metrics: this.args.observability?.metrics,
        awsRegion: region.name,
        clusterName: this.args.clusterName,
      },
      opts
    );
  }

  private setupAdotOperator(
    opts?: pulumi.ResourceOptions
  ): AdotOperator {
    const region = pulumi.output(aws.getRegion());
    return new AdotOperator(
      `${this.name}-adot`,
      {
        name: "adotApplication",
        namespace: "system-observability",
        createNamespace: true,
        k8sProvider: this.args.k8sProvider,
        identityProvidersArn: [...this.args.identityProvidersArn],
        serviceAccountName: "adot-applications",
        issuerUrl: this.args.issuerUrl,
        logging: this.args.observability?.logging,
        metrics: this.args.observability?.metrics,
        awsRegion: region.name,
        clusterName: this.args.clusterName,
      },
      opts
    );
  }
}

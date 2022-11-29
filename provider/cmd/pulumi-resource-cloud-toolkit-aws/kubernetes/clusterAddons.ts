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
  public readonly adminIngressNginx?: IngressNginx;

  /**
   * The IngressNginx addon used for default access.
   */
  public readonly defaultIngressNginx?: IngressNginx;

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
   * Route53 Zone arn used for admin IngressController.
   */
  public readonly adminZoneArn?: pulumi.Input<string>;

  /**
   * Route53 Zone id used for admin IngressController.
   */
  public readonly adminZoneId?: pulumi.Input<string>;

  /**
   * Route53 Zone arn used for default IngressController.
   */
  public readonly defaultZoneArn?: pulumi.Input<string>;

  /**
   * Route53 Zone id used for default IngressController.
   */
  public readonly defaultZoneId?: pulumi.Input<string>;

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

    // DNS Zone
    if (this.args.ingress?.admin?.domain !== undefined) {
      const zoneData = this.getZoneData(this.args.ingress.admin.domain);
      this.adminZoneArn = zoneData.then(zone => zone.arn);
      this.adminZoneId = zoneData.then(zone => zone.id);
    }
    if (this.args.ingress?.default?.domain !== undefined) {
      const zoneData = this.getZoneData(this.args.ingress.default.domain);
      this.defaultZoneArn = zoneData.then(zone => zone.arn);
      this.defaultZoneId = zoneData.then(zone => zone.id);
    }

    const argocdResourcesOpts = pulumi.mergeOptions(opts, {
      parent: this,
      dependsOn: [this.argocd],
      provider: this.args.k8sProvider,
    });
    const argocdDeployment = kubernetes.apps.v1.Deployment.get(
      "argocd-deployment",
      pulumi.interpolate`${this.argocd.chart.namespace}/${this.argocd.chart.status.name}-server`,
      argocdResourcesOpts
    );

    // Create ResourceOptions for Applications
    const argocdApplicationsOpts = pulumi.mergeOptions(opts, {
      parent: this,
      dependsOn: [
        argocdDeployment,
      ],
    });
    this.certManager = this.setupCertManager(argocdApplicationsOpts);
    this.externalDns = this.setupExternalDns(argocdApplicationsOpts);
    this.awsLoadBalancerController = this.setupAwsLoadBalancerController(argocdApplicationsOpts);

    if (this.args.ingress?.admin?.domain !== undefined) {
      const ingressOpts = pulumi.mergeOptions(argocdApplicationsOpts, {
        dependsOn: [
          this.certManager,
          this.awsLoadBalancerController,
        ],
      });
      this.adminIngressNginx = this.setupAdminIngressNginx(ingressOpts);
    }

    if (this.args.ingress?.default?.domain !== undefined) {
      const defaultIngressOpts = pulumi.mergeOptions(argocdApplicationsOpts, {
        dependsOn: [
          this.certManager,
          this.awsLoadBalancerController,
        ],
      });
      this.defaultIngressNginx = this.setupDefaultIngressNginx(defaultIngressOpts);
    }

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
      adminIngressNginx: this.adminIngressNginx,
      adotApplication: this.adotApplication,
      adotOperator: this.adotOperator,
      argocd: this.argocd,
      awsLoadBalancerController: this.awsLoadBalancerController,
      calico: this.calico,
      certManager: this.certManager,
      clusterAutoscaler: this.clusterAutoscaler,
      dashboard: this.dashboard,
      defaultIngressNginx: this.defaultIngressNginx,
      ebsCsiDriver: this.ebsCsiDriver,
      externalDns: this.externalDns,
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
      hostname: this.args.ingress?.admin?.domain !== undefined ? `argocd.${this.args.ingress?.admin?.domain}` : undefined,
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
      zoneArns: this.getAllZoneArns(),
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
      zoneArns: this.getAllZoneArns(),
    }, opts);
  }


  private setupAdminIngressNginx(opts?: pulumi.ResourceOptions): IngressNginx | undefined {
    if (this.args.ingress?.admin?.domain !== undefined) {
      return new IngressNginx(`${this.name}-ingress-nginx-admin`, {
        createNamespace: true,
        name: "ingress-admin",
        namespace: "system-ingress-admin",
        k8sProvider: this.args.k8sProvider,
        className: "admin",
        public: this.args.ingress?.admin?.public,
        tls: {
          enabled: this.args.ingress.admin.enableTlsTermination,
          domain: this.args.ingress.admin.domain,
          zoneId: this.adminZoneId!,
        },
      }, opts);
    }
    return;
  }

  private setupDefaultIngressNginx(opts?: pulumi.ResourceOptions): IngressNginx | undefined {
    if (this.args.ingress?.default?.domain !== undefined) {
      return new IngressNginx(`${this.name}-ingress-nginx-default`, {
        createNamespace: true,
        name: "ingress-default",
        namespace: "system-ingress-default",
        k8sProvider: this.args.k8sProvider,
        className: "nginx",
        public: this.args.ingress?.default?.public,
        default: true,
        tls: {
          enabled: this.args.ingress.default.enableTlsTermination,
          domain: this.args.ingress.default.domain,
          zoneId: this.defaultZoneId!,
        },
      }, opts);
    }
    return;
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
        hostname: this.args.ingress?.admin?.domain !== undefined ? `dashboard.${this.args.ingress?.admin?.domain}` : undefined,
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

  private async getZoneData(domain: string): Promise<{id: string, arn: string}> {
    const domainParts = domain.split(".");
    const topLevelDomain = `${domainParts[domainParts.length-2]}.${domainParts[domainParts.length-1]}`;
    try {
      const invokeOpts = {parent: this, async: true};
      const zone = await aws.route53.getZone({
        name: topLevelDomain,
      }, invokeOpts);
      return {
        id: zone.id,
        arn: zone.arn,
      };
    } catch (error) {
      pulumi.log.error(`Unable to find zone for ${domain}`, this);
      throw error;
    }
  }

  private getAllZoneArns(): pulumi.Input<string>[] {
    const list: pulumi.Input<string>[] = [];
    if (this.adminZoneArn !== undefined) {
      list.push(this.adminZoneArn);
    }
    if (this.defaultZoneArn !== undefined) {
      list.push(this.defaultZoneArn);
    }
    return list
  }

  private setupAdotApplication(
    opts?: pulumi.ResourceOptions
  ): AdotApplication {
    const region = pulumi.output(aws.getRegion());
    return new AdotApplication(
      `${this.name}-adot-application`,
      {
        name: "adot-application",
        namespace: "system-observability",
        k8sProvider: this.args.k8sProvider,
        identityProvidersArn: [...this.args.identityProvidersArn],
        serviceAccountName: "adot-applications",
        issuerUrl: this.args.issuerUrl,
        logging: this.args.logging,
        metrics: this.args.metrics,
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
      `${this.name}-adot-operator`,
      {
        name: "adot-operator",
        namespace: "system-observability",
        createNamespace: true,
        k8sProvider: this.args.k8sProvider,
        identityProvidersArn: [...this.args.identityProvidersArn],
        serviceAccountName: "adot-operator",
        issuerUrl: this.args.issuerUrl,
      },
      opts
    );
  }
}

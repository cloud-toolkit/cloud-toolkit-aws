import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import * as random from "@pulumi/random";
import * as yaml from "yaml";
import defaultsDeep from "lodash.defaultsdeep";
import { ArgoCDArgs, defaultArgs } from "./argocdArgs";

export { ArgoCDArgs };

/**
 * ArgoCD is a component that deploy the ArgoCD application in the cluster.
 */
export class ArgoCD extends pulumi.ComponentResource {
  private args: ArgoCDArgs;
  private name: string;

  /**
   * The inital admin password.
   */
  public readonly adminPassword: random.RandomPassword;

  /**
   * The Helm Chart used to deploy ArgoCD.
   */
  public readonly chart: kubernetes.helm.v3.Release;

  /**
   * The Namespace used to deploy the component.
   */
  public readonly namespace: kubernetes.core.v1.Namespace;

  constructor(name: string, args: ArgoCDArgs, opts?: pulumi.ResourceOptions) {
    super("cloud-toolkit-aws:kubernetes:ArgoCD", name, args, opts);
    this.name = name;
    this.args = args;

    const adminPasswordOpts = {
      ...opts,
      parent: this,
    };
    this.adminPassword = this.setupAdminPassword(adminPasswordOpts);

    const resourceOpts = {
      ...opts,
      parent: this,
      provider: this.args.k8sProvider,
    };

    this.namespace = this.setupNamespace("system-argocd", resourceOpts);
    const values = this.getChartValues();
    this.chart = this.deployHelmChart(
      "argo-cd",
      "5.6.1",
      "https://argoproj.github.io/argo-helm",
      values,
      resourceOpts,
    );

    this.registerOutputs({
      adminPassword: this.adminPassword,
      chart: this.chart,
      namespace: this.namespace,
    });
  }

  protected validateArgs(a: ArgoCDArgs): ArgoCDArgs {
    const args = defaultsDeep({ ...a }, defaultArgs);
    return args;
  }

  private setupAdminPassword(opts: pulumi.ResourceOptions): random.RandomPassword {
    return new random.RandomPassword(this.name, {
      length: 16,
      lower: true,
      number: true,
      special: true,
      upper: true,
    }, opts);
  }

  private setupNamespace(
    name: string,
    opts?: pulumi.CustomResourceOptions
  ): kubernetes.core.v1.Namespace {
    return new kubernetes.core.v1.Namespace(
      this.name,
      {
        metadata: {
          name: this.args.namespace,
        },
      },
      opts
    );
  }

  private getChartValues(): any {
    return {
      configs: {
        params: {
          "server.insecure": true,
        },
      },
      server: {
        autoscaling: {
          enabled: false,
        },
        ingress: {
          enabled: this.args.hostname !== undefined,
          ingressClassName: "admin",
          annotations: {
            "external-dns.alpha.kubernetes.io/hostname": this.args.hostname,
          },
          hosts: [this.args.hostname],
        },
      },
      repoServer: {
        autoscaling: {
          enabled: false,
        },
      },
    };
  }

  protected deployHelmChart(
    chart: string,
    version: string,
    repo: string,
    values: any,
    opts?: pulumi.ResourceOptions
  ): kubernetes.helm.v3.Release {
    const helmChart = new kubernetes.helm.v3.Release(
      this.args.name,
      {
        chart: chart,
        namespace: this.namespace.metadata.name,
        version: version,
        repositoryOpts: {
          repo: repo,
        },
        values: values,
      },
      opts
    );

    return helmChart;
  }
}

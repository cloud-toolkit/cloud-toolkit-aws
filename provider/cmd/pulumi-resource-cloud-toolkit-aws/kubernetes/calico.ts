import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

import defaultsDeep from "lodash.defaultsdeep";

import { ApplicationAddon } from "./applicationAddon";
import { defaultArgs, CalicoArgs } from "./calicoArgs";

export { CalicoArgs };

export class Calico extends ApplicationAddon<CalicoArgs> {

  public readonly namespace?: kubernetes.core.v1.Namespace;
  public readonly application: kubernetes.apiextensions.CustomResource;
  public readonly installation: kubernetes.apiextensions.CustomResource;
  public readonly installationCrd: kubernetes.yaml.ConfigFile;

  constructor(name: string, args: CalicoArgs, opts?: pulumi.ResourceOptions) {
    super("cloud-toolkit-aws:kubernetes:Calico", name, args, opts);

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    this.namespace = this.setupNamespace(resourceOpts);

    const installationCrdOpts = pulumi.mergeOptions(resourceOpts, {
      dependsOn: this.namespace,
      provider: this.args.k8sProvider,
    });
    this.installationCrd = this.setupInstallationCrd(installationCrdOpts);

    const applicationOpts = pulumi.mergeOptions(opts, {
      dependsOn: this.installationCrd
    });
    this.application = this.setupApplication(applicationOpts);

    const installationOpts = pulumi.mergeOptions(resourceOpts, {
      dependsOn: [
        this.application,
        this.installationCrd,
      ],
    });
    this.installation = this.setupInstallation(installationOpts);

    this.registerOutputs({
      namespace: this.namespace,
      application: this.application,
      installation: this.installation,
      installationCrd: this.installationCrd,
    })
  }

  protected validateArgs(a: CalicoArgs): CalicoArgs {
    const args = defaultsDeep({ ...a }, defaultArgs);

    return args;
  }

  protected getApplicationSpec(): any {
    return {
      project: "default",
      source: {
        repoURL: "https://docs.projectcalico.org/charts",
        chart: "tigera-operator",
        targetRevision: "v3.24.0",
        helm: {
          releaseName: this.args.name,
          parameters: [
            {
              name: "apiServer.enabled",
              value: "false",
            },
            {
              name: "installation.enabled",
              value: "false",
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
          "Replace=true",
        ],
      },
    };
  }

  private setupInstallation(opts: pulumi.CustomResourceOptions): kubernetes.apiextensions.CustomResource {
    return new kubernetes.apiextensions.CustomResource(
      this.name,
      {
        apiVersion: "operator.tigera.io/v1",
        kind: "Installation",
        metadata: {
          name: "default",
        },
        spec: {
          calicoNetwork: {
            bgp: "Disabled",
            linuxDataplane: "Iptables",
          },
          cni: {
            type: "AmazonVPC",
            ipam: {
              type: "AmazonVPC",
            },
          },
          controlPlaneReplicas: 2,
          kubernetesProvider: "EKS",
          nodeUpdateStrategy: {
            rollingUpdate: {
              maxUnavailable: 1
            },
            type: "RollingUpdate",
          },
          nonProvileged: "Disabled",
          variant: "Calico",
        },
      },
      pulumi.mergeOptions(opts, {
        provider: this.args.k8sProvider,
      })
    );
  }

  private setupInstallationCrd(opts: pulumi.ResourceOptions): kubernetes.yaml.ConfigFile {
    return new kubernetes.yaml.ConfigFile(
      `${this.name}-installation-crd`,
      {
        file: "https://raw.githubusercontent.com/projectcalico/calico/v3.24.0/charts/tigera-operator/crds/operator.tigera.io_installations_crd.yaml",
      },
      opts
    )
  }
}

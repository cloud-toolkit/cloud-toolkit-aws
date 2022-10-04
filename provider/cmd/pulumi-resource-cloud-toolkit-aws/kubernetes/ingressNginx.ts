import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";

import { ApplicationAddon } from "./applicationAddon";
import { defaultArgs, IngressNginxArgs } from "./ingressNginxArgs";

export class IngressNginx extends ApplicationAddon<IngressNginxArgs> {
  public readonly namespace?: kubernetes.core.v1.Namespace;

  public readonly application: kubernetes.apiextensions.CustomResource;

  constructor(
    name: string,
    args: IngressNginxArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:IngressNginx", name, args, opts);

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    this.namespace = this.setupNamespace(resourceOpts);
    this.application = this.setupApplication(resourceOpts);
  }

  protected validateArgs(a: IngressNginxArgs): IngressNginxArgs {
    const args = defaultsDeep({ ...a }, defaultArgs);

    return args;
  }

  protected getApplicationSpec(): any {
    const scheme = this.args.public ? "internet-facing" : "internal";
    const internal = !this.args.public;

    const whitelistParameters = [];
    for (const [index, cidr] of (this.args.whitelist || []).entries()) {
      whitelistParameters.push({
        name: `controller.service.loadBalancerSourceRanges[${index}]`,
        value: cidr,
      });
    }

    return {
      project: "default",
      source: {
        repoURL: "https://kubernetes.github.io/ingress-nginx",
        chart: "ingress-nginx",
        targetRevision: "4.2.3",
        helm: {
          releaseName: this.args.name,
          parameters: [
            ...whitelistParameters,
            {
              name: "controller.ingressClassByName",
              value: "true",
            },
            {
              name: "controller.ingressClassResource.controllerValue",
              value: pulumi.interpolate`k8s.io/${this.args.className}`,
            },
            {
              name: "controller.ingressClassResource.enabled",
              value: "true",
            },
            {
              name: "controller.ingressClassResource.name",
              value: this.args.className,
            },
            {
              name: "controller.replicaCount",
              value: "2",
            },
            {
              name: "controller.service.externalTrafficPolicy",
              value: "Local",
            },
            {
              name: "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-backend-protocol",
              value: "tcp",
            },
            {
              name: "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-cross-zone-load-balancing-enabled",
              value: "true",
            },
            {
              name: "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-scheme",
              value: scheme,
            },
            {
              name: "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-internal",
              value: `${internal}`,
            },
            {
              name: "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-ssl-ports",
              value: "https",
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

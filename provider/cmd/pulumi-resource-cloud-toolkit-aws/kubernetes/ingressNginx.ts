import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";

import { ApplicationAddon } from "./applicationAddon";
import { defaultArgs, IngressNginxArgs } from "./ingressNginxArgs";
import { Certificate } from "../commons";

export {
  IngressNginxArgs
};

/**
 * IngressNginx is a component that deploy the Nginx IngressController to expose applications over HTTP/HTTPS.
 */
export class IngressNginx extends ApplicationAddon<IngressNginxArgs> {
  /**
   * The Namespace used to deploy the component.
   */
  public readonly namespace?: kubernetes.core.v1.Namespace;

  /**
   * The ArgoCD Application to deploy the component.
   */
  public readonly application: kubernetes.apiextensions.CustomResource;

  /**
   * The ACM Certificates used for TLS encryption.
   */
  public readonly certificate?: Certificate;

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
    this.certificate = this.setupCertificate(resourceOpts);

    const applicationOpts = pulumi.mergeOptions(resourceOpts, {
      dependsOn: this.certificate,
    });
    this.application = this.setupApplication(applicationOpts);
  }

  protected validateArgs(a: IngressNginxArgs): IngressNginxArgs {
    const args = defaultsDeep({ ...a }, defaultArgs);

    return args;
  }

  private setupCertificate(opts: pulumi.ResourceOptions): Certificate | undefined {
    if (this.args.tls !== undefined && this.args.tls.enabled) {
      return new Certificate(this.name, {
        domain: `*.${this.args.tls.domain}`,
        zoneId: this.args.tls.zoneId,
      }, opts);
    }
    return;
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

    const tlsParameters = [];
    if (this.args.tls?.enabled) {
      tlsParameters.push({
        name: "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-ssl-cert",
        value: this.certificate?.certificate.arn,
      });
      tlsParameters.push({
        name: "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-ssl-ports",
        value: "https",
      });
      tlsParameters.push({
        name: "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-connection-idle-timeout",
        value: "60",
      });
      tlsParameters.push({
        name: "controller.containerPort.http",
        value: "80",
      });
      tlsParameters.push({
        name: "controller.containerPort.https",
        value: "80",
      });
      tlsParameters.push({
        name: "controller.containerPort.tohttps",
        value: "2443",
      });
      tlsParameters.push({
        name: "controller.service.targetPorts.http",
        value: "tohttps",
      });
      tlsParameters.push({
        name: "controller.service.targetPorts.https",
        value: "http",
      });
      tlsParameters.push({
        name: "controller.allow-snippet-annotations",
        value: "true",
      });
      tlsParameters.push({
        name: "controller.config.http-snippet",
        value: "server { listen 2443; return 308 https://$$host$$request_uri; }",
      });
      tlsParameters.push({
        name: "controller.config.proxy-real-ip-cidr",
        value: "0.0.0.0/0",
      });
      tlsParameters.push({
        name: "controller.config.use-forwarded-headers",
        value: "true",
      });
    }

    return {
      project: "default",
      source: {
        repoURL: "https://kubernetes.github.io/ingress-nginx",
        chart: "ingress-nginx",
        targetRevision: "4.3.0",
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
              name: "controller.ingressClassResource.default",
              value: this.args.default?.toString(),
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
            {
              name: "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-type",
              value: "nlb",
            },
            ...tlsParameters,
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

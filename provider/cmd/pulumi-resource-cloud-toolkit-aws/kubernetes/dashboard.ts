import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";

import { ApplicationAddon } from "./applicationAddon";
import { defaultArgs, DashboardArgs } from "./dashboardArgs";

export { DashboardArgs };

/**
 * Dashboard used to view the status of the Kubernetes cluster.
 */
export class Dashboard extends ApplicationAddon<DashboardArgs> {

    /**
     * The Namespace used to deploy the component.
     */
    public readonly namespace?: kubernetes.core.v1.Namespace;

    /**
     * Application component.
     */
    public readonly application: kubernetes.apiextensions.CustomResource;

    constructor(
        name: string,
        args: DashboardArgs,
        opts?: pulumi.ResourceOptions
    ) {
        super("cloud-toolkit-aws:kubernetes:Dashboard", name, args, opts);

        const resourceOpts = {
            ...opts,
            parent: this,
            provider: this.args.k8sProvider,
        };
        
        this.namespace = this.setupNamespace(resourceOpts);
        this.application = this.setupApplication(resourceOpts);

        this.registerOutputs({
            chart: this.application,
            namespace: this.namespace,
        });
    }

    protected validateArgs(a: DashboardArgs): DashboardArgs {
        const args = defaultsDeep({ ...a }, defaultArgs);

        if (args.className == "") {
            throw Error("Ingress ClassName can't be void");
        }

        return args;
    }

    protected getApplicationSpec(): any {
        return {
            project: "default",
            source: {
                repoURL: "https://kubernetes.github.io/dashboard/",
                chart: "kubernetes-dashboard",
                targetRevision: "5.7.0",
                helm: {
                    releaseName: this.args.name,
                    parameters: [
                        {
                            name: "ingress.enabled",
                            value: this.args.hostname ? "true" : "false",
                        },
                        {
                            name: "ingress.annotation.nginx\\.ingress\\.kubernetes\\.io/backend-protocol",
                            value: "HTTPS",
                        },
                        {
                            name: "ingress.annotation.nginx\\.ingress\\.kubernetes\\.io/ssl-redirect",
                            value: "true",
                        },
                        {
                            name: "ingress.annotation.nginx\\.ingress\\.kubernetes\\.io/ssl-passthrough",
                            value: "true",
                        },
                        {
                            name: "external-dns\\.alpha\\.kubernetes\\.io/hostname",
                            value: this.args.hostname,
                        },
                        {
                            name: "ingress.className",
                            value: "admin",
                        },
                        {
                            name: "ingress.hosts[0]",
                            value: this.args.hostname,
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

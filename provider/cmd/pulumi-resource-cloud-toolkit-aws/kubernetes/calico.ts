import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

import defaultsDeep from "lodash.defaultsdeep";

import { ApplicationAddon } from "./applicationAddon";
import { defaultArgs, CalicoArgs } from "./calicoArgs";

export { CalicoArgs };

export class Calico extends ApplicationAddon<CalicoArgs> {

    public readonly namespace?: kubernetes.core.v1.Namespace;
    public readonly application: kubernetes.apiextensions.CustomResource;

    constructor(name: string, args: CalicoArgs, opts?: pulumi.ResourceOptions) {
        super("cloud-toolkit-aws:kubernetes:Calico", name, args, opts);

        const resourceOpts = pulumi.mergeOptions(opts, {
            parent: this,
        });

        this.namespace = this.setupNamespace(resourceOpts);
        this.application = this.setupApplication(resourceOpts);

        this.registerOutputs({
            chart: this.application,
            namespace: this.namespace,
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
                            value: "true",
                        },
                        {
                            name: "installation.calicoNetwork.bgp",
                            value: "Disabled",
                        },
                        {
                            name: "installation.calicoNetwork.linuxDataplane",
                            value: "Iptables",
                        },
                        {
                            name: "installation.cni.type",
                            value: "AmazonVPC",
                        },
                        {
                            name: "installation.cni.ipam.type",
                            value: "AmazonVPC",
                        },
                        {
                            name: "installation.controlPlaneReplicas",
                            value: "2",
                        },
                        {
                            name: "installation.kubernetesProvider",
                            value: "EKS",
                        },
                        {
                            name: "installation.nodeUpdateStrategy.rollingUpdate.maxUnavailable",
                            value: "1",
                        },
                        {
                            name: "installation.nodeUpdateStrategy.type",
                            value: "RollingUpdate",
                        },
                        {
                            name: "installation.nonPrivileged",
                            value: "Disabled",
                        },
                        {
                            name: "installation.variant",
                            value: "Calico",
                        },
                    ],
                },
            },
            destination: {
                server: "https://kubernetes.default.svc",
                namespace: "system-calico",
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
}

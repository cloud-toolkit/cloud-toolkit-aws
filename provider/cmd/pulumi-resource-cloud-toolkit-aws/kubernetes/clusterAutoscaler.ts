import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import { ApplicationAddon } from "./applicationAddon";
import { ClusterAutoscalerArgs } from "./clusterAutoscalerArgs";
import { Irsa } from "./irsa";

export { ClusterAutoscalerArgs };

export class ClusterAutoscaler extends ApplicationAddon<ClusterAutoscalerArgs> {

    public readonly namespace?: kubernetes.core.v1.Namespace;

    public readonly application: kubernetes.apiextensions.CustomResource;
  
    public readonly irsa: Irsa;

    constructor(
        name: string,
        args: ClusterAutoscalerArgs,
        opts?: pulumi.CustomResourceOptions
    ) {
        super("cloud-toolkit-aws:kubernetes:ClusterAutoscaler", name, args, opts);

        const resourceOpts = pulumi.mergeOptions(opts, {
            parent: this,
        });
    
        this.namespace = this.setupNamespace(resourceOpts);
        this.irsa = this.setupIrsa(resourceOpts);
        this.application = this.setupApplication(resourceOpts);
    
        this.registerOutputs({
            chart: this.application,
            irsa: this.irsa,
            namespace: this.namespace,
        });
    }

    protected validateArgs(a: ClusterAutoscalerArgs): ClusterAutoscalerArgs {
        return a;
    }

    private setupIrsa(opts?: pulumi.ResourceOptions): Irsa {
        return new Irsa(this.name, {
          identityProvidersArn: [...this.args.identityProvidersArn],
          issuerUrl: this.args.issuerUrl,
          k8sProvider: this.args.k8sProvider,
          namespace: this.args.namespace,
          serviceAccountName: this.args.serviceAccountName,
          policies: [this.getIAMPolicy()],
        }, opts);
      }

    protected getIAMPolicy(): pulumi.Output<string> {
        const document = aws.iam.getPolicyDocumentOutput({
            version: "2012-10-17",
            statements: [
                {
                    sid: "VisualEditor0",
                    effect: "Allow",
                    actions: [
                        "autoscaling:SetDesiredCapacity",
                        "autoscaling:TerminateInstanceInAutoScalingGroup",
                    ],
                    resources: ["*"],
                    conditions: [
                        {
                            test: "StringEquals",
                            values: ["owned"],
                            variable: pulumi.interpolate`aws:ResourceTag/k8s.io/cluster-autoscaler/${this.args.clusterName}`,
                        },
                    ],
                },
                {
                    sid: "VisualEditor1",
                    effect: "Allow",
                    actions: [
                        "autoscaling:DescribeAutoScalingInstances",
                        "autoscaling:DescribeAutoScalingGroups",
                        "ec2:DescribeLaunchTemplateVersions",
                        "autoscaling:DescribeTags",
                        "autoscaling:DescribeLaunchConfigurations",
                    ],
                    resources: ["*"],
                },
            ],
        });

        return document.json;
    }

    protected getApplicationSpec(): any {

        const region = aws.getRegionOutput();
        
        return {
            project: "default",
            source: {
                repoURL: "https://kubernetes.github.io/autoscaler",
                chart: "cluster-autoscaler",
                targetRevision: "9.15.0",
                helm: {
                    releaseName: this.args.name,
                    parameters: [
                        {
                            name: "extraArgs.aws-use-static-instance-list",
                            value: "true",
                        },
                        {
                            name: "resources.limits.cpu",
                            value: "200m",
                        },
                        {
                            name: "resources.limits.memory",
                            value: "512Mi",
                        },
                        {
                            name: "resources.requests.cpu",
                            value: "200m",
                        },
                        {
                            name: "resources.requests.memory",
                            value: "512Mi",
                        },
                        {
                            name: "awsRegion",
                            value: region.name
                        },
                        {
                            name: "autoDiscovery.clusterName",
                            value: this.args.clusterName,
                        },
                        {
                            name: "rbac.serviceAccount.create",
                            value: "false",
                        },
                        {
                            name: "rbac.serviceAccount.name",
                            value: this.irsa.serviceAccount.metadata.name,
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



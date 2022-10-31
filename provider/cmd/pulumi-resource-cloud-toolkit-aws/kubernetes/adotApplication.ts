import * as pulumi from "@pulumi/pulumi";
import { Irsa } from "./irsa";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";
import { AdotApplicationArgs, AdotApplicationDefaultArgs } from "./adotApplicationArgs"

export class AdotApplication extends ApplicationAddon<AdotApplicationArgs> {
    public readonly namespace?: kubernetes.core.v1.Namespace;

    public readonly CWLogGroup: aws.cloudwatch.LogGroup;

    public readonly fluentBitIRSA: Irsa;

    public readonly adotCollectorIRSA: Irsa;

    public readonly application: kubernetes.apiextensions.CustomResource;

    constructor(
        name: string,
        args: AdotApplicationArgs,
        opts?: pulumi.ComponentResourceOptions
    ) {
        super(
            "cloudToolkit:aws:kubernetes:AdotApplication",
            name,
            args,
            opts
        );

        const resourceOpts = pulumi.mergeOptions(opts, {
            parent: this,
        });

        this.namespace = this.setupNamespace(resourceOpts);

        this.fluentBitIRSA = this.getIRSAForFluentBit();
        this.adotCollectorIRSA = this.getIRSAForAdotCollector();

        this.CWLogGroup = this.createCWLogGroup();

        this.application = this.setupApplication(resourceOpts);

        /**
        this.operator = this.deployAdotOperator();

        this.application = this.deployAdotApplication(
            this.adotCollectorIRSA.role.arn,
            this.fluentBitIRSA.role.arn
        );
         */
    }

    private createCWLogGroup(): aws.cloudwatch.LogGroup {
        return new aws.cloudwatch.LogGroup(
            `${this.name}performance`,
            {
                name: pulumi.interpolate`/aws/containerinsights/${this.args.clusterName}/performance`,
                retentionInDays: this.args.metrics?.dataRetention,
            },
            {
                parent: this,
            }
        );
    }

    getFluentbitApplicationConfig(fluentBitRoleArn: string) {
        return {
            enabled: true,
            namespace: this.args.namespace,
            serviceAccount: {
                // name: this.getFluentBitName(),
                annotations: {
                    "eks.amazonaws.com/role-arn": fluentBitRoleArn,
                },
            },
            output: {
                applicationLog: {
                    log_retention: {
                        enabled: this.args.logging?.applications?.enabled,
                        days: this.args.logging?.applications?.dataRetention,
                    },
                },
                dataplaneLog: {
                    log_retention: {
                        enabled: this.args.logging?.dataplane?.enabled,
                        days: this.args.logging?.dataplane?.dataRetention,
                    },
                },
                hostLog: {
                    log_retention: {
                        enabled: this.args.logging?.host?.enabled,
                        days: this.args.logging?.host?.dataRetention,
                    },
                },
            },
        };
    }

    getAdotCollectorApplicationConfig(adotRoleArn: string) {
        return {
            daemonSet: {
                enabled: true,
                createNamespace: false,
                namespace: this.args.namespace,
                serviceAccount: {
                    name: this.getAdotCollectorName(),
                    annotations: {
                        "eks.amazonaws.com/role-arn": adotRoleArn,
                    },
                },
                service: {
                    metrics: {
                        receivers: ["awscontainerinsightreceiver"],
                        exporters: ["awsemf"],
                    },
                },
            },
        };
    }

    private getFluentBitPolicy(): pulumi.Output<string> {
        const document = aws.iam.getPolicyDocumentOutput({
            statements: [
                {
                    effect: "Allow",
                    actions: [
                        "cloudwatch:PutMetricData",
                        "ec2:DescribeVolumes",
                        "ec2:DescribeTags",
                        "logs:PutLogEvents",
                        "logs:DescribeLogStreams",
                        "logs:DescribeLogGroups",
                        "logs:CreateLogStream",
                        "logs:CreateLogGroup",
                        "logs:PutRetentionPolicy",
                    ],
                    resources: ["*"],
                },
                {
                    effect: "Allow",
                    actions: ["ssm:GetParameter"],
                    resources: ["arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*"],
                },
            ],
        });

        return document.json;
    }

    private getFluentBitName() {
        return `fluent-bit`;
    }

    getIRSAForFluentBit(opts?: pulumi.ResourceOptions): Irsa {

        return new Irsa(`${this.name}-fluentbit`, {
            identityProvidersArn: [...this.args.identityProvidersArn],
            issuerUrl: this.args.issuerUrl,
            k8sProvider: this.args.k8sProvider,
            namespace: this.args.namespace,
            serviceAccountName: this.getFluentBitName(),
            policies: [this.getFluentBitPolicy()],
          }, opts);
    }

    private getAdotCollectorName() {
        return `${this.name}-adot-collector`;
    }

    private getPrometheusPolicy(): pulumi.Output<string> {
        const policy = aws.iam.getPolicyOutput({
            name: "AmazonPrometheusRemoteWriteAccess",
        });

        return policy.policy
    }

    private getAdotCollectorPolicy(): pulumi.Output<string> {
        const policyDocument = aws.iam.getPolicyDocumentOutput({
            statements: [
                {
                    effect: "Allow",
                    actions: [
                        "logs:PutLogEvents",
                        "logs:CreateLogGroup",
                        "logs:CreateLogStream",
                        "logs:DescribeLogStreams",
                        "logs:DescribeLogGroups",
                        "xray:PutTraceSegments",
                        "xray:PutTelemetryRecords",
                        "xray:GetSamplingRules",
                        "xray:GetSamplingTargets",
                        "xray:GetSamplingStatisticSummaries",
                        "cloudwatch:PutMetricData",
                        "ec2:DescribeVolumes",
                        "ec2:DescribeTags",
                        "ssm:GetParameters",
                        "ec2:DescribeInstances",
                        "ecs:ListTasks",
                        "ecs:ListServices",
                        "ecs:DescribeContainerInstances",
                        "ecs:DescribeServices",
                        "ecs:DescribeTasks",
                        "ecs:DescribeTaskDefinition",
                        "ecs:DescribeInstances",
                    ],
                    resources: ["*"],
                },
            ],
        });

        return policyDocument.json
    }

    getIRSAForAdotCollector(opts?: pulumi.ResourceOptions): Irsa {

        return new Irsa(`${this.name}-adot-application`, {
            identityProvidersArn: [...this.args.identityProvidersArn],
            issuerUrl: this.args.issuerUrl,
            k8sProvider: this.args.k8sProvider,
            namespace: this.args.namespace,
            serviceAccountName: this.getAdotCollectorName(),
            policies: [this.getAdotCollectorPolicy(), this.getPrometheusPolicy()],
          }, opts);
    }

    protected validateArgs(
        a: AdotApplicationArgs
    ): AdotApplicationArgs {
        return defaultsDeep({ ...a }, AdotApplicationDefaultArgs);
    }

    getOperatorApplicationSpec(): any {
        return {
            project: "default",
            source: {
                repoURL: "https://open-telemetry.github.io/opentelemetry-helm-charts",
                chart: "opentelemetry-operator",
                targetRevision: "0.8.3",
                helm: {
                    releaseName: "opentelemetry-operator",
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

    getApplicationSpec(): any {
        return {
            project: "default",
            source: {
                repoURL: "https://aws-observability.github.io/aws-otel-helm-charts",
                chart: "adot-exporter-for-eks-on-ec2",
                targetRevision: "0.6.0",
                helm: {
                    releaseName: "adot",
                    parameters: [
                        {
                            name: "global.namespaceOverride",
                            value: this.args.namespace,
                        },
                        {
                            name: "awsRegion",
                            value: this.args.namespace,
                        },
                        {
                            name: "clusterName",
                            value: this.args.clusterName,
                        },
                        {
                            name: "serviceAccount.create",
                            value: "false",
                        },
                        {
                            name: "serviceAccount.name",
                            value: this.name,
                        },
                        // fluentbit
                        {
                            name: "fluentbit.enabled",
                            value: "true",
                        },
                        {
                            name: "fluentbit.namespace",
                            value: this.args.namespace,
                        },
                        {
                            name: "fluentbit.serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn",
                            value: this.fluentBitIRSA.role.arn,
                        },
                        {
                            name: "fluentbit.output.applicationLog.log_retention.enabled",
                            value: `${this.args.logging?.applications?.enabled}`,
                        },
                        {
                            name: "fluentbit.output.applicationLog.log_retention.days",
                            value: `${this.args.logging?.applications?.dataRetention}`,
                        },
                        {
                            name: "fluentbit.output.dataplaneLog.log_retention.enabled",
                            value: `${this.args.logging?.applications?.enabled}`,
                        },
                        {
                            name: "fluentbit.output.dataplaneLog.log_retention.days",
                            value: `${this.args.logging?.applications?.dataRetention}`,
                        },
                        {
                            name: "fluentbit.output.hostLog.log_retention.enabled",
                            value: `${this.args.logging?.applications?.enabled}`,
                        },
                        {
                            name: "fluentbit.output.hostLog.log_retention.days",
                            value: `${this.args.logging?.applications?.dataRetention}`,
                        },
                        // adot collector
                        {
                            name: "adotCollector.daemonSet.enabled",
                            value: "true",
                        },
                        {
                            name: "adotCollector.daemonSet.createNamespace",
                            value: "false",
                        },
                        {
                            name: "adotCollector.daemonSet.namespace",
                            value: this.args.namespace,
                        },
                        {
                            name: "adotCollector.daemonSet.serviceAccount.name",
                            value: this.getAdotCollectorName(),
                        },
                        {
                            name: "adotCollector.daemonSet.serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn",
                            value: this.adotCollectorIRSA.role.arn,
                        },
                        {
                            name: "adotCollector.daemonSet.service.metrics.receivers[0]",
                            value: "awscontainerinsightreceiver",
                        },
                        {
                            name: "adotCollector.daemonSet.service.metrics.exporters[0]",
                            value: "awsemf",
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

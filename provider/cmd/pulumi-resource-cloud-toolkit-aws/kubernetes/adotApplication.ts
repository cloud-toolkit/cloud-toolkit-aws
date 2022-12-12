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

  public readonly logGroupMetrics?: aws.cloudwatch.LogGroup;

  public readonly irsa?: Irsa;

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


    const applicationDependsOn: pulumi.Input<pulumi.Resource>[] = [];
    if (this.args.metrics?.enabled) {
      this.irsa = this.setupIrsaForAdotCollector(resourceOpts);
      this.logGroupMetrics = this.createMetricsLogGroup(resourceOpts);
      applicationDependsOn.push(this.irsa);
      applicationDependsOn.push(this.logGroupMetrics);
    }


    const applicationOpts = pulumi.mergeOptions(resourceOpts, {
      dependsOn: applicationDependsOn,
    })
    this.application = this.setupApplication(applicationOpts);

    this.registerOutputs({
      irsa: this.irsa,
      application: this.application,
      logGroupMetrics: this.logGroupMetrics,
      namespace: this.namespace,
    });
  }

  
  private createMetricsLogGroup(opts: pulumi.ResourceOptions): aws.cloudwatch.LogGroup {
    return new aws.cloudwatch.LogGroup(
      `${this.name}-performance`,
      {
        name: pulumi.interpolate`/aws/containerinsights/${this.args.clusterName}/performance`,
        retentionInDays: this.args.metrics?.dataRetention,
      },
      opts
    );
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

  private setupIrsaForAdotCollector(opts: pulumi.ResourceOptions): Irsa {
    return new Irsa(`${this.name}-adot-application`, {
      identityProvidersArn: [...this.args.identityProvidersArn],
      issuerUrl: this.args.issuerUrl,
      k8sProvider: this.args.k8sProvider,
      namespace: this.args.namespace,
      serviceAccountName: this.getAdotCollectorName(),
      policies: [this.getAdotCollectorPolicy(), this.getPrometheusPolicy()],
    }, opts);
  }

  validateArgs(
    a: AdotApplicationArgs
  ): AdotApplicationArgs {
    return defaultsDeep({ ...a }, AdotApplicationDefaultArgs);
  }

  private getOperatorApplicationSpec(): any {
    return {
      project: "default",
      source: {
        repoURL: "https://open-telemetry.github.io/opentelemetry-helm-charts",
        chart: "opentelemetry-operator",
        targetRevision: "0.17.0",
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
        targetRevision: "0.8.0",
        helm: {
          releaseName: "adot-exporter-for-eks-on-ec2",
          parameters: [
            {
              name: "global.namespaceOverride",
              value: this.args.namespace,
            },
            {
              name: "awsRegion",
              value: this.args.awsRegion,
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
              value: this.args.serviceAccountName,
            },
            // fluentbit
            {
              name: "fluentbit.enabled",
              value: "false",
            },
            {
              name: "fluentbit.namespace",
              value: this.args.namespace,
            },
            // adot collector
            {
              name: "adotCollector.daemonSet.enabled",
              value: `${this.args.metrics?.enabled}`,
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
              value: this.irsa?.role?.arn,
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
        namespace: this.namespace?.metadata.name || this.args.namespace,
      },
      syncPolicy: {
        automated: {
          prune: true,
          selfHeal: true,
          allowEmpty: true,
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

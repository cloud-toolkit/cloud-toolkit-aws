import * as pulumi from "@pulumi/pulumi";
import { Irsa } from "./irsa";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { AdotApplicationArgs, AdotApplicationDefaultArgs } from "./adotApplicationArgs"

export class AdotApplication extends ApplicationAddon<AdotApplicationArgs> {
  /**
   * The Namespace used to deploy the component.
   */
  public readonly namespace?: kubernetes.core.v1.Namespace;

  /**
   * AWS LogGroup used to store application logs.
   */
  public readonly logGroupApplicationLog?: aws.cloudwatch.LogGroup;

  /**
   * AWS LogGroup used to store dataplane logs.
   */
  public readonly logGroupDataplaneLog?: aws.cloudwatch.LogGroup;

  /**
   * AWS LogGroup used to store host logs.
   */
  public readonly logGroupHostLog?: aws.cloudwatch.LogGroup;

  /**
   * AWS LogGroup used to store metrics.
   */
  public readonly logGroupMetrics?: aws.cloudwatch.LogGroup;

  /**
   * IRSA used by FluentBit.
   */
  public readonly fluentBitIRSA?: Irsa;

  /**
   * IRSA used by AdotCollector.
   */
  public readonly adotCollectorIRSA?: Irsa;

  /**
   * The ArgoCD Application to deploy the component.
   */
  public readonly application: kubernetes.apiextensions.CustomResource;

  constructor(
    name: string,
    args: AdotApplicationArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super(
      "cloud-toolkit-aws:kubernetes:AdotApplication",
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
      this.adotCollectorIRSA = this.setupIrsaForAdotCollector(resourceOpts);
      this.logGroupMetrics = this.createMetricsLogGroup(resourceOpts);
      applicationDependsOn.push(this.adotCollectorIRSA);
      applicationDependsOn.push(this.logGroupMetrics);
    }
    if (this.args.logging?.enabled) {
      this.fluentBitIRSA = this.setupIrsaForFluentBit(resourceOpts);
      this.logGroupApplicationLog = this.createApplicationLogGroup(resourceOpts);
      this.logGroupHostLog = this.createHostLogGroup(resourceOpts);
      this.logGroupDataplaneLog = this.createDataplaneLogGroup(resourceOpts);
      applicationDependsOn.push(this.fluentBitIRSA);
      applicationDependsOn.push(this.logGroupApplicationLog);
      applicationDependsOn.push(this.logGroupHostLog);
      applicationDependsOn.push(this.logGroupDataplaneLog);
    }

    const applicationOpts = pulumi.mergeOptions(resourceOpts, {
      dependsOn: applicationDependsOn,
    })
    this.application = this.setupApplication(applicationOpts);

    this.registerOutputs({
      adotCollectorIRSA: this.adotCollectorIRSA,
      application: this.application,
      fluentBitIRSA: this.fluentBitIRSA,
      logGroupApplicationLog: this.logGroupApplicationLog,
      logGroupDataplaneLog: this.logGroupDataplaneLog,
      logGroupHostLog: this.logGroupHostLog,
      logGroupMetrics: this.logGroupMetrics,
      namespace: this.namespace,
    });
  }

  private createApplicationLogGroup(opts: pulumi.ResourceOptions): aws.cloudwatch.LogGroup {
    return new aws.cloudwatch.LogGroup(
      `${this.name}-application`,
      {
        name: pulumi.interpolate`/aws/containerinsights/${this.args.clusterName}/application`,
        retentionInDays: this.args.logging?.applications?.dataRetention,
      },
      opts
    );
  }

  private createHostLogGroup(opts: pulumi.ResourceOptions): aws.cloudwatch.LogGroup {
    return new aws.cloudwatch.LogGroup(
      `${this.name}-host`,
      {
        name: pulumi.interpolate`/aws/containerinsights/${this.args.clusterName}/host`,
        retentionInDays: this.args.logging?.host?.dataRetention,
      },
      opts
    );
  }

  private createDataplaneLogGroup(opts: pulumi.ResourceOptions): aws.cloudwatch.LogGroup {
    return new aws.cloudwatch.LogGroup(
      `${this.name}-dataplane`,
      {
        name: pulumi.interpolate`/aws/containerinsights/${this.args.clusterName}/dataplane`,
        retentionInDays: this.args.logging?.dataplane?.dataRetention,
      },
      opts
    );
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

  getFluentbitApplicationConfig(fluentBitRoleArn: string) {
    return {
      enabled: this.args.logging?.enabled,
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
            days: this.args.logging?.applications?.dataRetention,
          },
        },
        dataplaneLog: {
          log_retention: {
            days: this.args.logging?.dataplane?.dataRetention,
          },
        },
        hostLog: {
          log_retention: {
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

  setupIrsaForFluentBit(opts: pulumi.ResourceOptions): Irsa {
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
              value: `${this.args.logging?.enabled}`,
            },
            {
              name: "fluentbit.namespace",
              value: "system-logging",
            },
            {
              name: "fluentbit.serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn",
              value: this.fluentBitIRSA?.role?.arn,
            },
            {
              name: "fluentbit.output.applicationLog.log_retention.days",
              value: `${this.args.logging?.applications?.dataRetention}`,
            },
            {
              name: "fluentbit.output.dataplaneLog.log_retention.days",
              value: `${this.args.logging?.dataplane?.dataRetention}`,
            },
            {
              name: "fluentbit.output.hostLog.log_retention.days",
              value: `${this.args.logging?.host?.dataRetention}`,
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
              value: this.adotCollectorIRSA?.role?.arn,
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

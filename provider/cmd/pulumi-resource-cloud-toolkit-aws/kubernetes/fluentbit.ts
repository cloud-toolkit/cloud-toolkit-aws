import * as pulumi from "@pulumi/pulumi";
import { Irsa } from "./irsa";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";
import { FluentbitArgs, FluentbitDefaultArgs } from "./fluentbitArgs"

export class Fluentbit extends ApplicationAddon<FluentbitArgs> {
  public readonly namespace?: kubernetes.core.v1.Namespace;

  public readonly logGroupApplicationLog?: aws.cloudwatch.LogGroup;
  public readonly logGroupDataplaneLog?: aws.cloudwatch.LogGroup;
  public readonly logGroupHostLog?: aws.cloudwatch.LogGroup;

  public readonly fluentBitIRSA?: Irsa;

  public readonly application?: kubernetes.apiextensions.CustomResource;

  constructor(
    name: string,
    args: FluentbitArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super(
      "cloud-toolkit-aws:kubernetes:Fluentbit",
      name,
      args,
      opts
    );

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    this.namespace = this.setupNamespace(resourceOpts);

    const applicationDependsOn: pulumi.Input<pulumi.Resource>[] = [];

    if (this.args.logging?.enabled) {
      this.fluentBitIRSA = this.setupIrsaForFluentBit(resourceOpts);
      this.logGroupApplicationLog = this.createApplicationLogGroup(resourceOpts);
      this.logGroupHostLog = this.createHostLogGroup(resourceOpts);
      this.logGroupDataplaneLog = this.createDataplaneLogGroup(resourceOpts);
      applicationDependsOn.push(this.fluentBitIRSA);
      applicationDependsOn.push(this.logGroupApplicationLog);
      applicationDependsOn.push(this.logGroupHostLog);
      applicationDependsOn.push(this.logGroupDataplaneLog);

      const applicationOpts = pulumi.mergeOptions(resourceOpts, {
        dependsOn: applicationDependsOn,
      })
      this.application = this.setupApplication(applicationOpts);
    }

    this.registerOutputs({
      application: this.application,
      fluentBitIRSA: this.fluentBitIRSA,
      logGroupApplicationLog: this.logGroupApplicationLog,
      logGroupDataplaneLog: this.logGroupDataplaneLog,
      logGroupHostLog: this.logGroupHostLog,
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
        }
      ],
    });

    return document.json;
  }


  setupIrsaForFluentBit(opts: pulumi.ResourceOptions): Irsa {
    return new Irsa(`${this.name}-fluentbit`, {
      identityProvidersArn: [...this.args.identityProvidersArn],
      issuerUrl: this.args.issuerUrl,
      k8sProvider: this.args.k8sProvider,
      namespace: this.args.namespace,
      serviceAccountName: this.args.serviceAccountName,
      policies: [this.getFluentBitPolicy()],
    }, opts);
  }



  private getFluentbitInputConfig() {

    return `[INPUT]
    Name tail
    Tag application.*
    Path /var/log/containers/*.log
    Exclude_Path /var/log/containers/cloudwatch-agent*, /var/log/containers/fluent-bit*, /var/log/containers/aws-node*, /var/log/containers/kube-proxy*
    Parser json_parser
    Mem_Buf_Limit 50MB
    Skip_Long_Lines On
    `;
  }

  private getFluentbitOutputConfig() {

    return pulumi.interpolate`[OUTPUT]
    Name cloudwatch_logs
    Match application.*
    region ${this.args.awsRegion}
    log_group_name ${this.logGroupApplicationLog?.name}
    log_stream_prefix app.
    log_retention_days ${this.logGroupApplicationLog?.retentionInDays}
    `;
  }

  private getFluentbitParserConfig() {

    return `[PARSER]
    Name json_parser
    Format json
    Time_Key time
    Time_Format %Y-%m-%dT%H:%M:%S.%LZ
    `
  }

  private getFluentbitFilterConfig() {
    return `[FILTER]
    Name kubernetes
    match application.*
    kube_tag_prefix application.var.log.containers.
    merge_log On
    merge_log_key log_processed
    k8s-logging.parser On
    labels Off
    annotations Off
    `
  }
  


  validateArgs(
    a: FluentbitArgs
  ): FluentbitArgs {
    return defaultsDeep({ ...a }, FluentbitDefaultArgs);
  }



  getApplicationSpec(): any {
    return {
      project: "default",
      source: {
        repoURL: "https://fluent.github.io/helm-charts",
        chart: "fluent-bit",
        targetRevision: "0.21.1",
        helm: {
          releaseName: "fluent-bit",
          parameters: [
            {
              name: "serviceAccount.create",
              value: "false"
            },
            {
              name: "serviceAccount.name",
              value: this.args.serviceAccountName
            },
            {
              name: "config.inputs",
              value: this.getFluentbitInputConfig()
            },
            {
              name: "config.outputs",
              value: this.getFluentbitOutputConfig()
            },
            {
              name: "config.customParsers",
              value: this.getFluentbitParserConfig()
            },
            {
              name: "config.filters",
              value: this.getFluentbitFilterConfig()
            }
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

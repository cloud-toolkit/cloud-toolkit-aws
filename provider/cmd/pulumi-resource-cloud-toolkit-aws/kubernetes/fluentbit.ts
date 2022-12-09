import * as pulumi from "@pulumi/pulumi";
import { Irsa } from "./irsa";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { FluentbitArgs, FluentbitDefaultArgs } from "./fluentbitArgs"

/**
 * Fluentbit is a component that deploy the Fluentbit component to send logs to AWS CloudWatch.
 */
export class Fluentbit extends ApplicationAddon<FluentbitArgs> {

  /**
  * The Namespace used to deploy the component.
  */
  public readonly namespace?: kubernetes.core.v1.Namespace;

  /**
  * The AWS CloudWatch LogGroup where application logs are stored.
  */
  public readonly logGroupApplicationLog?: aws.cloudwatch.LogGroup;

  /**
  * The AWS CloudWatch LogGroup where dataplane logs are stored.
  */
  public readonly logGroupDataplaneLog?: aws.cloudwatch.LogGroup;

  /**
  * The AWS CloudWatch LogGroup where Hosts logs are stored.
  */
  public readonly logGroupHostLog?: aws.cloudwatch.LogGroup;

  /**
  * IRSA for Fluentbit component
  */
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

    if (this.args.logging?.applications?.enabled || this.args.logging?.dataplane?.enabled || this.args.logging?.host?.enabled) {
      this.fluentBitIRSA = this.setupIrsaForFluentBit(resourceOpts);
      applicationDependsOn.push(this.fluentBitIRSA);

      if (this.args.logging?.applications?.enabled ) {
        this.logGroupApplicationLog = this.createApplicationLogGroup(resourceOpts);
        applicationDependsOn.push(this.logGroupApplicationLog);
      }

      if (this.args.logging?.dataplane?.enabled ) {
        this.logGroupDataplaneLog = this.createDataplaneLogGroup(resourceOpts);
        applicationDependsOn.push(this.logGroupDataplaneLog);
      }

      if (this.args.logging?.host?.enabled ) {
        this.logGroupHostLog = this.createHostLogGroup(resourceOpts);
        applicationDependsOn.push(this.logGroupHostLog);
      }
     
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

  /**
  * Creates an AWS CloudWatch LogGroup where application logs are stored.
  */
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

 /**
  * Creates an AWS CloudWatch LogGroup where host logs are stored.
  */
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

  /**
  * Creates an AWS CloudWatch LogGroup where dataplane logs are stored.
  */
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


  /**
  * Defines a policy to be able to send logs to CloudWatch
  */
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


  /**
  * Setup IRSA for Fluenbit component
  */
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

  /**
  * Setup input configuration for Fluentbit component
  */
  private getLogInputConfig() {
    return pulumi.interpolate`
[INPUT]
    Name tail
    Tag application.*
    Path /var/log/containers/*.log
    Exclude_Path /var/log/containers/cloudwatch-agent*, /var/log/containers/fluent-bit*, /var/log/containers/aws-node*, /var/log/containers/kube-proxy*
    Parser json_parser
    Mem_Buf_Limit 50MB
    Skip_Long_Lines On

[INPUT]
    Name systemd
    Tag dataplane.systemd.*
    Systemd_Filter _SYSTEMD_UNIT=docker.service
    Systemd_Filter _SYSTEMD_UNIT=kubelet.service
    Path /var/log/journal

[INPUT]
    Name tail
    Tag dataplane.tail.*
    Path /var/log/containers/aws-node*, /var/log/containers/kube-proxy*
    Parser json_parser
    Mem_Buf_Limit 50MB
    Skip_Long_Lines On

[INPUT]
    Name tail
    Tag host.dmesg
    Path /var/log/dmesg
    Parser syslog
    Mem_Buf_Limit 50MB
    Skip_Long_Lines On

[INPUT]
    Name tail
    Tag host.messages
    Path /var/log/messages
    Parser syslog
    Mem_Buf_Limit 50MB
    Skip_Long_Lines On

[INPUT]
    Name tail
    Tag host.secure
    Path /var/log/secure
    Parser syslog
    Mem_Buf_Limit 50MB
    Skip_Long_Lines On`
  }

  /**
  * Setup output configuration for application logs in Fluentbit component
  */
  private getApplicationLogOutputConfig() {
    return pulumi.interpolate`
[OUTPUT]
    Name cloudwatch_logs
    Match application.*
    region ${this.args.awsRegion}
    log_group_name ${this.logGroupApplicationLog?.name}
    log_stream_prefix app.
    log_retention_days ${this.logGroupApplicationLog?.retentionInDays}`
  }

  /**
  * Setup output configuration for dataplane logs in Fluentbit component
  */
  private getDataplaneLogOutputConfig() {
    return pulumi.interpolate`
[OUTPUT]
    Name cloudwatch_logs
    Match dataplane.*
    region ${this.args.awsRegion}
    log_group_name ${this.logGroupDataplaneLog?.name}
    log_stream_prefix data.
    log_retention_days ${this.logGroupDataplaneLog?.retentionInDays}
    extra_user_agent container-insights`
  }

  /**
  * Setup output configuration for host logs in Fluentbit component
  */
  private getHostLogOutputConfig() {
    return pulumi.interpolate`
[OUTPUT]
    Name cloudwatch_logs
    Match host.*
    region ${this.args.awsRegion}
    log_group_name ${this.logGroupHostLog?.name}
    log_stream_prefix host.
    log_retention_days ${this.logGroupHostLog?.retentionInDays}
    auto_create_group true
    extra_user_agent container-insights`;
  }

  /**
  * Define global output configuration in Fluentbit depending on what kind of logs are enabled.
  */
  private getLogOutputConfig() {

    let output = pulumi.interpolate``;

    if (this.args.logging?.applications?.enabled) {
      output = pulumi.concat(output, this.getApplicationLogOutputConfig());
    }

    if (this.args.logging?.dataplane?.enabled) {
      output = pulumi.concat(output, this.getDataplaneLogOutputConfig());
    }

    if (this.args.logging?.host?.enabled) {
      output = pulumi.concat(output, this.getHostLogOutputConfig());
    }
   
    return output;
  }

  /**
  * Setup a configuration for parsing logs in Fluentbit component
  */
  private getParserLogConfig() {

    return `
[PARSER]
    Name json_parser
    Format json
    Time_Key time
    Time_Format %Y-%m-%dT%H:%M:%S.%LZ

[PARSER]
    Name syslog
    Format regex
    Regex ^(?<time>[^ ]* {1,2}[^ ]* [^ ]*) (?<host>[^ ]*) (?<ident>[a-zA-Z0-9_\/\.\-]*)(?:\[(?<pid>[0-9]+)\])?(?:[^\:]*\:)? *(?<message>.*)$
    Time_Key time
    Time_Format %b %d %H:%M:%S`
  }

  /**
  * Setup a configuration for filtering logs in Fluentbit component
  */
  private getParserLogFilter() {
    return `
[FILTER]
    Name kubernetes
    match application.*
    kube_tag_prefix var.log.containers.
    merge_log On
    merge_log_key log_processed
    k8s-logging.parser On
    labels Off
    annotations Off
    
[FILTER]
    Name modify
    Match dataplane.systemd.*
    Rename _HOSTNAME hostname
    Rename _SYSTEMD_UNIT systemd_unit
    Rename MESSAGE message
    Remove_regex ^((?!hostname|systemd_unit|message).)*$

[FILTER]
    Name aws
    Match dataplane.*
    imds_version v1
    
[FILTER]
    Name aws
    Match host.*
    imds_version v1`;
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
              value: this.getLogInputConfig()
            },
            {
              name: "config.outputs",
              value: this.getLogOutputConfig()
            },
            {
              name: "config.filters",
              value: this.getParserLogFilter()
            },
            {
              name: "config.customParsers",
              value: this.getParserLogConfig()
            },
            {
              name: "logLevel",
              value: "debug"
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

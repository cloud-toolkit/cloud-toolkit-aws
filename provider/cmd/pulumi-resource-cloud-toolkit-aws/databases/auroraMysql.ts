import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as random from "@pulumi/random";
import defaultsDeep from "lodash.defaultsdeep";
import {
  AuroraMysqlArgs,
  defaultArgs,
  defaultPasswordLength,
} from "./auroraMysqlArgs";

export { AuroraMysqlArgs };

export class AuroraMysql extends pulumi.ComponentResource {
  /**
   * Confiration arguments for this component
   */
  private args: AuroraMysqlArgs;

  /**
   * Name assigned to this component
   */
  private name: string;

  private databaseEngine = "mysql";

  /**
   * The RDS Cluster
   */
  public readonly cluster: aws.rds.Cluster;

  /**
   * Random password generated for admin user
   */
  public readonly password: random.RandomPassword;

  /**
   * Component that protects and stores admin password in AWS
   */
  public readonly secret: aws.secretsmanager.Secret;

  /**
   * Component that protects and stores admin password in AWS
   */
  public readonly secretVersion: aws.secretsmanager.SecretVersion;

  /**
   * Cluster instances associated to the cluster
   */
  public readonly instances: aws.rds.ClusterInstance[] = [];

  /**
   * CloudWatch alarms that monitor the RDS Cluter
   */
  public readonly alarms: aws.cloudwatch.MetricAlarm[] = [];

  /**
   * SNS Topic used for CloudWatch alerts
   */
  public readonly topic?: aws.sns.Topic;

  /**
   * TopicSubscriptions to alerts by email
   */
  public readonly topicSubscriptions: aws.sns.TopicSubscription[] = [];

  /**
   * The SubnetGroup that reprents the list of subnets where the cluster is deployed
   */
  public readonly subnetGroup?: aws.rds.SubnetGroup;

  /**
   * The SecurityGroup associated to the cluster to manage traffic
   */
  public readonly securityGroup: aws.ec2.SecurityGroup;

  /**
   * The rules associated SecurityGroup to allow incoming traffic
   */
  public readonly securityGroupRule: aws.ec2.SecurityGroupRule;

  constructor(name: string, args: AuroraMysqlArgs, opts?: pulumi.ResourceOptions) {
    super("cloud-toolkit-aws:databases:AuroraMysql", name, args, opts);
    this.name = name;
    this.args = this.validateConfig(args);

    // Create ResourceOptions for child components
    const resourceOpts = pulumi.mergeOptions(opts, { parent: this });

    // Credentials
    this.password = this.setupPassword(resourceOpts);
    this.secret = this.setupSecret(resourceOpts);
    this.secretVersion = this.setupSecretVersion(resourceOpts);

    // Networking
    this.securityGroup = this.setupSecurityGroup(resourceOpts);
    this.securityGroupRule = this.setupSecurityGroupRule(resourceOpts);
    this.subnetGroup = this.setupSubnetGroup(resourceOpts);

    // Cluster
    this.cluster = this.setupCluster(resourceOpts);
    this.instances = this.setupInstances(resourceOpts);
    
    // Monitoring
    if (this.args.monitoring?.enabled) {
      this.topic = this.setupTopic(resourceOpts);
      this.topicSubscriptions = this.setupTopicSubscriptions(resourceOpts);
      this.alarms = this.setupAlarms(resourceOpts);
    }

    this.registerOutputs({
      password: this.password,
      secret: this.secret,
      secretVersion: this.secretVersion,
      cluster: this.cluster,
      instances: this.instances,
      topic: this.topic,
      topicSubscriptions: this.topicSubscriptions,
      alarms: this.alarms,
    })
  }

  private validateConfig(a: AuroraMysqlArgs): AuroraMysqlArgs {
    const args = defaultsDeep({ ...a }, defaultArgs);
    if (
      args.networking?.vpc !== undefined &&
      args.networking?.subnetIds === undefined
    ) {
      pulumi.log.error("You must select a VPC from networking section", this);
    }

    if (
      args.networking?.vpc === undefined &&
      args.networking?.subnetIds !== undefined
    ) {
      pulumi.log.error("You must select a set of subnets from networking section", this);
    }

    return args
  }

  /**
   * Setup random password
   */
  private setupPassword(opts: pulumi.ResourceOptions): random.RandomPassword {
    return new random.RandomPassword(
      `${this.name}`,
      {
        length:
          this.args.database?.passwordLength ||
          defaultPasswordLength,
        special: false,
      },
      opts
    );
  }

  private setupSecret(opts: pulumi.ResourceOptions): aws.secretsmanager.Secret {
    return new aws.secretsmanager.Secret(this.name, {}, opts);
  }

  /**
   * Setup the a SubnetGroup where the cluster is deployed
   */
  private setupSubnetGroup(opts: pulumi.ResourceOptions): aws.rds.SubnetGroup | undefined {
    if (this.args.networking?.subnetIds === undefined) {
      return undefined;
    }

    return new aws.rds.SubnetGroup(
      this.name,
      {
        subnetIds: this.args.networking?.subnetIds,
      },
      opts
    );
  }

  /**
   * Setup the Aurora Cluster
   */
  private setupCluster(opts: pulumi.ResourceOptions): aws.rds.Cluster {
    const logs = this.getEnabledLogs();
    return new aws.rds.Cluster(this.name, {
      backupRetentionPeriod: this.args.backup?.retentionDays || defaultArgs.backup.retentionDays,
      dbSubnetGroupName: this.subnetGroup?.name,
      clusterIdentifier: this.name,
      databaseName: this.args.database?.name,
      engine: aws.rds.AuroraMysqlEngine,
      engineMode: aws.rds.ProvisionedEngine,
      engineVersion: this.args.version,
      enabledCloudwatchLogsExports: logs,
      iamDatabaseAuthenticationEnabled: true,
      masterPassword: this.password.result,
      masterUsername: this.args.database?.username || defaultArgs.database.username,
      preferredBackupWindow: this.args.backup?.preferredWindow || defaultArgs.backup.preferredWindow,
      skipFinalSnapshot: true,
      vpcSecurityGroupIds: [this.securityGroup.id],
    }, opts);
  }

  /**
   * Setup secret version in AWS according to random password generated
   */
  private setupSecretVersion(opts: pulumi.ResourceOptions): aws.secretsmanager.SecretVersion {
    return new aws.secretsmanager.SecretVersion(this.name,
      {
        secretId: this.secret.arn,
        secretString: this.password.result,
      },
      opts,
    );
  }

  /**
   * Setup the Security Group and the Security Group Rules
   */
  private setupSecurityGroup(
    opts: pulumi.ResourceOptions
  ): aws.ec2.SecurityGroup {
    const securityGroup = new aws.ec2.SecurityGroup(
      this.name,
      {
        name: this.name,
        vpcId: this.args.networking?.vpc,
      },
      opts
    );

    return securityGroup;
  }

  private setupSecurityGroupRule(opts: pulumi.ResourceOptions): aws.ec2.SecurityGroupRule {
    return new aws.ec2.SecurityGroupRule(
      `${this.name}`,
      {
        type: "ingress",
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: this.args.networking?.allowedCidr || defaultArgs.networking.allowedCidr,
        securityGroupId: this.securityGroup.id,
      },
      opts
    )
  }

  /**
   * Setup Cluster instances
   */
  private setupInstances(opts: pulumi.ResourceOptions): aws.rds.ClusterInstance[] {
    const list : aws.rds.ClusterInstance[] = [];

    const instancesCount = this.args.instancesCount === undefined ? defaultArgs.instancesCount : this.args.instancesCount;
    for (let i = 0; i < instancesCount; i++) {
      list.push(new aws.rds.ClusterInstance(
        `${this.name}-${i}`,
        {
          identifier: `${this.name}-${i}`,
          clusterIdentifier: this.cluster.clusterIdentifier,
          instanceClass: this.args.instanceType || defaultArgs.instanceType,
          engine: aws.rds.AuroraMysqlEngine,
          engineVersion: this.args.version,
          publiclyAccessible: this.args.networking?.allowInternet || defaultArgs.networking.allowInternet,
          dbSubnetGroupName: this.subnetGroup?.name,
        },
        opts
      ));
    }
    return list;
  }

  private setupTopic(opts: pulumi.ResourceOptions): aws.sns.Topic {
    return new aws.sns.Topic(this.name, {}, opts);    
  }

  private setupTopicSubscriptions(opts: pulumi.ResourceOptions): aws.sns.TopicSubscription[] {
    const list: aws.sns.TopicSubscription[] = [];

    if (this.topic === undefined) {
      return list;
    }

    for (const email of this.args.monitoring?.emails || []) {
      list.push(new aws.sns.TopicSubscription(this.name, {
        topic: this.topic.arn,
        protocol: "email",
        endpoint: email,
      }, opts));
    }

    return list;
  }

  /**
   * Setup the alarms for the cluster
   */
  private setupAlarms(opts: pulumi.ResourceOptions): aws.cloudwatch.MetricAlarm[] {
    const list: aws.cloudwatch.MetricAlarm[] = [];

    const alarmsData = [
      {
        name: "cpu-utilization",
        alarmDescription: "Average cluster CPU utilization over last 10 minutes too high",
        comparisonOperator: "GreaterThanThreshold",
        metricName: "CPUUtilization",
        threshold: 80,
      },
      {
        name: "freeable-memory",
        alarmDescription: "Average cluster freeable memory too low",
        comparisonOperator: "LessThanThreshold",
        metricName: "FreeableMemory",
        threshold: 64000000,
      },
      {
        name: "write-latency",
        alarmDescription: "Average cluster write latency over last 10 minutes too high",
        comparisonOperator: "GreaterThanThreshold",
        metricName: "WriteLatency",
        threshold: 0.01,
      },
      {
        name: "read-latency",
        alarmDescription: "Average cluster read latency over last 10 minutes too high",
        comparisonOperator: "GreaterThanThreshold",
        metricName: "ReadLatency",
        threshold: 0.01,
      }
    ];

    const actions = [];
    if (this.topic !== undefined) {
        actions.push(this.topic)
    }

    for (const alarmData of alarmsData) {
      list.push(new aws.cloudwatch.MetricAlarm(
        `${this.name}-${alarmData.name}`,
        {
          comparisonOperator: alarmData.comparisonOperator,
          evaluationPeriods: 1,
          metricName: alarmData.metricName,
          namespace: "AWS/RDS",
          period: 600,
          statistic: "Average",
          threshold: alarmData.threshold,
          alarmDescription: alarmData.alarmDescription,
          dimensions: {
            DBClusterIdentifier: this.cluster.id,
          },
          alarmActions: actions,
          okActions: actions,
        },
        opts
      ));
    }

    return list;
  }

  /**
   * Returns the list of log type to be used when configuring cluster integration with CloudWatch
   */
  private getEnabledLogs(): string[] {
    const logs = [];
    if (this.args.logging?.audit || defaultArgs.logging.audit) {
      logs.push("audit");
    }
    if (this.args.logging?.error || defaultArgs.logging.error) {
      logs.push("error");
    }
    if (this.args.logging?.general || defaultArgs.logging.general) {
      logs.push("general");
    }
    if (this.args.logging?.slowquery || defaultArgs.logging.slowquery) {
      logs.push("slowquery");
    }
    return logs;
  }
}

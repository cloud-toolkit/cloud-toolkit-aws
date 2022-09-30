import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {
  MysqlArgs,
  validateConfig,
  defaultSize,
  defaultStorage,
  defaultDatabaseParams,
} from "./mysqlArgs";

import * as random from "@pulumi/random";

export { MysqlArgs };
/**
 * Cloud Toolkit component for Mysql instances. 
 *
 * @extends {pulumi.ComponentResource}
 */
export class Mysql extends pulumi.ComponentResource {
  /**
   * Confiration arguments for this component
   * 
   * @type {MysqlArgs}
   */
  private args: MysqlArgs;

  /**
   * Name assigned to this component
   * 
   * @type {string}
   */
  private name: string;

  /**
   * @type {string}
   */
  private databaseEngine = "mysql";

  /**
   * Random password generated for admin user
   * 
   * @type {string}
   */
  public readonly instancePassword: random.RandomPassword;

  /**
   *Underlying database instance for this component
   * 
   * @type {aws.rds.Instance}
   */
  public readonly instance: aws.rds.Instance;

  /**
   * Security Group attached to this database instance
   * 
   * @type {aws.ec2.SecurityGroup}
   */
  public readonly securityGroup: aws.ec2.SecurityGroup;

  /**
   * Security rules to allow connections to this databse instance
   * 
   * @type {aws.ec2.SecurityGroupRule[]}
   */
  public readonly ingressSecurityGroupRules: aws.ec2.SecurityGroupRule[] = [];

  /**
   * Set of subnets in which database instance will be deployed
   * 
   * @type {aws.rds.SubnetGroup}
   */
  public readonly subnetGroup: aws.rds.SubnetGroup | undefined;

  /**
   * Component that protects and stores admin password in AWS
   * 
   * @type {aws.secretsmanager.Secret}
   */
  public readonly secret: aws.secretsmanager.Secret;

  /**
   * 
   * Component that updates secrets in AWS
   * 
   * @type {aws.secretsmanager.SecretVersion}
   */
  public readonly secretVersion: aws.secretsmanager.SecretVersion;

  /**
   * constructor.
   *
   * @param {string} name
   * @param {DatabaseArgs} args
   * @param {pulumi.ResourceOptions} opts
   */
  constructor(name: string, args: MysqlArgs, opts?: pulumi.ResourceOptions) {
    super("cloudToolkit:aws:databases:myqsl", name, args, opts);
    this.name = name;
    this.args = validateConfig(args);

    // Create ResourceOptions for child components
    const resourceOpts = pulumi.mergeOptions(opts, { parent: this });

    //Setup single instance
    this.instancePassword = this.setupInstancePassword(resourceOpts);
    this.secret = this.setupInstanceSecret(resourceOpts);
    this.secretVersion = this.setupInstanceSecretVersion(resourceOpts);

    this.subnetGroup = this.setupSubnetGroup(resourceOpts);
    this.securityGroup = this.setupSecurityGroup(resourceOpts);

    this.instance = this.setupSingleInstance(resourceOpts);
  }

  /**
   * Setup our database instance based on configuration arguments
   *
   * @param {pulumi.ResourceOptions}
   *
   * @returns {aws.rds.Instance}
   */
  private setupSingleInstance(opts: pulumi.ResourceOptions): aws.rds.Instance {
    const dependencies: any = [];

    dependencies.push(this.securityGroup);
    dependencies.push(this.secretVersion);

    if (this.subnetGroup !== undefined) {
      dependencies.push(this.subnetGroup);
    }

    const customOpts = pulumi.mergeOptions(opts, {
      dependsOn: dependencies,
    });

    const storage = this.args.storage || defaultStorage;

    return new aws.rds.Instance(
      `${this.name}-instance`,
      {
        identifier: this.name,
        dbName: this.args.database.name,
        password: this.instancePassword.result,
        username: this.args.database.username,
        engine: this.databaseEngine,
        engineVersion: this.args.version,
        instanceClass: this.args.instance || defaultSize,
        allocatedStorage: storage.size,
        storageType: storage.type,
        backupRetentionPeriod: this.args.backup?.retentionDays,
        backupWindow: this.args.backup?.preferredWindow,
        vpcSecurityGroupIds: [this.securityGroup.id],
        skipFinalSnapshot: true,
        dbSubnetGroupName: this.subnetGroup?.name,
      },
      customOpts
    );
  }

  /**
   * Setup the a SubnetGroup in which deploy the database instance
   *
   * @param {pulumi.ResourceOptions}
   *
   * @returns {aws.ec2.SubnetGroup}
   */
  private setupSubnetGroup(
    opts: pulumi.ResourceOptions
  ): aws.rds.SubnetGroup | undefined {
    if (this.args.networking?.subnetIds === undefined) {
      return undefined;
    }

    return new aws.rds.SubnetGroup(
      `${this.name}-subnetgroup`,
      {
        subnetIds: this.args.networking?.subnetIds,
      },
      opts
    );
  }

  /**
   * Setup the Security Group and the Security Group Rules
   *
   * @param {pulumi.ResourceOptions}
   *
   * @returns {aws.ec2.SecurityGroup}
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

    if (
      this.args.networking !== undefined &&
      this.args.networking.allowedCidr !== undefined
    ) {
      this.ingressSecurityGroupRules.push(
        new aws.ec2.SecurityGroupRule(
          `${this.name}-ingress-firewall`,
          {
            type: "ingress",
            protocol: "-1",
            fromPort: 0,
            toPort: 0,
            cidrBlocks: this.args.networking.allowedCidr,
            securityGroupId: securityGroup.id,
          },
          opts
        )
      );
    }

    return securityGroup;
  }

  /**
   * Setup the secrets for storing instance credentials
   *
   * @param {pulumi.ResourceOptions}
   *
   * @returns {aws.secretsmanager.Secret}
   */

  private setupInstanceSecret(
    opts: pulumi.ResourceOptions
  ): aws.secretsmanager.Secret {
    return new aws.secretsmanager.Secret(`${this.name}-secret`, {}, opts);
  }

  /**
   * Setup random password
   *
   * @param {pulumi.ResourceOptions}
   *
   * @returns {random.RandomPassword}
   */
  private setupInstancePassword(
    opts: pulumi.ResourceOptions
  ): random.RandomPassword {
    return new random.RandomPassword(
      `${this.name}-instancePassword`,
      {
        length:
          this.args.database.passwordLength ||
          defaultDatabaseParams.passwordLength,
        special: false,
      },
      opts
    );
  }

  /**
   * Setup secret version in AWS according to random password generated
   *
   * @param {pulumi.ResourceOptions}
   *
   * @returns {random.RandomPassword}
   */
  private setupInstanceSecretVersion(
    opts: pulumi.ResourceOptions
  ): aws.secretsmanager.SecretVersion {
    const customOpts = pulumi.mergeOptions(opts, {
      dependsOn: [this.secret, this.instancePassword],
    });

    return new aws.secretsmanager.SecretVersion(
      `${this.name}-secretversion`,
      {
        secretId: this.secret.arn,
        secretString: this.instancePassword.result,
      },
      customOpts
    );
  }
}

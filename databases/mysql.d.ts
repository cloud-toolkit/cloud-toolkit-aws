import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as enums from "../types/enums";
import * as pulumiAws from "@pulumi/aws";
import * as pulumiRandom from "@pulumi/random";
/**
 * Cloud Toolkit component for Mysql instances.
 */
export declare class Mysql extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Mysql.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Mysql;
    /**
     * Security rules to allow connections to this databse instance
     */
    readonly ingressSecurityGroupRules: pulumi.Output<pulumiAws.ec2.SecurityGroupRule[]>;
    /**
     * Underlying database instance for this component
     */
    readonly instance: pulumi.Output<pulumiAws.rds.Instance>;
    /**
     * Random password generated for admin user
     */
    readonly instancePassword: pulumi.Output<pulumiRandom.RandomPassword>;
    /**
     * Component that protects and stores admin password in AWS
     */
    readonly secret: pulumi.Output<pulumiAws.secretsmanager.Secret>;
    /**
     *
     * Component that updates secrets in AWS
     */
    readonly secretVersion: pulumi.Output<pulumiAws.secretsmanager.SecretVersion>;
    /**
     * Security Group attached to this database instance
     */
    readonly securityGroup: pulumi.Output<pulumiAws.ec2.SecurityGroup>;
    /**
     * Set of subnets in which database instance will be deployed
     */
    readonly subnetGroup: pulumi.Output<pulumiAws.rds.SubnetGroup | undefined>;
    /**
     * Create a Mysql resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: MysqlArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Mysql resource.
 */
export interface MysqlArgs {
    /**
     * Backup configuration parameters for the database instance
     */
    backup?: pulumi.Input<inputs.databases.MysqlBackupArgsArgs>;
    /**
     * Configuration parameters for the database instance
     */
    database: pulumi.Input<inputs.databases.MysqlDatabaseArgsArgs>;
    /**
     * Instance type to run the database instance
     */
    instance?: pulumi.Input<string>;
    /**
     * Network configuration parameters for the database instance
     */
    networking?: pulumi.Input<inputs.databases.MysqlNetworkingArgsArgs>;
    /**
     * Storage configuration parameters for the database instance
     */
    storage?: pulumi.Input<inputs.databases.MysqlStorageArgsArgs>;
    /**
     * Version for database instance
     */
    version: pulumi.Input<enums.databases.MysqlVersion>;
}

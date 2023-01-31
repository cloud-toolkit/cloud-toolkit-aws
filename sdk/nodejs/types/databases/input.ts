// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../../types/input";
import * as outputs from "../../types/output";
import * as enums from "../../types/enums";
import * as utilities from "../../utilities";

import * as pulumiAws from "@pulumi/aws";
import * as pulumiKubernetes from "@pulumi/kubernetes";

export interface AuroraMysqlBackupArgsArgs {
    /**
     * Time window in which backups should be taken
     */
    preferredWindow?: pulumi.Input<string>;
    /**
     * Retention days for backups
     */
    retentionDays?: pulumi.Input<number>;
}

export interface AuroraMysqlDatabaseArgsArgs {
    /**
     * The name of the database to create when the DB instance is created
     */
    name?: pulumi.Input<string>;
    /**
     * Password length to login in the database instance
     */
    passwordLength?: pulumi.Input<number>;
    /**
     * Username for database admin user
     */
    username?: pulumi.Input<string>;
}

export interface AuroraMysqlLoggingArgsArgs {
    audit?: pulumi.Input<boolean>;
    error?: pulumi.Input<boolean>;
    general?: pulumi.Input<boolean>;
    slowquery?: pulumi.Input<boolean>;
}

export interface AuroraMysqlMonitoringArgsArgs {
    /**
     * Emails that will receive the alerts
     */
    emails?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Enable cluster alerting with CloudWatch
     */
    enabled?: pulumi.Input<boolean>;
}

export interface AuroraMysqlNetworkingArgsArgs {
    /**
     * Allow traffic from Internet
     */
    allowInternet?: pulumi.Input<boolean>;
    /**
     * Allowed CIDRs that connect to the database instance
     */
    allowedCidr?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Subnets belonging to a Virtual Private Cloud where cluster must be deployed
     */
    subnetIds?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Virtual Private Cloud where database instance must be deployed
     */
    vpc?: pulumi.Input<string>;
}

export interface MysqlBackupArgsArgs {
    /**
     * Time window in which backups should be taken
     */
    preferredWindow?: pulumi.Input<string>;
    /**
     * Retention days for backups
     */
    retentionDays?: pulumi.Input<number>;
}

export interface MysqlDatabaseArgsArgs {
    /**
     * The name of the database to create when the DB instance is created
     */
    name: pulumi.Input<string>;
    /**
     * Password length to login in the database instance
     */
    passwordLength?: pulumi.Input<number>;
    /**
     * Username for database admin user
     */
    username: pulumi.Input<string>;
}

export interface MysqlNetworkingArgsArgs {
    /**
     * Allowed CIDRs that connect to the database instance
     */
    allowedCidr?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Subnets belonging to a Virtual Private Cloud where database instance must be deployed
     */
    subnetIds?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Virtual Private Cloud where database instance must be deployed
     */
    vpc?: pulumi.Input<string>;
}

export interface MysqlStorageArgsArgs {
    /**
     * Storage size allocated for database instance
     */
    size?: pulumi.Input<number>;
    /**
     * Storage type class for database instance
     */
    type?: pulumi.Input<enums.databases.MysqlStorageTypeArgs>;
}

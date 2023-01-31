import * as pulumi from "@pulumi/pulumi";

export interface AuroraMysqlArgs {
  /**
   * Version for database
  */
  version?: AuroraMysqlVersion;
 
  /**
  * Configuration parameters for the database
  */
  database?: AuroraMysqlDatabaseArgs;
 
  /**
   * The instance type for the cluster
   */
  instanceType?: pulumi.Input<string>;
 
  /**
   * The number of instances to be created for Aurora cluster
   */
  instancesCount?: number;
 
   /**
   * Logging configuration parameters for Aurora cluster
   */
   logging?: AuroraMysqlLoggingArgs;

   /**
   * Monitoring configuration parameters for Aurora cluster
   */
   monitoring?: AuroraMysqlMonitoringArgs;
 
   /**
   * Networking configuration parameters for Aurora cluster
   */
   networking?: AuroraMysqlNetworkingArgs;
 
   /**
   * Backup configuration parameters for Aurora cluster
   */
   backup?: AuroraMysqlBackupArgs;
}

/**
* Set of allowed versions for the database
*/
export enum AuroraMysqlVersion {
    V8_0 = "8.0",
    V5_7 = "5.7",
    V5_6 = "5.6"
}

/**
* Configuration parameters for the database administrators access
*/
export interface AuroraMysqlDatabaseArgs {
    /**
    * The name of the database to create when the DB instance is created
    */
    name?: pulumi.Input<string>;

    /**
    * Username for database admin user
    */
    username?: pulumi.Input<string>;

    /**
    * Password length to login in the database
    */
    passwordLength?: number;
}

/**
* Arguments to configure backups
*/
export interface AuroraMysqlBackupArgs {
  /**
  * Time window in which backups should be taken
  */
  preferredWindow?: pulumi.Input<string>; 

  /**
  * Retention days for backups
  */
  retentionDays?: number;
}

/**
* Configure cluster logging 
*/
export interface AuroraMysqlLoggingArgs {
  /**
   * Enable audit logging
   */
  audit?: boolean;

  /**
   * Enable error logging
   */
  error?: boolean;

  /**
   * Enable general logging
   */
  general?: boolean;

  /**
   * Enable slowquery logging
   */
  slowquery?: boolean;
}

/**
* Configure cluster monitoring
*/
export interface AuroraMysqlMonitoringArgs {
  /**
   * Enable cluster alerting with CloudWatch
   */
  enabled?: boolean;

  /**
   * Emails that will receive the alerts
   */
  emails?: pulumi.Input<string>[];   
}

/**
 * Configure cluster networking
 */
export interface AuroraMysqlNetworkingArgs {
  /**
  * Allowed CIDRs that connect to the cluster
  */
  allowedCidr?: pulumi.Input<string>[];   

  /**
   * Allow traffic from Internet
   */
  allowInternet?: boolean;

  /**
  * Subnets belonging to a Virtual Private Cloud where cluster must be deployed
  */
  subnetIds?: pulumi.Input<string>[];

  /**
  * Virtual Private Cloud where instances must be deployed
  */
  vpc?: pulumi.Input<string>
}

export const defaultbackupConfig = {
};
export const defaultArgs = {
    backup: {
      preferredWindow: "23:00-01:00",
      retentionDays: 5,
    },
    database: {
      name: "data",
      username: "root",
      passwordLength: 14,
    },
    instanceType: "db.t3.medium",
    instancesCount: 2,
    logging: {
      audit: false,
      error: true,
      general: false,
      slowquery: true,
    },
    monitoring: {
        enabled: false,
        emails: [],
    },
    networking: {
        allowedCidr: [
            "0.0.0.0/0",            
        ],
        allowInternet: false,
    },
    version: AuroraMysqlVersion.V8_0,
};
export const defaultPasswordLength = 14; 
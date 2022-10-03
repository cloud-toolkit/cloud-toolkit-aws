import defaultsDeep from "lodash.defaultsdeep";
import * as pulumi from "@pulumi/pulumi";

/**
* Arguments to deploy a database instance
*/
export interface MysqlArgs {
/**
 * Instance type to run the database instance
 */
  instance?: pulumi.Input<string>;

/**
 * Version for database instance
*/
  version: pulumi.Input<string>;

/**
* Configuration parameters for the database instance
*/
  database: MysqlDatabaseArgs;

/**
* Storage configuration parameters for the database instance
*/
  storage?: MysqlStorageArgs;

/**
* Network configuration parameters for the database instance
*/
  networking?: MysqlNetworkingArgs;

/**
* Backup configuration parameters for the database instance
*/
  backup?: MysqlBackupArgs;
}

/**
* Backup configuration parameters for the database instance
*/
export enum MysqlVersionArgs {
  V8_0 = "8.0",
  V5_7 = "5.7"
}


//const MysqlVersionArgs = new Set(['8.0', '5.7']);
/**
* Backup configuration parameters for the database instance
*/
export interface MysqlDatabaseArgs {
/**
* The name of the database to create when the DB instance is created
*/
  name: pulumi.Input<string>;

/**
* Username for database admin user
*/
  username: pulumi.Input<string>;

/**
* Password length to login in the database instance
*/
  passwordLength?: number;
}

/**
* Enforce a specified minimum password length for admin user
*/
export const MIN_PASSWORD_LENGTH = 10;

/**
* Arguments to configure backups
*/
export interface MysqlBackupArgs {
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
* Configuration arguments for database storage
*/
export interface MysqlStorageArgs {
/**
* Storage size allocated for database instance
*/
  size?: number;

/**
* Storage type class for database instance
*/
  type?: MysqlStorageTypeArgs;
}

/**
* Set of storage type classes for database instance
*/
export enum MysqlStorageTypeArgs {
  standard = "standard",
  io1 = "io1",
  gp2 = "gp2",
}

/**
* Networking parameters for database instance
*/
export interface MysqlNetworkingArgs {
/**
* Virtual Private Cloud where database instance must be deployed
*/
  vpc?: pulumi.Input<string>;

/**
* Subnets belonging to a Virtual Private Cloud where database instance must be deployed
*/
  subnetIds?: pulumi.Input<string>[];

/**
* Allowed CIDRs that connect to the database instance
*/
  allowedCidr?: pulumi.Input<string>[];
}

export const defaultDatabaseParams = {
  passwordLength: MIN_PASSWORD_LENGTH,
};

export const defaultSize = "db.t3.small";
export const defaultbackupConfig = {
  preferredWindow: "23:00-01:00",
  retentionDays: 5,
};
export const defaultStorage = {
  size: 20,
  type: MysqlStorageTypeArgs.standard,
};

export const defaultConfig = {
  instance: defaultSize,
  backup: defaultbackupConfig,
  database: defaultDatabaseParams,
  storage: defaultStorage,
};

export function validateConfig(c: MysqlArgs): MysqlArgs {
  const config = defaultsDeep({ ...c }, defaultConfig);


  //This allows to either accept enum key (code) or enum value (yaml).
  // if (
  //   config.version === undefined ||
  //   MysqlVersionArgs.has(config.version) === false
  //   ) {
  //   throw Error(
  //     "You must select one allowed engine version for Database: " +
  //       MysqlVersionArgs.entries()
  //   );
  // }

  if (config.database.name === undefined) {
    throw Error(
      "You must provide the following parameter for database: database name"
    );
  }

  if (config.database.username === undefined) {
    throw Error(
      "You must provide the following parameter for database: username"
    );
  }

  if (
    config.networking?.vpc !== undefined &&
    config.networking?.subnetIds === undefined
  ) {
    throw Error("You must select a VPC from networking section");
  }

  if (
    config.networking?.vpc === undefined &&
    config.networking?.subnetIds !== undefined
  ) {
    throw Error("You must select a set of subnets from networking section");
  }

  if (
    config.database.passwordLength !== undefined &&
    config.database.passwordLength < MIN_PASSWORD_LENGTH
  ) {
    throw Error(
      "You must select a password length greater or equal than" +
        MIN_PASSWORD_LENGTH
    );
  }

  //Verifying minimum and maximum storage for different storage types

  if (
    config.storage.type === MysqlStorageTypeArgs.gp2 &&
    (config.storage.size < 20 || config.storage.size > 65536)
  ) {
    throw Error("You must select a storage size between 20 GB and 64TB");
  }
  if (
    config.storage.type === MysqlStorageTypeArgs.io1 &&
    (config.storage.size < 100 || config.storage.size > 65536)
  ) {
    throw Error("You must select a storage size between 120 GB and 64TB");
  }
  if (
    config.storage.type === MysqlStorageTypeArgs.standard &&
    (config.storage.size < 5 || config.storage.size > 3072)
  ) {
    throw Error("You must select a storage size between 5 GB and 3072GB");
  }

  return config;
}

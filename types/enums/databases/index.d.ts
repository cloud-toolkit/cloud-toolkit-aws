export declare const MysqlStorageTypeArgs: {
    readonly Standard: "standard";
    readonly Io1: "io1";
    readonly Gp2: "gp2";
};
/**
 * Set of storage type classes for database instance
 */
export declare type MysqlStorageTypeArgs = (typeof MysqlStorageTypeArgs)[keyof typeof MysqlStorageTypeArgs];
export declare const MysqlVersion: {
    readonly V8_0: "8.0";
    readonly V5_7: "5.7";
};
/**
 * Set of allowed versions for the database instance
 */
export declare type MysqlVersion = (typeof MysqlVersion)[keyof typeof MysqlVersion];

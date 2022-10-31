import * as pulumi from "@pulumi/pulumi";
import { Irsa } from "./irsa";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface LoggingItemArgs {
    enabled: boolean;
    dataRetention: number;
}

export interface MetricsOptionsArgs {
    enabled: boolean;
    dataRetention: number;
}

export interface LoggingOptionsArgs {
    applications: LoggingItemArgs;
    dataplane: LoggingItemArgs;
    host: LoggingItemArgs;
}

export interface AdotOperatorArgs extends IrsaApplicationAddonArgs {
    logging?: LoggingOptionsArgs;
    metrics?: MetricsOptionsArgs;
    clusterName: pulumi.Input<string>;
    awsRegion: pulumi.Input<string>;
}

export const defaultLoggingEnabled = true;
export const defaultLoggingDataRetention = 7;

export const defaultMetricsEnabled = true;
export const defaultMetricsDataRetention = 7;

export const AdotOperatorDefaultArgs = {
    logging: {
        applications: {
            enabled: defaultLoggingEnabled,
            dataRetention: defaultLoggingDataRetention,
        },
        dataPlane: {
            enabled: defaultLoggingEnabled,
            dataRetention: defaultLoggingDataRetention,
        },
        host: {
            enabled: defaultLoggingEnabled,
            dataRetention: defaultLoggingDataRetention,
        },
    },
    metrics: {
        enabled: defaultMetricsEnabled,
        dataRetention: defaultMetricsDataRetention,
    },
};

import * as pulumi from "@pulumi/pulumi";
import { Irsa } from "./irsa";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface AdotApplicationLoggingItemArgs {
  /**
   * Enable logging.
   */
  enabled: boolean;

  /**
   * Data retention expressed in days.
   */
  dataRetention: number;
}

export interface AdotApplicationMetricsArgs {
  /**
   * Enable metrics.
   */
  enabled: boolean;

  /**
   * Data retention expressed in days.
   */
  dataRetention: number;
}

export interface AdotApplicationLoggingArgs {
  /**
   * Configure applications logging.
   */
  applications?: AdotApplicationLoggingItemArgs;

  /**
   * Configure data plane logging.
   */
  dataplane?: AdotApplicationLoggingItemArgs;

  /**
   * Configure host logging.
   */
  host?: AdotApplicationLoggingItemArgs;
}

export interface AdotApplicationArgs extends IrsaApplicationAddonArgs {
  /**
   * Configure logging.
   */
  logging?: AdotApplicationLoggingArgs;

  /**
   * Configure metrics.
   */
  metrics?: AdotApplicationMetricsArgs;

  /**
   * The cluster name.
   */
  clusterName: pulumi.Input<string>;

  /**
   * The AWS Region.
   */
  awsRegion: pulumi.Input<string>;
}

export const defaultLoggingEnabled = true;
export const defaultLoggingDataRetention = 7;

export const defaultMetricsEnabled = true;
export const defaultMetricsDataRetention = 7;

export const AdotApplicationDefaultArgs = {
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

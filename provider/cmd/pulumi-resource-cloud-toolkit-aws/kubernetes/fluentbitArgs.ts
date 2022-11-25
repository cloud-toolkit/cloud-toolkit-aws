import * as pulumi from "@pulumi/pulumi";
import { Irsa } from "./irsa";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface FluentbitLoggingItemArgs {
  /**
   * Data retention expressed in days.
   */
  dataRetention: number;
}

export interface FluentbitLoggingArgs {
  /**
   * Enable logging.
   */
  enabled: boolean;

  /**
   * Configure applications logging.
   */
  applications?: FluentbitLoggingItemArgs;

  /**
   * Configure data plane logging.
   */
  dataplane?: FluentbitLoggingItemArgs;

  /**
   * Configure host logging.
   */
  host?: FluentbitLoggingItemArgs;
}

export interface FluentbitArgs extends IrsaApplicationAddonArgs {
  /**
   * Configure logging.
   */
  logging?: FluentbitLoggingArgs;

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


export const FluentbitDefaultArgs = {
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
};

import * as pulumi from "@pulumi/pulumi";
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface FluentbitLoggingItemArgs {
  /**
   * Data retention expressed in days.
   */
  dataRetention?: number;

  /**
   * Enable logging.
   */
  enabled: boolean;

}

export interface FluentbitLoggingArgs {

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

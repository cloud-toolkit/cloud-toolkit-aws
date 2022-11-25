import * as pulumi from "@pulumi/pulumi";
import { Irsa } from "./irsa";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface AdotApplicationLoggingItemArgs {
  /**
   * Data retention expressed in days.
   */
  dataRetention: number;
}

export interface AdotApplicationMetricsArgs {
  /**
   * Enable metrics.
   */
  enabled?: boolean;

  /**
   * Data retention expressed in days.
   */
  dataRetention?: number;
}


export interface AdotApplicationArgs extends IrsaApplicationAddonArgs {

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

export const defaultMetricsEnabled = true;
export const defaultMetricsDataRetention = 7;

export const AdotApplicationDefaultArgs = {
  metrics: {
    enabled: defaultMetricsEnabled,
    dataRetention: defaultMetricsDataRetention,
  },
};

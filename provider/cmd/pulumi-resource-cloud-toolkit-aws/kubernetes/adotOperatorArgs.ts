import * as pulumi from "@pulumi/pulumi";
import { Irsa } from "./irsa";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import defaultsDeep from "lodash.defaultsdeep";
import { ApplicationAddon } from "./applicationAddon"
import { IrsaApplicationAddonArgs } from "./applicationAddonArgs";

export interface AdotOperatorArgs extends IrsaApplicationAddonArgs {
    clusterName: pulumi.Input<string>;
    awsRegion: pulumi.Input<string>;
}

export const AdotOperatorDefaultArgs = {
};

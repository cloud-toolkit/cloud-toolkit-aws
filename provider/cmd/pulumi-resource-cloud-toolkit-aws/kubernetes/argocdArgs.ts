import * as k8s from "@pulumi/kubernetes";
import { ApplicationAddonArgs } from "./applicationAddonArgs";

export interface ArgoCDArgs extends ApplicationAddonArgs {
  hostname?: string;
}

export const defaultArgs = {};

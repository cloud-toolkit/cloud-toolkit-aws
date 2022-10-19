import * as k8s from "@pulumi/kubernetes";
import { ApplicationAddonArgs } from "./applicationAddonArgs";

export interface ArgoCDArgs extends ApplicationAddonArgs {
  /**
   * The hostname to be used to expose ArgoCD with an Ingress.
   */
  hostname?: string;
}

export const defaultArgs = {};

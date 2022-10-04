import * as k8s from "@pulumi/kubernetes";

export interface ApplicationAddonArgs {
  k8sProvider: k8s.Provider;
  name: string;
  namespace: string;
  createNamespace?: boolean;
}

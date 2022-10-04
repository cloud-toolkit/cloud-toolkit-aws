import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

export interface ClusterAddonsArgs {
  k8sProvider: kubernetes.Provider;
  ingress: ClusterAddonsIngressArgs;
}

export interface ClusterAddonsIngressArgs {
  enabled?: boolean;
  admin?: ClusterAddonsIngressItemArgs;
  global?: ClusterAddonsIngressItemArgs;
}

export interface ClusterAddonsIngressItemArgs {
  public?: boolean;
  whitelist?: pulumi.Input<string>[];
}

export const defaultClusterAddonsArgs = {
  ingress: {
    enabled: true,
    admin: {
      public: true,
      whitelist: ["0.0.0.0/0"],
    },
    global: {
      public: true,
      whitelist: ["0.0.0.0/0"],
    }
  }
};

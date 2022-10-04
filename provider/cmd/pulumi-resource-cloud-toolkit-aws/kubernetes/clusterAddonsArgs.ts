import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";

export interface ClusterAddonsArgs {
  k8sProvider: kubernetes.Provider;
  identityProvidersArn: pulumi.Input<string>[];
  issuerUrl: pulumi.Input<string>;
  domain: string;
  ingress?: ClusterAddonsIngressArgs;
  zones: aws.route53.Zone[];
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

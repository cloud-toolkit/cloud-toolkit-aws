import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";

export interface ClusterAddonsArgs {
  /**
   * The Pulumi provider used for Kubernetes resources.
   */
  k8sProvider: kubernetes.Provider;

  /**
   * The OIDC Identity Provider arn.
   */
  identityProvidersArn: pulumi.Input<string>[];

  /**
   * The OIDC Identity Provider url.
   */
  issuerUrl: pulumi.Input<string>;

  /**
   * The domain used by the cluster.
   */
  domain: string;

  /**
   * The configuration for Ingress Controller.
   */
  ingress?: ClusterAddonsIngressArgs;

  /**
   * The main DNS Zone id.
   */
  zoneId: pulumi.Input<string>;

  /**
   * The list of DNS Zone arns to be used by CertManager and ExternalDNS.
   */
  zoneArns: pulumi.Input<string>[];
}

export interface ClusterAddonsIngressArgs {
  /**
   * Enable the IngressControllers.
   */
  enabled?: boolean;

  /**
   * Configure the admin IngressController.
   */
  admin?: ClusterAddonsIngressItemArgs;

  /**
   * Configure the global IngressController.
   */
  global?: ClusterAddonsIngressItemArgs;
}

export interface ClusterAddonsIngressItemArgs {
  /**
   * Use a public Load Balancer to expose the IngressController.
   */
  public?: boolean;

  /**
   * Set a whitelist to access the IngressController.
   */
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

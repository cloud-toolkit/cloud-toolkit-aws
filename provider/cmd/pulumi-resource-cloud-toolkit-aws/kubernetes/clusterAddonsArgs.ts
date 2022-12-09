import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import { AdotApplicationMetricsArgs } from "./adotApplicationArgs";
import { FluentbitLoggingArgs  } from "./fluentbitArgs";
import * as aws from "@pulumi/aws";

export interface ClusterAddonsArgs {
  /**
   * The Pulumi provider used for Kubernetes resources.
   */
  k8sProvider: kubernetes.Provider;

  /**
   * The EKS Cluster name.
   */
  clusterName: pulumi.Input<string>;

  /**
   * The OIDC Identity Provider arn.
   */
  identityProvidersArn: pulumi.Input<string>[];

  /**
   * The OIDC Identity Provider url.
   */
  issuerUrl: pulumi.Input<string>;

  /**
   * Configure the cluster observability for logging.
   */
  logging?: FluentbitLoggingArgs;

  /**
   * Configure the cluster observability for metrics.
   */
  metrics?: AdotApplicationMetricsArgs;

  /**
   * The configuration for Ingress Controller.
   */
  ingress?: ClusterAddonsIngressArgs;
}

export interface ClusterAddonsIngressArgs {
  /**
   * Configure the admin IngressController.
   */
  admin?: ClusterAddonsIngressItemArgs;

  /**
   * Configure the default IngressController.
   */
  default?: ClusterAddonsIngressItemArgs;
}

export interface ClusterAddonsIngressItemArgs {
  /**
   * Use a public Load Balancer to expose the IngressController.
   */
  public?: boolean;

  /**
   * The domain used to expose the IngressController.
   */
  domain?: string;

  /**
   * Set a whitelist to access the IngressController.
   */
  whitelist?: pulumi.Input<string>[];

  /**
   * Enable TLS termination in Load Balancer.
   */
  enableTlsTermination?: boolean;
}

export const defaultClusterAddonsArgs = {
  ingress: {
    enabled: true,
    admin: {
      public: true,
      whitelist: ["0.0.0.0/0"],
      enableTlsTermination: true,
    },
    default: {
      public: true,
      whitelist: ["0.0.0.0/0"],
      enableTlsTermination: true,
    }
  },
  logging: {
    applications: {
      dataRetention: 1,
      enabled: true,
    },
    dataplane: {
      dataRetention: 1,
      enabled: false
    },
    host: {
      dataRetention: 1,
      enabled: false
    },
  },
  metrics: {
    enabled: true,
    dataRetention: 1,
  },
};

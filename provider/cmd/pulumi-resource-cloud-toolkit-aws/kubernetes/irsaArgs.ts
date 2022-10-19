import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

export interface IrsaArgs {
  /**
   * The OIDC Identity Provider arn used by the IRSA.
   */
  identityProvidersArn: pulumi.Input<string>[];

  /**
   * The OIDC Identity Provider url used by the IRSA.
   */
  issuerUrl: pulumi.Input<string>;

  /**
   * Kubernetes provider used by Pulumi.
   */
  k8sProvider: kubernetes.Provider;

  /**
   * The Namespace name where the addon will be installed.
   */
  namespace: pulumi.Input<string>;

  /**
   * The Service Account name used in Kubernetes.
   */
  serviceAccountName: pulumi.Input<string>;

  /**
   * The list of Policies to be associated to the Irsa.
   */
  policies: pulumi.Output<string>[];
}

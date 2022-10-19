import * as kubernetes from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

export interface ApplicationAddonArgs {
  /**
   * Kubernetes provider used by Pulumi.
   */
  k8sProvider: kubernetes.Provider;

  /**
   * The name of the instanced component.
   */
  name: string;

  /**
   * The Namespace name where the addon will be installed.
   */
  namespace: string;

  /**
   * Create a new Namespace using the given name.
   */
  createNamespace?: boolean;
}

export interface IrsaApplicationAddonArgs extends ApplicationAddonArgs {
  /**
   * The OIDC Identity Provider arn used by the IRSA.
   */
  identityProvidersArn: pulumi.Input<string>[];

  /**
   * The OIDC Identity Provider url used by the IRSA.
   */
  issuerUrl: pulumi.Input<string>;

  /**
   * The Service Account name used in Kubernetes.
   */
  serviceAccountName: pulumi.Input<string>;
}

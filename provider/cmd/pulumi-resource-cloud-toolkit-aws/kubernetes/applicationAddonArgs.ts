import * as kubernetes from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

export interface ApplicationAddonArgs {
  k8sProvider: kubernetes.Provider;
  name: string;
  namespace: string;
  createNamespace?: boolean;
}

export interface IrsaApplicationAddonArgs extends ApplicationAddonArgs {
  identityProvidersArn: pulumi.Input<string>[];
  issuerUrl: pulumi.Input<string>;
  serviceAccountName: pulumi.Input<string>;
}

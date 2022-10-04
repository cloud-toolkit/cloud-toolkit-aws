import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

export interface IrsaArgs {
  identityProvidersArn: pulumi.Input<string>[];
  issuerUrl: pulumi.Input<string>;
  k8sProvider: kubernetes.Provider;
  namespace: pulumi.Input<string>;
  serviceAccountName: pulumi.Input<string>;
  policies: pulumi.Output<string>[];
}

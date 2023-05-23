import * as pulumi from "@pulumi/pulumi";
import { AdotApplicationMetricsArgs } from "./adotApplicationArgs";
import { FluentbitLoggingArgs } from "./fluentbitArgs";
import { IamAuthenticatorUserArgs, IamAuthenticatorRoleArgs } from "./iamAuthenticatorArgs";

export interface ClusterArgs {
  /**
   * The VPC ID where the cluster will be deployed
   */
  vpcId?: pulumi.Input<string>;

  /**
   * The list of private subnet ids where for the EKS cluster. These subnets will be tagged for Kubernetes purposes.
   */
  privateSubnetIds?: pulumi.Input<string>[];

  /**
   * The list of public subnet ids where for the EKS cluster. These subnets will be tagged for Kubernetes purposes.
   */
  publicSubnetIds?: pulumi.Input<string>[];

  /**
   * Desired Kubernetes version for control plane. Defaults to '1.23'.
   */
  version?: string;

  /**
   * Configure the Kubernetes cluster API.
   */
  api?: ClusterApiArgs;

  /**
   * The NodeGroups to be assigned to this cluster.
   */
  nodeGroups?: ClusterNodeGroupArgs[];

  /**
   * The OIDC Providers configuration.
   */
  oidcProviders?: ClusterOidcProvidersArgs;

  /**
   * The addons installed in the cluster.
   */
  addons?: AddonsArgs;

  /**
   * Configure the cluster networking.
   */
  networking?: ClusterNetworkingArgs;

  /**
   * Configure the cluster observability for logging.
   */
  logging?: FluentbitLoggingArgs;

  /**
   * Configure the cluster observability for metrics.
   */
  metrics?: AdotApplicationMetricsArgs;

  /**
   * Configure authentication integrated with AWS IAM.
   */
  authentication?: ClusterAuthenticationArgs;
}

export interface ClusterAuthenticationArgs {
  /**
   * The list of AWS Accounts that can authenticate with the API Server.
   */
  accounts?: pulumi.Input<string>[];

  /**
   * The list of AWS IAM Users names to be configured as cluster-admin.
   */
  clusterAdmins?: pulumi.Input<string>[];

  /**
   * The list of AWS IAM Roles that can authenticate with the API server.
   */
  roles?: IamAuthenticatorRoleArgs[];

  /**
   * The list of AWS IAM Users that can authenticate with the API server.
   */
  users?: IamAuthenticatorUserArgs[];
}

export interface ClusterNetworkingArgs {
  /**
   * Configure the access to admin applications.
   */
  admin?: ClusterNetworkingIngressArgs;

  /**
   * Configure the access to applications.
   */
  default?: ClusterNetworkingIngressArgs;
}

export interface ClusterNetworkingIngressArgs {
  /**
   * Use a public Load Balancer to expose the IngressController.
   */
  public?: boolean;

  /**
   * The domain used to expose the IngressController.
   */
  domain: string;

  /**
   * Set a whitelist to access the IngressController.
   */
  whitelist?: pulumi.Input<string>[];

  /**
   * Enable TLS termination in Load Balancer.
   */
  enableTlsTermination?: boolean;
}

export interface AddonsArgs {
  /**
   * Enable the ClusterAddons.
   */
  enabled: boolean;
}

export interface ClusterApiArgs {
  /**
   * Configure the public endpoint for the Kubernetes API.
   */
  public?: ClusterPublicApiArgs;

  /**
   * Configure the private endpoint for the Kubernetes API.
   */
  private?: ClusterPrivateApiArgs;
}

export interface ClusterPublicApiArgs {
  /**
   * Enable the public endpoint for Kubernetes API.
   */
  enabled?: boolean;

  /**
   * The list of CIDR that will be allowed to reach the public endpoint for Kubernetes API.
   */
  whitelist?: string[];
}

export interface ClusterPrivateApiArgs {
  /**
   * Enable the private endpoint for Kubernetes API.
   */
  enabled?: boolean;
}

export interface ClusterNodeGroupArgs {
  /**
   * The Node Group name.
   */
  name: string;

  /**
   * The subnets type to be used to deploy the Node Groups.
   */
  subnetsType?: ClusterSubnetsType;

  /**
   * The EC2 Instance Type to be used to create the Nodes.
   */
  instanceType?: string;

  /**
   * The minimum number of nodes running in the node group. Defaults to 1.
   */
  minCount: number;

  /**
   * The maxium number of nodes running in the node group. Defaults to 2.
   */
  maxCount: number;

  /**
   * The maximum number of nodes unavailable at once during a version update. Defaults to 1.
   */
  maxUnavailable: number;

  /**
   * Disk size in GiB for each node. Defaults to 20.
   */
  diskSize?: number;
}

/**
 * The subnet type
 */
export enum ClusterSubnetsType {
  private = "private",
  public = "public",
}

export interface ClusterOidcProvidersArgs {
  /**
   * Enable the default OIDC Provider that is used in the cluster to let Service Accounts to authenticate against AWS with a given IAM Role.
   */
  enableDefaultProvider: boolean;
}

export const defaultVersion = "1.23";
export const defaultPublicApiEnabled = true;
export const defaultPublicApiWhitelist = undefined;
export const defaultPrivateApiEnabled = true;
export const defaultNodeGroups = [{
  name: "default"
}];
export const defaultNodeGroup = {
  instanceType: "t3.medium",
  subnetsType: "public",
  minCount: 2,
  maxCount: 3,
  maxUnavailable: 1,
  diskSize: 20
};
export const defaultOidcProviders = {
  enableDefaultProvider: true,
};
export const defaultIngress = {};
export const defaultClusterArgs = {
  api: {
    public: {
      enabled: defaultPublicApiEnabled,
      whitelist: defaultPublicApiWhitelist,
    },
    private: {
      enabled: defaultPrivateApiEnabled,
    },
  },
  baseDomain: "kubernetes.cluster",
  nodeGroups: defaultNodeGroups,
  oidcProviders: defaultOidcProviders,
  version: defaultVersion,
  addons: {
    enabled: true,
  },
  authentication: {
    users: [],
    roles: [],
  }
};

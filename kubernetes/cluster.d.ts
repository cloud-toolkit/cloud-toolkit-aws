import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as pulumiAws from "@pulumi/aws";
import * as pulumiKubernetes from "@pulumi/kubernetes";
import { NodeGroup } from "./index";
/**
 * Cluster is a component that deploy a production-ready Kubernetes cluster. It setups the AWS IAM and netwokring, as well many Kubernetes services to run application in production.
 */
export declare class Cluster extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Cluster.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Cluster;
    /**
     * The EKS Cluster.
     */
    readonly cluster: pulumi.Output<pulumiAws.eks.Cluster>;
    /**
     * The VPC CNI Chart installed in the cluster.
     */
    readonly cniChart: pulumi.Output<pulumiKubernetes.helm.v3.Release>;
    /**
     * The default OIDC Provider.
     */
    readonly defaultOidcProvider: pulumi.Output<pulumiAws.iam.OpenIdConnectProvider | undefined>;
    /**
     * The kubeconfig content for this cluster.
     */
    readonly kubeconfig: pulumi.Output<string>;
    /**
     * The Node Groups associated to the cluster.
     */
    readonly nodeGroups: pulumi.Output<NodeGroup[]>;
    /**
     * The Kubernetes provider for this cluster.
     */
    readonly provider: pulumi.Output<pulumiKubernetes.Provider>;
    /**
     * The Provider to provision EKS cluster.
     */
    readonly provisionerProvider: pulumi.Output<pulumiAws.Provider>;
    /**
     * The IAM Role to provision EKS cluster.
     */
    readonly provisionerRole: pulumi.Output<pulumiAws.iam.Role>;
    /**
     * The IAM Role Polity to provision EKS cluster.
     */
    readonly provisionerRolePolicy: pulumi.Output<pulumiAws.iam.RolePolicy>;
    /**
     * The IAM Role assumed by the EKS Cluster.
     */
    readonly role: pulumi.Output<pulumiAws.iam.Role>;
    /**
     * The IAM Role Policy Attachment to assign the IAM Policies to the IAM Role.
     */
    readonly rolePolicyAttachment: pulumi.Output<pulumiAws.iam.RolePolicyAttachment>;
    /**
     * The Security Group associated to the EKS Cluster.
     */
    readonly securityGroup: pulumi.Output<pulumiAws.ec2.SecurityGroup>;
    /**
     * EC2 Tags used for provisioning Load Balancers.
     */
    readonly subnetTags: pulumi.Output<pulumiAws.ec2.Tag[]>;
    /**
     * Create a Cluster resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: ClusterArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Cluster resource.
 */
export interface ClusterArgs {
    /**
     * Configure the Kubernetes cluster API.
     */
    api?: pulumi.Input<inputs.kubernetes.ClusterApiArgsArgs>;
    /**
     * The NodeGroups to be assigned to this cluster.
     */
    nodeGroups?: pulumi.Input<pulumi.Input<inputs.kubernetes.ClusterNodeGroupArgsArgs>[]>;
    /**
     * The OIDC Providers configuration.
     */
    oidcProviders?: pulumi.Input<inputs.kubernetes.ClusterOidcProvidersArgsArgs>;
    /**
     * The list of private subnet ids where for the EKS cluster. These subnets will be tagged for Kubernetes purposes.
     */
    privateSubnetIds?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The list of public subnet ids where for the EKS cluster. These subnets will be tagged for Kubernetes purposes.
     */
    publicSubnetIds?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Desired Kubernetes version for control plane. Defaults to '1.22'.
     */
    version?: pulumi.Input<string>;
    /**
     * The VPC ID where the cluster will be deployed
     */
    vpcId?: pulumi.Input<string>;
}

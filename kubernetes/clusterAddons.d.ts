import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as pulumiKubernetes from "@pulumi/kubernetes";
import { ArgoCD, AwsEbsCsiDriver, AwsLoadBalancerController, Calico, CertManager, ClusterAutoscaler, Dashboard, ExternalDns, IngressNginx } from "./index";
/**
 * ClusterAddons is a component that manages the Lubernetes addons to setup a production-ready cluster.
 */
export declare class ClusterAddons extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of ClusterAddons.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is ClusterAddons;
    /**
     * The IngressNginx addon used for admin access.
     */
    readonly adminIngressNginx: pulumi.Output<IngressNginx>;
    /**
     * The ArgoCD addon.
     */
    readonly argocd: pulumi.Output<ArgoCD>;
    /**
     * The AWS LoadBalancer Controller.
     */
    readonly awsLoadBalancerController: pulumi.Output<AwsLoadBalancerController>;
    /**
     * The Calico addon used to manage network policies.
     */
    readonly calico: pulumi.Output<Calico>;
    /**
     * The CertManager addon.
     */
    readonly certManager: pulumi.Output<CertManager>;
    /**
     * The Kubernetes ClusterAutoscaler addon.
     */
    readonly clusterAutoscaler: pulumi.Output<ClusterAutoscaler>;
    /**
     * The Kubernetes dashboard addon.
     */
    readonly dashboard: pulumi.Output<Dashboard>;
    /**
     * The EBS CSI driver that allows to create volumes using the block storage service of AWS.
     */
    readonly ebsCsiDriver: pulumi.Output<AwsEbsCsiDriver>;
    /**
     * The ExternalDns addon.
     */
    readonly externalDns: pulumi.Output<ExternalDns>;
    /**
     * Create a ClusterAddons resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ClusterAddonsArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a ClusterAddons resource.
 */
export interface ClusterAddonsArgs {
    /**
     * The EKS Cluster name.
     */
    clusterName: pulumi.Input<string>;
    /**
     * The domain used by the cluster.
     */
    domain: pulumi.Input<string>;
    /**
     * The OIDC Identity Provider arn.
     */
    identityProvidersArn: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The configuration for Ingress Controller.
     */
    ingress?: pulumi.Input<inputs.kubernetes.ClusterAddonsIngressArgsArgs>;
    /**
     * The OIDC Identity Provider url.
     */
    issuerUrl: pulumi.Input<string>;
    /**
     * The Pulumi provider used for Kubernetes resources.
     */
    k8sProvider: pulumi.Input<pulumiKubernetes.Provider>;
    /**
     * The list of DNS Zone arns to be used by CertManager and ExternalDNS.
     */
    zoneArns: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The main DNS Zone id.
     */
    zoneId: pulumi.Input<string>;
}

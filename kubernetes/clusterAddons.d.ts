import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as pulumiKubernetes from "@pulumi/kubernetes";
import { AdotApplication, AdotOperator, ArgoCD, AwsEbsCsiDriver, AwsLoadBalancerController, Calico, CertManager, ClusterAutoscaler, Dashboard, ExternalDns, IngressNginx } from "./index";
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
    readonly adminIngressNginx: pulumi.Output<IngressNginx | undefined>;
    /**
     * Route53 Zone arn used for admin IngressController.
     */
    readonly adminZoneArn: pulumi.Output<string | undefined>;
    /**
     * Route53 Zone id used for admin IngressController.
     */
    readonly adminZoneId: pulumi.Output<string | undefined>;
    /**
     * The OpenTelemetry (ADOT) application that sends logs to CloudWatch.
     */
    readonly adotApplication: pulumi.Output<AdotApplication>;
    /**
     * The OpenTelemetry (ADOT) operator that sends logs to CloudWatch.
     */
    readonly adotOperator: pulumi.Output<AdotOperator>;
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
     * The IngressNginx addon used for default access.
     */
    readonly defaultIngressNginx: pulumi.Output<IngressNginx | undefined>;
    /**
     * Route53 Zone arn used for default IngressController.
     */
    readonly defaultZoneArn: pulumi.Output<string | undefined>;
    /**
     * Route53 Zone id used for default IngressController.
     */
    readonly defaultZoneId: pulumi.Output<string | undefined>;
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
     * Configure the cluster observability for logging.
     */
    logging?: pulumi.Input<inputs.kubernetes.AdotApplicationLoggingArgsArgs>;
    /**
     * Configure the cluster observability for metrics.
     */
    metrics?: pulumi.Input<inputs.kubernetes.AdotApplicationMetricsArgsArgs>;
}

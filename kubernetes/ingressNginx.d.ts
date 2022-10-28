import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as pulumiKubernetes from "@pulumi/kubernetes";
import { Certificate } from "../commons";
/**
 * IngressNginx is a component that deploy the Nginx IngressController to expose applications over HTTP/HTTPS.
 */
export declare class IngressNginx extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of IngressNginx.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is IngressNginx;
    /**
     * The ArgoCD Application to deploy the component.
     */
    readonly application: pulumi.Output<pulumiKubernetes.apiextensions.CustomResource>;
    /**
     * The ACM Certificates used for TLS encryption.
     */
    readonly certificate: pulumi.Output<Certificate | undefined>;
    /**
     * The Namespace used to deploy the component.
     */
    readonly namespace: pulumi.Output<pulumiKubernetes.core.v1.Namespace | undefined>;
    /**
     * Create a IngressNginx resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: IngressNginxArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a IngressNginx resource.
 */
export interface IngressNginxArgs {
    /**
     * The Ingress class name.
     */
    className: pulumi.Input<string>;
    /**
     * Expose the IngressController with a public Load Balancer.
     */
    public?: pulumi.Input<boolean>;
    /**
     * The domain associated to the IngressController.
     */
    tls?: pulumi.Input<inputs.kubernetes.IngressNginxTlsArgsArgs>;
    /**
     * The whitelist of CIDR to access to the Ingress Controller.
     */
    whitelist?: pulumi.Input<pulumi.Input<string>[]>;
}

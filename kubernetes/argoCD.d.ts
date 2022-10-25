import * as pulumi from "@pulumi/pulumi";
import * as pulumiKubernetes from "@pulumi/kubernetes";
import * as pulumiRandom from "@pulumi/random";
/**
 * ArgoCD is a component that deploy the ArgoCD application in the cluster.
 */
export declare class ArgoCD extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of ArgoCD.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is ArgoCD;
    /**
     * The inital admin password.
     */
    readonly adminPassword: pulumi.Output<pulumiRandom.RandomPassword>;
    /**
     * The Helm Chart used to deploy ArgoCD.
     */
    readonly chart: pulumi.Output<pulumiKubernetes.helm.v3.Chart>;
    /**
     * The Namespace used to deploy the component.
     */
    readonly namespace: pulumi.Output<pulumiKubernetes.core.v1.Namespace>;
    /**
     * Create a ArgoCD resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: ArgoCDArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a ArgoCD resource.
 */
export interface ArgoCDArgs {
    /**
     * The hostname to be used to expose ArgoCD with an Ingress.
     */
    hostname?: pulumi.Input<string>;
}

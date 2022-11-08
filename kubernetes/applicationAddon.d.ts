import * as pulumi from "@pulumi/pulumi";
import * as pulumiKubernetes from "@pulumi/kubernetes";
/**
 * IRSAAddon is a component that deploy an HelmChart as ArgoCD Application.
 */
export declare class ApplicationAddon extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of ApplicationAddon.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is ApplicationAddon;
    /**
     * Create a ApplicationAddon resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ApplicationAddonArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a ApplicationAddon resource.
 */
export interface ApplicationAddonArgs {
    /**
     * Create a new Namespace using the given name.
     */
    createNamespace?: pulumi.Input<boolean>;
    /**
     * Kubernetes provider used by Pulumi.
     */
    k8sProvider: pulumi.Input<pulumiKubernetes.Provider>;
    /**
     * The name of the instanced component.
     */
    name: pulumi.Input<string>;
    /**
     * The Namespace name where the addon will be installed.
     */
    namespace: pulumi.Input<string>;
}

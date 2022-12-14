// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "../utilities";

import * as pulumiKubernetes from "@pulumi/kubernetes";

/**
 * IRSAAddon is a component that deploy an HelmChart as ArgoCD Application.
 */
export class ApplicationAddon extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'cloud-toolkit-aws:kubernetes:ApplicationAddon';

    /**
     * Returns true if the given object is an instance of ApplicationAddon.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is ApplicationAddon {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === ApplicationAddon.__pulumiType;
    }


    /**
     * Create a ApplicationAddon resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ApplicationAddonArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.k8sProvider === undefined) && !opts.urn) {
                throw new Error("Missing required property 'k8sProvider'");
            }
            if ((!args || args.name === undefined) && !opts.urn) {
                throw new Error("Missing required property 'name'");
            }
            if ((!args || args.namespace === undefined) && !opts.urn) {
                throw new Error("Missing required property 'namespace'");
            }
            resourceInputs["createNamespace"] = args ? args.createNamespace : undefined;
            resourceInputs["k8sProvider"] = args ? args.k8sProvider : undefined;
            resourceInputs["name"] = args ? args.name : undefined;
            resourceInputs["namespace"] = args ? args.namespace : undefined;
        } else {
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(ApplicationAddon.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
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

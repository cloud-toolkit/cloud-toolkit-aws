import * as pulumi from "@pulumi/pulumi";
import * as pulumiAws from "@pulumi/aws";
import * as pulumiKubernetes from "@pulumi/kubernetes";
/**
 * The Irsa component create an IAM roles for service accounts on AWS and Kubernetes.
 */
export declare class Irsa extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Irsa.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Irsa;
    readonly name: pulumi.Output<string>;
    /**
     * The list of IAM Policies.
     */
    readonly policies: pulumi.Output<pulumiAws.iam.Policy[]>;
    /**
     * The IAM Role.
     */
    readonly role: pulumi.Output<pulumiAws.iam.Role>;
    /**
     * The list of IAM Policy Attachments to associate the Roles and Policies.
     */
    readonly rolePolicyAttachments: pulumi.Output<pulumiAws.iam.RolePolicyAttachment[]>;
    /**
     * The ServiceAccount created in Kubernetes.
     */
    readonly serviceAccount: pulumi.Output<pulumiKubernetes.core.v1.ServiceAccount>;
    /**
     * Create a Irsa resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: IrsaArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Irsa resource.
 */
export interface IrsaArgs {
    /**
     * The OIDC Identity Provider arn used by the IRSA.
     */
    identityProvidersArn: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The OIDC Identity Provider url used by the IRSA.
     */
    issuerUrl: pulumi.Input<string>;
    /**
     * Kubernetes provider used by Pulumi.
     */
    k8sProvider: pulumi.Input<pulumiKubernetes.Provider>;
    /**
     * The Namespace name where the addon will be installed.
     */
    namespace: pulumi.Input<string>;
    /**
     * The list of Policies to be associated to the Irsa.
     */
    policies: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The Service Account name used in Kubernetes.
     */
    serviceAccountName: pulumi.Input<string>;
}

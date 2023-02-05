// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
import * as enums from "../types/enums";
import * as utilities from "../utilities";

import * as pulumiAws from "@pulumi/aws";
import * as pulumiKubernetes from "@pulumi/kubernetes";

/**
 * IamAuthenticator is a component that integrates the AWS IAM service with the Kubernetes authentication system. He receives a list of AWS IAM users and roles to enable their authentication to the cluster.
 */
export class IamAuthenticator extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'cloud-toolkit-aws:kubernetes:IamAuthenticator';

    /**
     * Returns true if the given object is an instance of IamAuthenticator.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is IamAuthenticator {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === IamAuthenticator.__pulumiType;
    }

    /**
     * The AWS IAM Group that has admin permission in the cluster.
     */
    public /*out*/ readonly clusterAdminGroup!: pulumi.Output<pulumiAws.iam.Group>;
    /**
     * The AWS IAM Group Policy that has admin permission in the cluster.
     */
    public /*out*/ readonly clusterAdminGroupPolicy!: pulumi.Output<pulumiAws.iam.GroupPolicy>;
    /**
     * The AWS IAM Role that has admin permission in the cluster.
     */
    public /*out*/ readonly clusterAdminRole!: pulumi.Output<pulumiAws.iam.Role>;
    /**
     * The AWS IAM Group Policy that has admin permission in the cluster.
     */
    public /*out*/ readonly clusterAdminRolePolicy!: pulumi.Output<pulumiAws.iam.RolePolicy>;
    /**
     * The list of AWS IAM UserGroupMemebership to provide cluster-admin access to the given users.
     */
    public /*out*/ readonly clusterAdminUserGroupMemberships!: pulumi.Output<pulumiAws.iam.UserGroupMembership[]>;
    /**
     * The AWS IAM Group Policy that has admin permission in the cluster.
     */
    public /*out*/ readonly clusterUserPolicy!: pulumi.Output<pulumiAws.iam.Policy>;
    /**
     * The AWS IAM Group Policy that has admin permission in the cluster.
     */
    public /*out*/ readonly clusterUserPolicyAttachment!: pulumi.Output<pulumiAws.iam.PolicyAttachment | undefined>;
    /**
     * The Path applied to the authentication ConfigMap.
     */
    public /*out*/ readonly configMap!: pulumi.Output<pulumiKubernetes.core.v1.ConfigMap>;
    /**
     * The Kubernetes provider.
     */
    public /*out*/ readonly provider!: pulumi.Output<pulumiKubernetes.Provider>;

    /**
     * Create a IamAuthenticator resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: IamAuthenticatorArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.clusterArn === undefined) && !opts.urn) {
                throw new Error("Missing required property 'clusterArn'");
            }
            if ((!args || args.kubeconfig === undefined) && !opts.urn) {
                throw new Error("Missing required property 'kubeconfig'");
            }
            resourceInputs["accounts"] = args ? args.accounts : undefined;
            resourceInputs["clusterAdmins"] = args ? args.clusterAdmins : undefined;
            resourceInputs["clusterArn"] = args ? args.clusterArn : undefined;
            resourceInputs["kubeconfig"] = args ? args.kubeconfig : undefined;
            resourceInputs["nodeGroupRoles"] = args ? args.nodeGroupRoles : undefined;
            resourceInputs["roles"] = args ? args.roles : undefined;
            resourceInputs["users"] = args ? args.users : undefined;
            resourceInputs["clusterAdminGroup"] = undefined /*out*/;
            resourceInputs["clusterAdminGroupPolicy"] = undefined /*out*/;
            resourceInputs["clusterAdminRole"] = undefined /*out*/;
            resourceInputs["clusterAdminRolePolicy"] = undefined /*out*/;
            resourceInputs["clusterAdminUserGroupMemberships"] = undefined /*out*/;
            resourceInputs["clusterUserPolicy"] = undefined /*out*/;
            resourceInputs["clusterUserPolicyAttachment"] = undefined /*out*/;
            resourceInputs["configMap"] = undefined /*out*/;
            resourceInputs["provider"] = undefined /*out*/;
        } else {
            resourceInputs["clusterAdminGroup"] = undefined /*out*/;
            resourceInputs["clusterAdminGroupPolicy"] = undefined /*out*/;
            resourceInputs["clusterAdminRole"] = undefined /*out*/;
            resourceInputs["clusterAdminRolePolicy"] = undefined /*out*/;
            resourceInputs["clusterAdminUserGroupMemberships"] = undefined /*out*/;
            resourceInputs["clusterUserPolicy"] = undefined /*out*/;
            resourceInputs["clusterUserPolicyAttachment"] = undefined /*out*/;
            resourceInputs["configMap"] = undefined /*out*/;
            resourceInputs["provider"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(IamAuthenticator.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a IamAuthenticator resource.
 */
export interface IamAuthenticatorArgs {
    /**
     * List of AWS Accounts allowed to authenticate in the cluster.
     */
    accounts?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The list of AWS IAM Users names to be configured as cluster-admin.
     */
    clusterAdmins?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The EKS Cluster ARN.
     */
    clusterArn: pulumi.Input<string>;
    /**
     * The Kubeconfig to access to the cluster.
     */
    kubeconfig: pulumi.Input<string>;
    /**
     * The list of AWS IAM Roles for NodeGroups to generate the aws-auth ConfigMap.
     */
    nodeGroupRoles?: pulumi.Input<pulumi.Input<inputs.kubernetes.IamAuthenticatorRoleArgs>[]>;
    /**
     * The list of AWS IAM Roles to generate the aws-auth ConfigMap.
     */
    roles?: pulumi.Input<pulumi.Input<inputs.kubernetes.IamAuthenticatorRoleArgs>[]>;
    /**
     * The list of AWS IAM Users to generate the aws-auth ConfigMap.
     */
    users?: pulumi.Input<pulumi.Input<inputs.kubernetes.IamAuthenticatorUserArgs>[]>;
}

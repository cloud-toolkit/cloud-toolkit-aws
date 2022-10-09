import * as pulumi from "@pulumi/pulumi";
import * as pulumiAws from "@pulumi/aws";
/**
 * NodeGroup is a component that deploy a Node Group for a Kubernetes cluster.
 */
export declare class NodeGroup extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of NodeGroup.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is NodeGroup;
    /**
     * The EC2 Launch Template used to provision nodes.
     */
    readonly launchTemplate: pulumi.Output<pulumiAws.ec2.LaunchTemplate>;
    /**
     * The EKS Node Group.
     */
    readonly nodeGroup: pulumi.Output<pulumiAws.eks.NodeGroup>;
    /**
     * The IAM Role assumed by the EKS Nodes.
     */
    readonly role: pulumi.Output<pulumiAws.iam.Role>;
    /**
     * The list of IAM Role Policy Attachment used to attach IAM Roles to the EKS Node Group.
     */
    readonly rolePolicyAttachments: pulumi.Output<pulumiAws.iam.RolePolicyAttachment[]>;
    /**
     * Create a NodeGroup resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: NodeGroupArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a NodeGroup resource.
 */
export interface NodeGroupArgs {
    /**
     * The CA used by the Kubernetes cluster.
     */
    clusterCA: pulumi.Input<string>;
    /**
     * The Kubernetes cluster endpoint.
     */
    clusterEndpoint: pulumi.Input<string>;
    /**
     * The Kubernetes cluster name.
     */
    clusterName: pulumi.Input<string>;
    /**
     * The Kubernetes cluster version.
     */
    clusterVersion: pulumi.Input<string>;
    /**
     * The aws instance type to use for the nodes. Defaults to "t3.medium".
     */
    instanceType?: pulumi.Input<string>;
    /**
     * The maxium number of nodes running in the node group. Defaults to 2.
     */
    maxCount?: pulumi.Input<number>;
    /**
     * The maximum number of nodes unavailable at once during a version update. Defaults to 1.
     */
    maxUnavailable?: pulumi.Input<number>;
    /**
     * The minimum number of nodes running in the node group. Defaults to 1.
     */
    minCount?: pulumi.Input<number>;
    /**
     * The name that identies the resource.
     */
    name: pulumi.Input<string>;
    /**
     * The list of subnets ids where the nodes will be deployed.
     */
    subnetIds: pulumi.Input<pulumi.Input<string>[]>;
}

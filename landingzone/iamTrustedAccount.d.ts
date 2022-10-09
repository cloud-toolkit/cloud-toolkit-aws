import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
export declare class IamTrustedAccount extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of IamTrustedAccount.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is IamTrustedAccount;
    readonly roleGroupPolicies: pulumi.Output<outputs.landingzone.IamTrustedAccountRoleGroupPolicyMapping[]>;
    readonly roleGroups: pulumi.Output<outputs.landingzone.IamTrustedAccountRoleGroupMapping[]>;
    /**
     * Create a IamTrustedAccount resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: IamTrustedAccountArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a IamTrustedAccount resource.
 */
export interface IamTrustedAccountArgs {
    roles: pulumi.Input<pulumi.Input<inputs.landingzone.IamTrustedAccountRoleArgsArgs>[]>;
    trustingAccountId: pulumi.Input<string>;
    trustingAccountName: pulumi.Input<string>;
}

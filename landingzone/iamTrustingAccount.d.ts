import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
export declare class IamTrustingAccount extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of IamTrustingAccount.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is IamTrustingAccount;
    readonly delegatedRolePolicyAttachments: pulumi.Output<outputs.landingzone.IamTrustingAccountRolePolicyAttachmentMapping[]>;
    readonly delegatedRoles: pulumi.Output<outputs.landingzone.IamTrustingAccountRoleMapping[]>;
    /**
     * Create a IamTrustingAccount resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: IamTrustingAccountArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a IamTrustingAccount resource.
 */
export interface IamTrustingAccountArgs {
    delegatedAccountIds: pulumi.Input<pulumi.Input<string>[]>;
    delegatedRoles?: pulumi.Input<pulumi.Input<inputs.landingzone.IamTrustingAccountRoleArgsArgs>[]>;
}

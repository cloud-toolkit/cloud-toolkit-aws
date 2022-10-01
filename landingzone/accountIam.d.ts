import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as pulumiAws from "@pulumi/aws";
/**
 * Cluster is a component that configure the IAM service for a given account.
 */
export declare class AccountIam extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of AccountIam.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is AccountIam;
    /**
     * The IAM Account Alias.
     */
    readonly alias: pulumi.Output<pulumiAws.iam.AccountAlias | undefined>;
    /**
     * The IAM Account Password policy.
     */
    readonly passwordPolicy: pulumi.Output<pulumiAws.iam.AccountPasswordPolicy | undefined>;
    /**
     * Create a AccountIam resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: AccountIamArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a AccountIam resource.
 */
export interface AccountIamArgs {
    /**
     * The alias to be used for IAM.
     */
    alias?: pulumi.Input<string>;
    /**
     * The IAM password policy configuration.
     */
    passwordPolicy?: pulumi.Input<inputs.landingZone.AccountPasswordPolicyArgsArgs>;
}

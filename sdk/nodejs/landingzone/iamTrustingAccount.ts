// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
import * as enums from "../types/enums";
import * as utilities from "../utilities";

import * as pulumiAws from "@pulumi/aws";

export class IamTrustingAccount extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'cloud-toolkit-aws:landingzone:IamTrustingAccount';

    /**
     * Returns true if the given object is an instance of IamTrustingAccount.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is IamTrustingAccount {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === IamTrustingAccount.__pulumiType;
    }

    public /*out*/ readonly delegatedRolePolicyAttachments!: pulumi.Output<outputs.landingzone.IamTrustingAccountRolePolicyAttachmentMapping[]>;
    public readonly delegatedRoles!: pulumi.Output<outputs.landingzone.IamTrustingAccountRoleMapping[]>;

    /**
     * Create a IamTrustingAccount resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: IamTrustingAccountArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            if ((!args || args.delegatedAccountIds === undefined) && !opts.urn) {
                throw new Error("Missing required property 'delegatedAccountIds'");
            }
            resourceInputs["delegatedAccountIds"] = args ? args.delegatedAccountIds : undefined;
            resourceInputs["delegatedRoles"] = args ? args.delegatedRoles : undefined;
            resourceInputs["delegatedRolePolicyAttachments"] = undefined /*out*/;
        } else {
            resourceInputs["delegatedRolePolicyAttachments"] = undefined /*out*/;
            resourceInputs["delegatedRoles"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(IamTrustingAccount.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a IamTrustingAccount resource.
 */
export interface IamTrustingAccountArgs {
    delegatedAccountIds: pulumi.Input<pulumi.Input<string>[]>;
    delegatedRoles?: pulumi.Input<pulumi.Input<inputs.landingzone.IamTrustingAccountRoleArgs>[]>;
}

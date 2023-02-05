// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
import * as enums from "../types/enums";
import * as utilities from "../utilities";

import * as pulumiAws from "@pulumi/aws";

/**
 * Organization is the component that configure the AWS Orgazination, AWS Accounts and AWS Organization Policies.
 */
export class Organization extends pulumi.ComponentResource {
    /** @internal */
    public static readonly __pulumiType = 'cloud-toolkit-aws:landingzone:Organization';

    /**
     * Returns true if the given object is an instance of Organization.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is Organization {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Organization.__pulumiType;
    }

    /**
     * The list of AWS Accounts inside the Organization.
     */
    public /*out*/ readonly accountIds!: pulumi.Output<string[]>;
    /**
     * The list of AWS Provider for the managed accounts by this component.
     */
    public /*out*/ readonly accountProviders!: pulumi.Output<outputs.landingzone.OrganizationAccountProviderMapping[]>;
    /**
     * The list of Accounts.
     */
    public readonly accounts!: pulumi.Output<outputs.landingzone.AccountMapping[]>;
    /**
     * The AWS Organization.
     */
    public /*out*/ readonly organization!: pulumi.Output<pulumiAws.organizations.Organization>;
    /**
     * The list Organizatoinal Units.
     */
    public /*out*/ readonly organizationalUnits!: pulumi.Output<outputs.landingzone.OrganizationalUnitMapping[]>;
    /**
     * The list of Policies used in the Organization.
     */
    public readonly policies!: pulumi.Output<pulumiAws.organizations.Policy[]>;
    /**
     * The list of Policy Attachments used in the Organization.
     */
    public /*out*/ readonly policyAttachments!: pulumi.Output<pulumiAws.organizations.PolicyAttachment[]>;

    /**
     * Create a Organization resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: OrganizationArgs, opts?: pulumi.ComponentResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            resourceInputs["accounts"] = args ? args.accounts : undefined;
            resourceInputs["enabledPolicies"] = args ? args.enabledPolicies : undefined;
            resourceInputs["featureSet"] = args ? args.featureSet : undefined;
            resourceInputs["organizationId"] = args ? args.organizationId : undefined;
            resourceInputs["policies"] = args ? args.policies : undefined;
            resourceInputs["services"] = args ? args.services : undefined;
            resourceInputs["accountIds"] = undefined /*out*/;
            resourceInputs["accountProviders"] = undefined /*out*/;
            resourceInputs["organization"] = undefined /*out*/;
            resourceInputs["organizationalUnits"] = undefined /*out*/;
            resourceInputs["policyAttachments"] = undefined /*out*/;
        } else {
            resourceInputs["accountIds"] = undefined /*out*/;
            resourceInputs["accountProviders"] = undefined /*out*/;
            resourceInputs["accounts"] = undefined /*out*/;
            resourceInputs["organization"] = undefined /*out*/;
            resourceInputs["organizationalUnits"] = undefined /*out*/;
            resourceInputs["policies"] = undefined /*out*/;
            resourceInputs["policyAttachments"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(Organization.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
}

/**
 * The set of arguments for constructing a Organization resource.
 */
export interface OrganizationArgs {
    /**
     * The list of AWS Account to be configured in the Organization.
     */
    accounts?: pulumi.Input<pulumi.Input<inputs.landingzone.OrganizationAccountArgs>[]>;
    /**
     * The list of enabled Organizations Policies in the organization.
     */
    enabledPolicies?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The FeatureSet in the Organization..
     */
    featureSet?: pulumi.Input<string>;
    /**
     * The organization ID to import the Organization in the stack. If not set a new AWS Organization will be created. Defaults to undefined.
     */
    organizationId?: pulumi.Input<string>;
    /**
     * The Organization policies to be applied.
     */
    policies?: pulumi.Input<inputs.landingzone.OrganizationPoliciesArgs>;
    /**
     * The list of AWS Service Access Principals enabled in the organization.
     */
    services?: pulumi.Input<pulumi.Input<string>[]>;
}

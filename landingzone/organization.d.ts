import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
import * as pulumiAws from "@pulumi/aws";
/**
 * Organization is the component that configure the AWS Orgazination, AWS Accounts and AWS Organization Policies.
 */
export declare class Organization extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Organization.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Organization;
    /**
     * The list of AWS Accounts inside the Organization.
     */
    readonly accountIds: pulumi.Output<string[]>;
    /**
     * The list of AWS Provider for the managed accounts by this component.
     */
    readonly accountProviders: pulumi.Output<outputs.landingzone.OrganizationAccountProviderMapping[]>;
    /**
     * The list of Accounts.
     */
    readonly accounts: pulumi.Output<outputs.landingzone.AccountMappingArgs[]>;
    /**
     * The AWS Organization.
     */
    readonly organization: pulumi.Output<pulumiAws.organizations.Organization>;
    /**
     * The list Organizatoinal Units.
     */
    readonly organizationalUnits: pulumi.Output<outputs.landingzone.OrganizationalUnitMapping[]>;
    /**
     * The list of Policies used in the Organization.
     */
    readonly policies: pulumi.Output<pulumiAws.organizations.Policy[]>;
    /**
     * The list of Policy Attachments used in the Organization.
     */
    readonly policyAttachments: pulumi.Output<pulumiAws.organizations.PolicyAttachment[]>;
    /**
     * Create a Organization resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: OrganizationArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Organization resource.
 */
export interface OrganizationArgs {
    /**
     * The list of AWS Account to be configured in the Organization.
     */
    accounts?: pulumi.Input<pulumi.Input<inputs.landingzone.OrganizationAccountArgsArgs>[]>;
    /**
     * The list of AWS Service Access Principals enabled in the organization.
     */
    awsServiceAccessPrincipals?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * The list of enabled Organizations Policies in the organization.
     */
    enabledPolicyTypes?: pulumi.Input<pulumi.Input<string>[]>;
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
    policies?: pulumi.Input<inputs.landingzone.OrganizationPoliciesArgsArgs>;
}

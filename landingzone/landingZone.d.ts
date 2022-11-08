import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import { AuditLogging, Organization } from "./index";
/**
 * Create a Landing Zone with the Organization, the AuditLogging, the AWS Accounts and the
 */
export declare class LandingZone extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of LandingZone.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is LandingZone;
    /**
     * The AuditLogging component.
     */
    readonly auditLogging: pulumi.Output<AuditLogging | undefined>;
    /**
     * The Organization components.
     */
    readonly organization: pulumi.Output<Organization>;
    /**
     * Create a LandingZone resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: LandingZoneArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a LandingZone resource.
 */
export interface LandingZoneArgs {
    audit?: pulumi.Input<inputs.landingzone.LandingZoneAuditArgsArgs>;
    iam?: pulumi.Input<inputs.landingzone.LandingZoneIamArgsArgs>;
    organization?: pulumi.Input<inputs.landingzone.OrganizationArgsArgs>;
}

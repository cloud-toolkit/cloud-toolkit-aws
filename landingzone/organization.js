"use strict";
// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const pulumi = require("@pulumi/pulumi");
const utilities = require("../utilities");
/**
 * Organization is the component that configure the AWS Orgazination, AWS Accounts and AWS Organization Policies.
 */
class Organization extends pulumi.ComponentResource {
    /**
     * Create a Organization resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name, args, opts) {
        let resourceInputs = {};
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
        }
        else {
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
    /**
     * Returns true if the given object is an instance of Organization.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj) {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Organization.__pulumiType;
    }
}
exports.Organization = Organization;
/** @internal */
Organization.__pulumiType = 'cloud-toolkit-aws:landingzone:Organization';
//# sourceMappingURL=organization.js.map
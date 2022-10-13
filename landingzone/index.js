"use strict";
// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = exports.LandingZone = exports.IamTrustingAccount = exports.IamTrustedAccount = exports.AuditLogging = exports.AccountIam = void 0;
const pulumi = require("@pulumi/pulumi");
const utilities = require("../utilities");
exports.AccountIam = null;
exports.AuditLogging = null;
exports.IamTrustedAccount = null;
exports.IamTrustingAccount = null;
exports.LandingZone = null;
exports.Organization = null;
utilities.lazyLoad(exports, ["AccountIam"], () => require("./accountIam"));
utilities.lazyLoad(exports, ["AuditLogging"], () => require("./auditLogging"));
utilities.lazyLoad(exports, ["IamTrustedAccount"], () => require("./iamTrustedAccount"));
utilities.lazyLoad(exports, ["IamTrustingAccount"], () => require("./iamTrustingAccount"));
utilities.lazyLoad(exports, ["LandingZone"], () => require("./landingZone"));
utilities.lazyLoad(exports, ["Organization"], () => require("./organization"));
const _module = {
    version: utilities.getVersion(),
    construct: (name, type, urn) => {
        switch (type) {
            case "cloud-toolkit-aws:landingzone:AccountIam":
                return new exports.AccountIam(name, undefined, { urn });
            case "cloud-toolkit-aws:landingzone:AuditLogging":
                return new exports.AuditLogging(name, undefined, { urn });
            case "cloud-toolkit-aws:landingzone:IamTrustedAccount":
                return new exports.IamTrustedAccount(name, undefined, { urn });
            case "cloud-toolkit-aws:landingzone:IamTrustingAccount":
                return new exports.IamTrustingAccount(name, undefined, { urn });
            case "cloud-toolkit-aws:landingzone:LandingZone":
                return new exports.LandingZone(name, undefined, { urn });
            case "cloud-toolkit-aws:landingzone:Organization":
                return new exports.Organization(name, undefined, { urn });
            default:
                throw new Error(`unknown resource type ${type}`);
        }
    },
};
pulumi.runtime.registerResourceModule("cloud-toolkit-aws", "landingzone", _module);
//# sourceMappingURL=index.js.map
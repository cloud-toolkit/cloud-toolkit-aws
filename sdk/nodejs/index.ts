// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

// Export members:
export { ProviderArgs } from "./provider";
export type Provider = import("./provider").Provider;
export const Provider: typeof import("./provider").Provider = null as any;
utilities.lazyLoad(exports, ["Provider"], () => require("./provider"));


// Export sub-modules:
import * as commons from "./commons";
import * as databases from "./databases";
import * as email from "./email";
import * as kubernetes from "./kubernetes";
import * as landingzone from "./landingzone";
import * as serverless from "./serverless";
import * as storage from "./storage";
import * as types from "./types";

export {
    commons,
    databases,
    email,
    kubernetes,
    landingzone,
    serverless,
    storage,
    types,
};
pulumi.runtime.registerResourcePackage("cloud-toolkit-aws", {
    version: utilities.getVersion(),
    constructProvider: (name: string, type: string, urn: string): pulumi.ProviderResource => {
        if (type !== "pulumi:providers:cloud-toolkit-aws") {
            throw new Error(`unknown provider type ${type}`);
        }
        return new Provider(name, <any>undefined, { urn });
    },
});

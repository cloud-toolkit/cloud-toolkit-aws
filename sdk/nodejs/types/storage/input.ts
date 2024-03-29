// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../../types/input";
import * as outputs from "../../types/output";
import * as enums from "../../types/enums";
import * as utilities from "../../utilities";

import * as pulumiAws from "@pulumi/aws";
import * as pulumiKubernetes from "@pulumi/kubernetes";

export interface BucketEncryptionArgs {
    customKeyId?: pulumi.Input<string>;
    enabled: pulumi.Input<boolean>;
}

export interface BucketReplicationArgs {
    bucketArn: pulumi.Input<string>;
}

export interface BucketWebsiteArgs {
    errorDocument: pulumi.Input<string>;
    indexDocument: pulumi.Input<string>;
}

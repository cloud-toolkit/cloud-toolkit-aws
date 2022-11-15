import * as pulumi from "@pulumi/pulumi";
import * as ct from "@cloudtoolkit/aws";

const config = new pulumi.Config();
const name = pulumi.getStack();
const retention = config.getNumber("retention");
const queue = new ct.serverless.Queue(name, {messageRetentionSeconds: retention});


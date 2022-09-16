import * as ct from "@cloud-toolkit/cloud-toolkit-aws";

const example = new ct.Example("test", {name: "test"});

export const bucket = example.bucket;
export const bucketId = example.bucket.id;

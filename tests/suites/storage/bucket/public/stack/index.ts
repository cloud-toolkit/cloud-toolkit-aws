import * as pulumi from "@pulumi/pulumi";
import * as ct from "@cloudtoolkit/aws";

const name = pulumi.getStack();
const component = new ct.storage.Bucket(name, {
  public: true
});
export const bucketName = component.bucket.bucket;

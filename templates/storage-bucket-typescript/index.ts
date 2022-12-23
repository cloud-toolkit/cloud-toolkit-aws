import * as pulumi from "@pulumi/pulumi";
import {
  Bucket,
  BucketArgs,
} from "@cloud-toolkit/cloud-toolkit-aws/storage";



// Retrieve base config
const config = new pulumi.Config();

// Retrieve bucket config
const publicVisibility = config.requireBoolean("public");
const encryption = config.requireBoolean("encryption");


const bucketConfig = <BucketArgs>{
  public: publicVisibility,
  encryption: {enabled: encryption}
};

const bucket = new Bucket("cloud-toolkit-bucket", bucketConfig);

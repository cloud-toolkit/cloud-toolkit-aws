import { BucketVersioningStateArgs } from "../../bucketArgs";

export default {
  public: true,
  versioning: BucketVersioningStateArgs.Enabled,
  encryption: {
    enabled: true,
  },
  replication: {
    bucketArn: "arn:aws:s3:::your-dst-bucket",
  },
};

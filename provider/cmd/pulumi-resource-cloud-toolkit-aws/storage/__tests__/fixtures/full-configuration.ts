import { BucketVersioningStateArgs } from "../../bucketArgs";

export default {
  public: true,
  bucketName: "s3-test",
  versioning: BucketVersioningStateArgs.Enabled,
  encryption: {
    enabled: true,
    customKeyId: "custom-key",
  },
};

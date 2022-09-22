import { BucketVersioningStateArgs } from "../../config";

export default {
  public: true,
  versioning: BucketVersioningStateArgs.Enabled,
  encryption: {
    enabled: true,
    customKeyId: "custom-key",
  },
};

import pulumi
import cloud_toolkit_aws

config = pulumi.Config();

# Retrieve bucket config
publicVisibility = config.get_bool("public");
encryptionEnabled = config.get_bool("encryption");

bucket = cloud_toolkit_aws.storage.Bucket("cloud-toolkit-bucket", public=publicVisibility, encryption={enabled:encryptionEnabled});

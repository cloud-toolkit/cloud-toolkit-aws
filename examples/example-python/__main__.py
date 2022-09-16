"""A Python Pulumi program"""

import pulumi
import cloud_toolkit_aws as ct

example = ct.Example("test", name="test")

pulumi.export("bucket", example.bucket)
pulumi.export("bucketId", example.bucket.id)

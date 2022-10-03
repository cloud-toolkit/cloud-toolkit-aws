# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

from . import _utilities
import typing
# Export this package's modules as members:
from .example import *
from .provider import *

# Make subpackages available:
if typing.TYPE_CHECKING:
    import cloud_toolkit_aws.databases as __databases
    databases = __databases
    import cloud_toolkit_aws.email as __email
    email = __email
    import cloud_toolkit_aws.kubernetes as __kubernetes
    kubernetes = __kubernetes
    import cloud_toolkit_aws.landingzone as __landingzone
    landingzone = __landingzone
    import cloud_toolkit_aws.serverless as __serverless
    serverless = __serverless
    import cloud_toolkit_aws.storage as __storage
    storage = __storage
else:
    databases = _utilities.lazy_import('cloud_toolkit_aws.databases')
    email = _utilities.lazy_import('cloud_toolkit_aws.email')
    kubernetes = _utilities.lazy_import('cloud_toolkit_aws.kubernetes')
    landingzone = _utilities.lazy_import('cloud_toolkit_aws.landingzone')
    serverless = _utilities.lazy_import('cloud_toolkit_aws.serverless')
    storage = _utilities.lazy_import('cloud_toolkit_aws.storage')

_utilities.register(
    resource_modules="""
[
 {
  "pkg": "cloud-toolkit-aws",
  "mod": "databases",
  "fqn": "cloud_toolkit_aws.databases",
  "classes": {
   "cloud-toolkit-aws:databases:Mysql": "Mysql"
  }
 },
 {
  "pkg": "cloud-toolkit-aws",
  "mod": "email",
  "fqn": "cloud_toolkit_aws.email",
  "classes": {
   "cloud-toolkit-aws:email:EmailSender": "EmailSender"
  }
 },
 {
  "pkg": "cloud-toolkit-aws",
  "mod": "index",
  "fqn": "cloud_toolkit_aws",
  "classes": {
   "cloud-toolkit-aws:index:Example": "Example"
  }
 },
 {
  "pkg": "cloud-toolkit-aws",
  "mod": "kubernetes",
  "fqn": "cloud_toolkit_aws.kubernetes",
  "classes": {
   "cloud-toolkit-aws:kubernetes:Cluster": "Cluster",
   "cloud-toolkit-aws:kubernetes:NodeGroup": "NodeGroup"
  }
 },
 {
  "pkg": "cloud-toolkit-aws",
  "mod": "landingzone",
  "fqn": "cloud_toolkit_aws.landingzone",
  "classes": {
   "cloud-toolkit-aws:landingzone:AccountIam": "AccountIam",
   "cloud-toolkit-aws:landingzone:AuditLogging": "AuditLogging",
   "cloud-toolkit-aws:landingzone:IamTrustedAccount": "IamTrustedAccount",
   "cloud-toolkit-aws:landingzone:IamTrustingAccount": "IamTrustingAccount",
   "cloud-toolkit-aws:landingzone:LandingZone": "LandingZone",
   "cloud-toolkit-aws:landingzone:Organization": "Organization"
  }
 },
 {
  "pkg": "cloud-toolkit-aws",
  "mod": "serverless",
  "fqn": "cloud_toolkit_aws.serverless",
  "classes": {
   "cloud-toolkit-aws:serverless:Queue": "Queue"
  }
 },
 {
  "pkg": "cloud-toolkit-aws",
  "mod": "storage",
  "fqn": "cloud_toolkit_aws.storage",
  "classes": {
   "cloud-toolkit-aws:storage:Bucket": "Bucket"
  }
 }
]
""",
    resource_packages="""
[
 {
  "pkg": "cloud-toolkit-aws",
  "token": "pulumi:providers:cloud-toolkit-aws",
  "fqn": "cloud_toolkit_aws",
  "class": "Provider"
 }
]
"""
)

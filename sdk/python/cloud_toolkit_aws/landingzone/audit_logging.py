# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import copy
import warnings
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
from .. import _utilities
from ._inputs import *
import pulumi_aws

__all__ = ['AuditLoggingArgs', 'AuditLogging']

@pulumi.input_type
class AuditLoggingArgs:
    def __init__(__self__, *,
                 bucket_provider: Optional[pulumi.Input['pulumi_aws.Provider']] = None,
                 cloudwatch: Optional[pulumi.Input['AuditLoggingCloudWatchArgs']] = None,
                 region: Optional[pulumi.Input[str]] = None,
                 retention_days: Optional[pulumi.Input[float]] = None):
        """
        The set of arguments for constructing a AuditLogging resource.
        :param pulumi.Input['pulumi_aws.Provider'] bucket_provider: The AWS provider to used to create the Bucket.
        :param pulumi.Input['AuditLoggingCloudWatchArgs'] cloudwatch: Store the audit logs in CloudWatch to enable easy searching.
        :param pulumi.Input[str] region: The region to be used to store the data.
        :param pulumi.Input[float] retention_days: The data retention in days. Defaults to '7'.
        """
        if bucket_provider is not None:
            pulumi.set(__self__, "bucket_provider", bucket_provider)
        if cloudwatch is not None:
            pulumi.set(__self__, "cloudwatch", cloudwatch)
        if region is not None:
            pulumi.set(__self__, "region", region)
        if retention_days is not None:
            pulumi.set(__self__, "retention_days", retention_days)

    @property
    @pulumi.getter(name="bucketProvider")
    def bucket_provider(self) -> Optional[pulumi.Input['pulumi_aws.Provider']]:
        """
        The AWS provider to used to create the Bucket.
        """
        return pulumi.get(self, "bucket_provider")

    @bucket_provider.setter
    def bucket_provider(self, value: Optional[pulumi.Input['pulumi_aws.Provider']]):
        pulumi.set(self, "bucket_provider", value)

    @property
    @pulumi.getter
    def cloudwatch(self) -> Optional[pulumi.Input['AuditLoggingCloudWatchArgs']]:
        """
        Store the audit logs in CloudWatch to enable easy searching.
        """
        return pulumi.get(self, "cloudwatch")

    @cloudwatch.setter
    def cloudwatch(self, value: Optional[pulumi.Input['AuditLoggingCloudWatchArgs']]):
        pulumi.set(self, "cloudwatch", value)

    @property
    @pulumi.getter
    def region(self) -> Optional[pulumi.Input[str]]:
        """
        The region to be used to store the data.
        """
        return pulumi.get(self, "region")

    @region.setter
    def region(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "region", value)

    @property
    @pulumi.getter(name="retentionDays")
    def retention_days(self) -> Optional[pulumi.Input[float]]:
        """
        The data retention in days. Defaults to '7'.
        """
        return pulumi.get(self, "retention_days")

    @retention_days.setter
    def retention_days(self, value: Optional[pulumi.Input[float]]):
        pulumi.set(self, "retention_days", value)


class AuditLogging(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 bucket_provider: Optional[pulumi.Input['pulumi_aws.Provider']] = None,
                 cloudwatch: Optional[pulumi.Input[pulumi.InputType['AuditLoggingCloudWatchArgs']]] = None,
                 region: Optional[pulumi.Input[str]] = None,
                 retention_days: Optional[pulumi.Input[float]] = None,
                 __props__=None):
        """
        Create a AuditLogging resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        :param pulumi.Input['pulumi_aws.Provider'] bucket_provider: The AWS provider to used to create the Bucket.
        :param pulumi.Input[pulumi.InputType['AuditLoggingCloudWatchArgs']] cloudwatch: Store the audit logs in CloudWatch to enable easy searching.
        :param pulumi.Input[str] region: The region to be used to store the data.
        :param pulumi.Input[float] retention_days: The data retention in days. Defaults to '7'.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: Optional[AuditLoggingArgs] = None,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        Create a AuditLogging resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param AuditLoggingArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(AuditLoggingArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 bucket_provider: Optional[pulumi.Input['pulumi_aws.Provider']] = None,
                 cloudwatch: Optional[pulumi.Input[pulumi.InputType['AuditLoggingCloudWatchArgs']]] = None,
                 region: Optional[pulumi.Input[str]] = None,
                 retention_days: Optional[pulumi.Input[float]] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = AuditLoggingArgs.__new__(AuditLoggingArgs)

            __props__.__dict__["bucket_provider"] = bucket_provider
            __props__.__dict__["cloudwatch"] = cloudwatch
            __props__.__dict__["region"] = region
            __props__.__dict__["retention_days"] = retention_days
            __props__.__dict__["bucket"] = None
            __props__.__dict__["bucket_acl"] = None
            __props__.__dict__["bucket_lifecycle_configuration"] = None
            __props__.__dict__["bucket_policy"] = None
            __props__.__dict__["bucket_public_access_block"] = None
            __props__.__dict__["cloud_watch_dashboard"] = None
            __props__.__dict__["cloud_watch_log_group"] = None
            __props__.__dict__["cloud_watch_policy"] = None
            __props__.__dict__["cloud_watch_role"] = None
            __props__.__dict__["cloud_watch_role_policy_attachment"] = None
            __props__.__dict__["organization_id"] = None
            __props__.__dict__["organization_master_account_id"] = None
            __props__.__dict__["trail"] = None
        super(AuditLogging, __self__).__init__(
            'cloud-toolkit-aws:landingzone:AuditLogging',
            resource_name,
            __props__,
            opts,
            remote=True)

    @property
    @pulumi.getter
    def bucket(self) -> pulumi.Output['pulumi_aws.s3.BucketV2']:
        """
        The S3 Bucket used to store the data.
        """
        return pulumi.get(self, "bucket")

    @property
    @pulumi.getter(name="bucketAcl")
    def bucket_acl(self) -> pulumi.Output['pulumi_aws.s3.BucketAclV2']:
        """
        The S3 Bucket ACL.
        """
        return pulumi.get(self, "bucket_acl")

    @property
    @pulumi.getter(name="bucketLifecycleConfiguration")
    def bucket_lifecycle_configuration(self) -> pulumi.Output['pulumi_aws.s3.BucketLifecycleConfigurationV2']:
        """
        The S3 Bucket Lifecycle Configuration to configure data retention on S3 Bucket.
        """
        return pulumi.get(self, "bucket_lifecycle_configuration")

    @property
    @pulumi.getter(name="bucketPolicy")
    def bucket_policy(self) -> pulumi.Output['pulumi_aws.s3.BucketPolicy']:
        """
        The S3 Bucket policy.
        """
        return pulumi.get(self, "bucket_policy")

    @property
    @pulumi.getter(name="bucketPublicAccessBlock")
    def bucket_public_access_block(self) -> pulumi.Output['pulumi_aws.s3.BucketPublicAccessBlock']:
        """
        The S3 Bucket Public Access Block to make data private.
        """
        return pulumi.get(self, "bucket_public_access_block")

    @property
    @pulumi.getter(name="cloudWatchDashboard")
    def cloud_watch_dashboard(self) -> pulumi.Output[Optional['pulumi_aws.cloudwatch.Dashboard']]:
        """
        The CloudWatch dashboard to review the audit logs.
        """
        return pulumi.get(self, "cloud_watch_dashboard")

    @property
    @pulumi.getter(name="cloudWatchLogGroup")
    def cloud_watch_log_group(self) -> pulumi.Output[Optional['pulumi_aws.cloudwatch.LogGroup']]:
        """
        The CloudWatch Log Group used to store the data.
        """
        return pulumi.get(self, "cloud_watch_log_group")

    @property
    @pulumi.getter(name="cloudWatchPolicy")
    def cloud_watch_policy(self) -> pulumi.Output[Optional['pulumi_aws.iam.Policy']]:
        """
        The IAM Policy used by the IAM Role for Cloud Trail.
        """
        return pulumi.get(self, "cloud_watch_policy")

    @property
    @pulumi.getter(name="cloudWatchRole")
    def cloud_watch_role(self) -> pulumi.Output[Optional['pulumi_aws.iam.Role']]:
        """
        The IAM Role used by Cloud Trail to write to CloudWatch..
        """
        return pulumi.get(self, "cloud_watch_role")

    @property
    @pulumi.getter(name="cloudWatchRolePolicyAttachment")
    def cloud_watch_role_policy_attachment(self) -> pulumi.Output[Optional['pulumi_aws.iam.RolePolicyAttachment']]:
        """
        The IAM Role Policy Attachments that attach the IAM Role with the IAM Policy.
        """
        return pulumi.get(self, "cloud_watch_role_policy_attachment")

    @property
    @pulumi.getter(name="organizationId")
    def organization_id(self) -> pulumi.Output[str]:
        """
        The AWS Organization id.
        """
        return pulumi.get(self, "organization_id")

    @property
    @pulumi.getter(name="organizationMasterAccountId")
    def organization_master_account_id(self) -> pulumi.Output[str]:
        """
        The AWS Organization master account id.
        """
        return pulumi.get(self, "organization_master_account_id")

    @property
    @pulumi.getter
    def trail(self) -> pulumi.Output['pulumi_aws.cloudtrail.Trail']:
        """
        The Cloud Trail.
        """
        return pulumi.get(self, "trail")


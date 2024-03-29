# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import copy
import warnings
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
from .. import _utilities
from ..irsa import Irsa
from ._inputs import *
import pulumi_aws
import pulumi_kubernetes

__all__ = ['AdotApplicationArgs', 'AdotApplication']

@pulumi.input_type
class AdotApplicationArgs:
    def __init__(__self__, *,
                 aws_region: pulumi.Input[str],
                 cluster_name: pulumi.Input[str],
                 metrics: Optional[pulumi.Input['AdotApplicationMetricsArgs']] = None):
        """
        The set of arguments for constructing a AdotApplication resource.
        :param pulumi.Input[str] aws_region: The AWS Region.
        :param pulumi.Input[str] cluster_name: The cluster name.
        :param pulumi.Input['AdotApplicationMetricsArgs'] metrics: Configure metrics.
        """
        pulumi.set(__self__, "aws_region", aws_region)
        pulumi.set(__self__, "cluster_name", cluster_name)
        if metrics is not None:
            pulumi.set(__self__, "metrics", metrics)

    @property
    @pulumi.getter(name="awsRegion")
    def aws_region(self) -> pulumi.Input[str]:
        """
        The AWS Region.
        """
        return pulumi.get(self, "aws_region")

    @aws_region.setter
    def aws_region(self, value: pulumi.Input[str]):
        pulumi.set(self, "aws_region", value)

    @property
    @pulumi.getter(name="clusterName")
    def cluster_name(self) -> pulumi.Input[str]:
        """
        The cluster name.
        """
        return pulumi.get(self, "cluster_name")

    @cluster_name.setter
    def cluster_name(self, value: pulumi.Input[str]):
        pulumi.set(self, "cluster_name", value)

    @property
    @pulumi.getter
    def metrics(self) -> Optional[pulumi.Input['AdotApplicationMetricsArgs']]:
        """
        Configure metrics.
        """
        return pulumi.get(self, "metrics")

    @metrics.setter
    def metrics(self, value: Optional[pulumi.Input['AdotApplicationMetricsArgs']]):
        pulumi.set(self, "metrics", value)


class AdotApplication(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 aws_region: Optional[pulumi.Input[str]] = None,
                 cluster_name: Optional[pulumi.Input[str]] = None,
                 metrics: Optional[pulumi.Input[pulumi.InputType['AdotApplicationMetricsArgs']]] = None,
                 __props__=None):
        """
        Create a AdotApplication resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        :param pulumi.Input[str] aws_region: The AWS Region.
        :param pulumi.Input[str] cluster_name: The cluster name.
        :param pulumi.Input[pulumi.InputType['AdotApplicationMetricsArgs']] metrics: Configure metrics.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: AdotApplicationArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        Create a AdotApplication resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param AdotApplicationArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(AdotApplicationArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 aws_region: Optional[pulumi.Input[str]] = None,
                 cluster_name: Optional[pulumi.Input[str]] = None,
                 metrics: Optional[pulumi.Input[pulumi.InputType['AdotApplicationMetricsArgs']]] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = AdotApplicationArgs.__new__(AdotApplicationArgs)

            if aws_region is None and not opts.urn:
                raise TypeError("Missing required property 'aws_region'")
            __props__.__dict__["aws_region"] = aws_region
            if cluster_name is None and not opts.urn:
                raise TypeError("Missing required property 'cluster_name'")
            __props__.__dict__["cluster_name"] = cluster_name
            __props__.__dict__["metrics"] = metrics
            __props__.__dict__["application"] = None
            __props__.__dict__["irsa"] = None
            __props__.__dict__["log_group_metrics"] = None
            __props__.__dict__["namespace"] = None
        super(AdotApplication, __self__).__init__(
            'cloud-toolkit-aws:kubernetes:AdotApplication',
            resource_name,
            __props__,
            opts,
            remote=True)

    @property
    @pulumi.getter
    def application(self) -> pulumi.Output['pulumi_kubernetes.apiextensions.CustomResource']:
        return pulumi.get(self, "application")

    @property
    @pulumi.getter
    def irsa(self) -> pulumi.Output[Optional['Irsa']]:
        return pulumi.get(self, "irsa")

    @property
    @pulumi.getter(name="logGroupMetrics")
    def log_group_metrics(self) -> pulumi.Output[Optional['pulumi_aws.cloudwatch.LogGroup']]:
        return pulumi.get(self, "log_group_metrics")

    @property
    @pulumi.getter
    def namespace(self) -> pulumi.Output[Optional['pulumi_kubernetes.core.v1.Namespace']]:
        return pulumi.get(self, "namespace")


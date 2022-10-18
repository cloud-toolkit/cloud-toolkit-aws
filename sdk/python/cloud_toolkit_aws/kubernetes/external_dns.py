# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import copy
import warnings
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
from .. import _utilities
import pulumi_kubernetes

__all__ = ['ExternalDnsArgs', 'ExternalDns']

@pulumi.input_type
class ExternalDnsArgs:
    def __init__(__self__, *,
                 zone_arns: pulumi.Input[Sequence[pulumi.Input[str]]]):
        """
        The set of arguments for constructing a ExternalDns resource.
        """
        pulumi.set(__self__, "zone_arns", zone_arns)

    @property
    @pulumi.getter(name="zoneArns")
    def zone_arns(self) -> pulumi.Input[Sequence[pulumi.Input[str]]]:
        return pulumi.get(self, "zone_arns")

    @zone_arns.setter
    def zone_arns(self, value: pulumi.Input[Sequence[pulumi.Input[str]]]):
        pulumi.set(self, "zone_arns", value)


class ExternalDns(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 zone_arns: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 __props__=None):
        """
        Create a ExternalDns resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: ExternalDnsArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        Create a ExternalDns resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param ExternalDnsArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(ExternalDnsArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 zone_arns: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = ExternalDnsArgs.__new__(ExternalDnsArgs)

            if zone_arns is None and not opts.urn:
                raise TypeError("Missing required property 'zone_arns'")
            __props__.__dict__["zone_arns"] = zone_arns
            __props__.__dict__["application"] = None
            __props__.__dict__["irsa"] = None
            __props__.__dict__["namespace"] = None
        super(ExternalDns, __self__).__init__(
            'cloud-toolkit-aws:kubernetes:ExternalDns',
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
    def irsa(self) -> pulumi.Output[Any]:
        return pulumi.get(self, "irsa")

    @property
    @pulumi.getter
    def namespace(self) -> pulumi.Output[Optional['pulumi_kubernetes.core.v1.Namespace']]:
        return pulumi.get(self, "namespace")


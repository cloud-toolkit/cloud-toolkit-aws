# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import copy
import warnings
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
from .. import _utilities
from ._enums import *

__all__ = [
    'AddonsArgsArgs',
    'ClusterAddonsIngressArgsArgs',
    'ClusterAddonsIngressItemArgsArgs',
    'ClusterApiArgsArgs',
    'ClusterNodeGroupArgsArgs',
    'ClusterOidcProvidersArgsArgs',
    'ClusterPrivateApiArgsArgs',
    'ClusterPublicApiArgsArgs',
]

@pulumi.input_type
class AddonsArgsArgs:
    def __init__(__self__, *,
                 enabled: pulumi.Input[bool]):
        pulumi.set(__self__, "enabled", enabled)

    @property
    @pulumi.getter
    def enabled(self) -> pulumi.Input[bool]:
        return pulumi.get(self, "enabled")

    @enabled.setter
    def enabled(self, value: pulumi.Input[bool]):
        pulumi.set(self, "enabled", value)


@pulumi.input_type
class ClusterAddonsIngressArgsArgs:
    def __init__(__self__, *,
                 admin: Optional[pulumi.Input['ClusterAddonsIngressItemArgsArgs']] = None,
                 enabled: Optional[pulumi.Input[bool]] = None,
                 global_: Optional[pulumi.Input['ClusterAddonsIngressItemArgsArgs']] = None):
        if admin is not None:
            pulumi.set(__self__, "admin", admin)
        if enabled is not None:
            pulumi.set(__self__, "enabled", enabled)
        if global_ is not None:
            pulumi.set(__self__, "global_", global_)

    @property
    @pulumi.getter
    def admin(self) -> Optional[pulumi.Input['ClusterAddonsIngressItemArgsArgs']]:
        return pulumi.get(self, "admin")

    @admin.setter
    def admin(self, value: Optional[pulumi.Input['ClusterAddonsIngressItemArgsArgs']]):
        pulumi.set(self, "admin", value)

    @property
    @pulumi.getter
    def enabled(self) -> Optional[pulumi.Input[bool]]:
        return pulumi.get(self, "enabled")

    @enabled.setter
    def enabled(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "enabled", value)

    @property
    @pulumi.getter(name="global")
    def global_(self) -> Optional[pulumi.Input['ClusterAddonsIngressItemArgsArgs']]:
        return pulumi.get(self, "global_")

    @global_.setter
    def global_(self, value: Optional[pulumi.Input['ClusterAddonsIngressItemArgsArgs']]):
        pulumi.set(self, "global_", value)


@pulumi.input_type
class ClusterAddonsIngressItemArgsArgs:
    def __init__(__self__, *,
                 public: Optional[pulumi.Input[bool]] = None,
                 whitelist: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None):
        if public is not None:
            pulumi.set(__self__, "public", public)
        if whitelist is not None:
            pulumi.set(__self__, "whitelist", whitelist)

    @property
    @pulumi.getter
    def public(self) -> Optional[pulumi.Input[bool]]:
        return pulumi.get(self, "public")

    @public.setter
    def public(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "public", value)

    @property
    @pulumi.getter
    def whitelist(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        return pulumi.get(self, "whitelist")

    @whitelist.setter
    def whitelist(self, value: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]):
        pulumi.set(self, "whitelist", value)


@pulumi.input_type
class ClusterApiArgsArgs:
    def __init__(__self__, *,
                 private: Optional[pulumi.Input['ClusterPrivateApiArgsArgs']] = None,
                 public: Optional[pulumi.Input['ClusterPublicApiArgsArgs']] = None):
        """
        :param pulumi.Input['ClusterPrivateApiArgsArgs'] private: Configure the private endpoint for the Kubernetes API.
        :param pulumi.Input['ClusterPublicApiArgsArgs'] public: Configure the public endpoint for the Kubernetes API.
        """
        if private is not None:
            pulumi.set(__self__, "private", private)
        if public is not None:
            pulumi.set(__self__, "public", public)

    @property
    @pulumi.getter
    def private(self) -> Optional[pulumi.Input['ClusterPrivateApiArgsArgs']]:
        """
        Configure the private endpoint for the Kubernetes API.
        """
        return pulumi.get(self, "private")

    @private.setter
    def private(self, value: Optional[pulumi.Input['ClusterPrivateApiArgsArgs']]):
        pulumi.set(self, "private", value)

    @property
    @pulumi.getter
    def public(self) -> Optional[pulumi.Input['ClusterPublicApiArgsArgs']]:
        """
        Configure the public endpoint for the Kubernetes API.
        """
        return pulumi.get(self, "public")

    @public.setter
    def public(self, value: Optional[pulumi.Input['ClusterPublicApiArgsArgs']]):
        pulumi.set(self, "public", value)


@pulumi.input_type
class ClusterNodeGroupArgsArgs:
    def __init__(__self__, *,
                 max_count: pulumi.Input[float],
                 max_unavailable: pulumi.Input[float],
                 min_count: pulumi.Input[float],
                 name: pulumi.Input[str],
                 instance_type: Optional[pulumi.Input[str]] = None,
                 subnets_type: Optional[pulumi.Input['ClusterSubnetsType']] = None):
        """
        :param pulumi.Input[float] max_count: The maxium number of nodes running in the node group. Defaults to 2.
        :param pulumi.Input[float] max_unavailable: The maximum number of nodes unavailable at once during a version update. Defaults to 1.
        :param pulumi.Input[float] min_count: The minimum number of nodes running in the node group. Defaults to 1.
        :param pulumi.Input[str] name: The Node Group name.
        :param pulumi.Input[str] instance_type: The EC2 Instance Type to be used to create the Nodes.
        :param pulumi.Input['ClusterSubnetsType'] subnets_type: The subnets type to be used to deploy the Node Groups.
        """
        pulumi.set(__self__, "max_count", max_count)
        pulumi.set(__self__, "max_unavailable", max_unavailable)
        pulumi.set(__self__, "min_count", min_count)
        pulumi.set(__self__, "name", name)
        if instance_type is not None:
            pulumi.set(__self__, "instance_type", instance_type)
        if subnets_type is not None:
            pulumi.set(__self__, "subnets_type", subnets_type)

    @property
    @pulumi.getter(name="maxCount")
    def max_count(self) -> pulumi.Input[float]:
        """
        The maxium number of nodes running in the node group. Defaults to 2.
        """
        return pulumi.get(self, "max_count")

    @max_count.setter
    def max_count(self, value: pulumi.Input[float]):
        pulumi.set(self, "max_count", value)

    @property
    @pulumi.getter(name="maxUnavailable")
    def max_unavailable(self) -> pulumi.Input[float]:
        """
        The maximum number of nodes unavailable at once during a version update. Defaults to 1.
        """
        return pulumi.get(self, "max_unavailable")

    @max_unavailable.setter
    def max_unavailable(self, value: pulumi.Input[float]):
        pulumi.set(self, "max_unavailable", value)

    @property
    @pulumi.getter(name="minCount")
    def min_count(self) -> pulumi.Input[float]:
        """
        The minimum number of nodes running in the node group. Defaults to 1.
        """
        return pulumi.get(self, "min_count")

    @min_count.setter
    def min_count(self, value: pulumi.Input[float]):
        pulumi.set(self, "min_count", value)

    @property
    @pulumi.getter
    def name(self) -> pulumi.Input[str]:
        """
        The Node Group name.
        """
        return pulumi.get(self, "name")

    @name.setter
    def name(self, value: pulumi.Input[str]):
        pulumi.set(self, "name", value)

    @property
    @pulumi.getter(name="instanceType")
    def instance_type(self) -> Optional[pulumi.Input[str]]:
        """
        The EC2 Instance Type to be used to create the Nodes.
        """
        return pulumi.get(self, "instance_type")

    @instance_type.setter
    def instance_type(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "instance_type", value)

    @property
    @pulumi.getter(name="subnetsType")
    def subnets_type(self) -> Optional[pulumi.Input['ClusterSubnetsType']]:
        """
        The subnets type to be used to deploy the Node Groups.
        """
        return pulumi.get(self, "subnets_type")

    @subnets_type.setter
    def subnets_type(self, value: Optional[pulumi.Input['ClusterSubnetsType']]):
        pulumi.set(self, "subnets_type", value)


@pulumi.input_type
class ClusterOidcProvidersArgsArgs:
    def __init__(__self__, *,
                 enable_default_provider: pulumi.Input[bool]):
        """
        :param pulumi.Input[bool] enable_default_provider: Enable the default OIDC Provider that is used in the cluster to let Service Accounts to authenticate against AWS with a given IAM Role.
        """
        pulumi.set(__self__, "enable_default_provider", enable_default_provider)

    @property
    @pulumi.getter(name="enableDefaultProvider")
    def enable_default_provider(self) -> pulumi.Input[bool]:
        """
        Enable the default OIDC Provider that is used in the cluster to let Service Accounts to authenticate against AWS with a given IAM Role.
        """
        return pulumi.get(self, "enable_default_provider")

    @enable_default_provider.setter
    def enable_default_provider(self, value: pulumi.Input[bool]):
        pulumi.set(self, "enable_default_provider", value)


@pulumi.input_type
class ClusterPrivateApiArgsArgs:
    def __init__(__self__, *,
                 enabled: Optional[pulumi.Input[bool]] = None):
        """
        :param pulumi.Input[bool] enabled: Enable the private endpoint for Kubernetes API.
        """
        if enabled is not None:
            pulumi.set(__self__, "enabled", enabled)

    @property
    @pulumi.getter
    def enabled(self) -> Optional[pulumi.Input[bool]]:
        """
        Enable the private endpoint for Kubernetes API.
        """
        return pulumi.get(self, "enabled")

    @enabled.setter
    def enabled(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "enabled", value)


@pulumi.input_type
class ClusterPublicApiArgsArgs:
    def __init__(__self__, *,
                 enabled: Optional[pulumi.Input[bool]] = None,
                 whitelist: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None):
        """
        :param pulumi.Input[bool] enabled: Enable the public endpoint for Kubernetes API.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] whitelist: The list of CIDR that will be allowed to reach the public endpoint for Kubernetes API.
        """
        if enabled is not None:
            pulumi.set(__self__, "enabled", enabled)
        if whitelist is not None:
            pulumi.set(__self__, "whitelist", whitelist)

    @property
    @pulumi.getter
    def enabled(self) -> Optional[pulumi.Input[bool]]:
        """
        Enable the public endpoint for Kubernetes API.
        """
        return pulumi.get(self, "enabled")

    @enabled.setter
    def enabled(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "enabled", value)

    @property
    @pulumi.getter
    def whitelist(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        """
        The list of CIDR that will be allowed to reach the public endpoint for Kubernetes API.
        """
        return pulumi.get(self, "whitelist")

    @whitelist.setter
    def whitelist(self, value: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]):
        pulumi.set(self, "whitelist", value)



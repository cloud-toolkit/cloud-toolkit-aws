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
    'AddonsArgs',
    'AdotApplicationMetricsArgs',
    'ClusterAddonsIngressItemArgs',
    'ClusterAddonsIngressArgs',
    'ClusterApiArgs',
    'ClusterAuthenticationArgs',
    'ClusterNetworkingIngressArgs',
    'ClusterNetworkingArgs',
    'ClusterNodeGroupArgs',
    'ClusterOidcProvidersArgs',
    'ClusterPrivateApiArgs',
    'ClusterPublicApiArgs',
    'FluentbitLoggingItemArgs',
    'FluentbitLoggingArgs',
    'IamAuthenticatorRoleArgs',
    'IamAuthenticatorUserArgs',
    'IngressNginxTlsArgs',
    'ProjectResourcesArgs',
]

@pulumi.input_type
class AddonsArgs:
    def __init__(__self__, *,
                 enabled: pulumi.Input[bool]):
        """
        :param pulumi.Input[bool] enabled: Enable the ClusterAddons.
        """
        pulumi.set(__self__, "enabled", enabled)

    @property
    @pulumi.getter
    def enabled(self) -> pulumi.Input[bool]:
        """
        Enable the ClusterAddons.
        """
        return pulumi.get(self, "enabled")

    @enabled.setter
    def enabled(self, value: pulumi.Input[bool]):
        pulumi.set(self, "enabled", value)


@pulumi.input_type
class AdotApplicationMetricsArgs:
    def __init__(__self__, *,
                 data_retention: Optional[pulumi.Input[float]] = None,
                 enabled: Optional[pulumi.Input[bool]] = None):
        """
        :param pulumi.Input[float] data_retention: Data retention expressed in days.
        :param pulumi.Input[bool] enabled: Enable metrics.
        """
        if data_retention is not None:
            pulumi.set(__self__, "data_retention", data_retention)
        if enabled is not None:
            pulumi.set(__self__, "enabled", enabled)

    @property
    @pulumi.getter(name="dataRetention")
    def data_retention(self) -> Optional[pulumi.Input[float]]:
        """
        Data retention expressed in days.
        """
        return pulumi.get(self, "data_retention")

    @data_retention.setter
    def data_retention(self, value: Optional[pulumi.Input[float]]):
        pulumi.set(self, "data_retention", value)

    @property
    @pulumi.getter
    def enabled(self) -> Optional[pulumi.Input[bool]]:
        """
        Enable metrics.
        """
        return pulumi.get(self, "enabled")

    @enabled.setter
    def enabled(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "enabled", value)


@pulumi.input_type
class ClusterAddonsIngressItemArgs:
    def __init__(__self__, *,
                 domain: Optional[pulumi.Input[str]] = None,
                 enable_tls_termination: Optional[pulumi.Input[bool]] = None,
                 public: Optional[pulumi.Input[bool]] = None,
                 whitelist: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None):
        """
        :param pulumi.Input[str] domain: The domain used to expose the IngressController.
        :param pulumi.Input[bool] enable_tls_termination: Enable TLS termination in Load Balancer.
        :param pulumi.Input[bool] public: Use a public Load Balancer to expose the IngressController.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] whitelist: Set a whitelist to access the IngressController.
        """
        if domain is not None:
            pulumi.set(__self__, "domain", domain)
        if enable_tls_termination is not None:
            pulumi.set(__self__, "enable_tls_termination", enable_tls_termination)
        if public is not None:
            pulumi.set(__self__, "public", public)
        if whitelist is not None:
            pulumi.set(__self__, "whitelist", whitelist)

    @property
    @pulumi.getter
    def domain(self) -> Optional[pulumi.Input[str]]:
        """
        The domain used to expose the IngressController.
        """
        return pulumi.get(self, "domain")

    @domain.setter
    def domain(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "domain", value)

    @property
    @pulumi.getter(name="enableTlsTermination")
    def enable_tls_termination(self) -> Optional[pulumi.Input[bool]]:
        """
        Enable TLS termination in Load Balancer.
        """
        return pulumi.get(self, "enable_tls_termination")

    @enable_tls_termination.setter
    def enable_tls_termination(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "enable_tls_termination", value)

    @property
    @pulumi.getter
    def public(self) -> Optional[pulumi.Input[bool]]:
        """
        Use a public Load Balancer to expose the IngressController.
        """
        return pulumi.get(self, "public")

    @public.setter
    def public(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "public", value)

    @property
    @pulumi.getter
    def whitelist(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        """
        Set a whitelist to access the IngressController.
        """
        return pulumi.get(self, "whitelist")

    @whitelist.setter
    def whitelist(self, value: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]):
        pulumi.set(self, "whitelist", value)


@pulumi.input_type
class ClusterAddonsIngressArgs:
    def __init__(__self__, *,
                 admin: Optional[pulumi.Input['ClusterAddonsIngressItemArgs']] = None,
                 default: Optional[pulumi.Input['ClusterAddonsIngressItemArgs']] = None):
        """
        :param pulumi.Input['ClusterAddonsIngressItemArgs'] admin: Configure the admin IngressController.
        :param pulumi.Input['ClusterAddonsIngressItemArgs'] default: Configure the default IngressController.
        """
        if admin is not None:
            pulumi.set(__self__, "admin", admin)
        if default is not None:
            pulumi.set(__self__, "default", default)

    @property
    @pulumi.getter
    def admin(self) -> Optional[pulumi.Input['ClusterAddonsIngressItemArgs']]:
        """
        Configure the admin IngressController.
        """
        return pulumi.get(self, "admin")

    @admin.setter
    def admin(self, value: Optional[pulumi.Input['ClusterAddonsIngressItemArgs']]):
        pulumi.set(self, "admin", value)

    @property
    @pulumi.getter
    def default(self) -> Optional[pulumi.Input['ClusterAddonsIngressItemArgs']]:
        """
        Configure the default IngressController.
        """
        return pulumi.get(self, "default")

    @default.setter
    def default(self, value: Optional[pulumi.Input['ClusterAddonsIngressItemArgs']]):
        pulumi.set(self, "default", value)


@pulumi.input_type
class ClusterApiArgs:
    def __init__(__self__, *,
                 private: Optional[pulumi.Input['ClusterPrivateApiArgs']] = None,
                 public: Optional[pulumi.Input['ClusterPublicApiArgs']] = None):
        """
        :param pulumi.Input['ClusterPrivateApiArgs'] private: Configure the private endpoint for the Kubernetes API.
        :param pulumi.Input['ClusterPublicApiArgs'] public: Configure the public endpoint for the Kubernetes API.
        """
        if private is not None:
            pulumi.set(__self__, "private", private)
        if public is not None:
            pulumi.set(__self__, "public", public)

    @property
    @pulumi.getter
    def private(self) -> Optional[pulumi.Input['ClusterPrivateApiArgs']]:
        """
        Configure the private endpoint for the Kubernetes API.
        """
        return pulumi.get(self, "private")

    @private.setter
    def private(self, value: Optional[pulumi.Input['ClusterPrivateApiArgs']]):
        pulumi.set(self, "private", value)

    @property
    @pulumi.getter
    def public(self) -> Optional[pulumi.Input['ClusterPublicApiArgs']]:
        """
        Configure the public endpoint for the Kubernetes API.
        """
        return pulumi.get(self, "public")

    @public.setter
    def public(self, value: Optional[pulumi.Input['ClusterPublicApiArgs']]):
        pulumi.set(self, "public", value)


@pulumi.input_type
class ClusterAuthenticationArgs:
    def __init__(__self__, *,
                 accounts: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 cluster_admins: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 roles: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]]] = None,
                 users: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorUserArgs']]]] = None):
        """
        :param pulumi.Input[Sequence[pulumi.Input[str]]] accounts: The list of AWS Accounts that can authenticate with the API Server.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] cluster_admins: The list of AWS IAM Users names to be configured as cluster-admin.
        :param pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]] roles: The list of AWS IAM Roles that can authenticate with the API server.
        :param pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorUserArgs']]] users: The list of AWS IAM Users that can authenticate with the API server.
        """
        if accounts is not None:
            pulumi.set(__self__, "accounts", accounts)
        if cluster_admins is not None:
            pulumi.set(__self__, "cluster_admins", cluster_admins)
        if roles is not None:
            pulumi.set(__self__, "roles", roles)
        if users is not None:
            pulumi.set(__self__, "users", users)

    @property
    @pulumi.getter
    def accounts(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        """
        The list of AWS Accounts that can authenticate with the API Server.
        """
        return pulumi.get(self, "accounts")

    @accounts.setter
    def accounts(self, value: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]):
        pulumi.set(self, "accounts", value)

    @property
    @pulumi.getter(name="clusterAdmins")
    def cluster_admins(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        """
        The list of AWS IAM Users names to be configured as cluster-admin.
        """
        return pulumi.get(self, "cluster_admins")

    @cluster_admins.setter
    def cluster_admins(self, value: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]):
        pulumi.set(self, "cluster_admins", value)

    @property
    @pulumi.getter
    def roles(self) -> Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]]]:
        """
        The list of AWS IAM Roles that can authenticate with the API server.
        """
        return pulumi.get(self, "roles")

    @roles.setter
    def roles(self, value: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]]]):
        pulumi.set(self, "roles", value)

    @property
    @pulumi.getter
    def users(self) -> Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorUserArgs']]]]:
        """
        The list of AWS IAM Users that can authenticate with the API server.
        """
        return pulumi.get(self, "users")

    @users.setter
    def users(self, value: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorUserArgs']]]]):
        pulumi.set(self, "users", value)


@pulumi.input_type
class ClusterNetworkingIngressArgs:
    def __init__(__self__, *,
                 domain: pulumi.Input[str],
                 enable_tls_termination: Optional[pulumi.Input[bool]] = None,
                 public: Optional[pulumi.Input[bool]] = None,
                 whitelist: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None):
        """
        :param pulumi.Input[str] domain: The domain used to expose the IngressController.
        :param pulumi.Input[bool] enable_tls_termination: Enable TLS termination in Load Balancer.
        :param pulumi.Input[bool] public: Use a public Load Balancer to expose the IngressController.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] whitelist: Set a whitelist to access the IngressController.
        """
        pulumi.set(__self__, "domain", domain)
        if enable_tls_termination is not None:
            pulumi.set(__self__, "enable_tls_termination", enable_tls_termination)
        if public is not None:
            pulumi.set(__self__, "public", public)
        if whitelist is not None:
            pulumi.set(__self__, "whitelist", whitelist)

    @property
    @pulumi.getter
    def domain(self) -> pulumi.Input[str]:
        """
        The domain used to expose the IngressController.
        """
        return pulumi.get(self, "domain")

    @domain.setter
    def domain(self, value: pulumi.Input[str]):
        pulumi.set(self, "domain", value)

    @property
    @pulumi.getter(name="enableTlsTermination")
    def enable_tls_termination(self) -> Optional[pulumi.Input[bool]]:
        """
        Enable TLS termination in Load Balancer.
        """
        return pulumi.get(self, "enable_tls_termination")

    @enable_tls_termination.setter
    def enable_tls_termination(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "enable_tls_termination", value)

    @property
    @pulumi.getter
    def public(self) -> Optional[pulumi.Input[bool]]:
        """
        Use a public Load Balancer to expose the IngressController.
        """
        return pulumi.get(self, "public")

    @public.setter
    def public(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "public", value)

    @property
    @pulumi.getter
    def whitelist(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        """
        Set a whitelist to access the IngressController.
        """
        return pulumi.get(self, "whitelist")

    @whitelist.setter
    def whitelist(self, value: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]):
        pulumi.set(self, "whitelist", value)


@pulumi.input_type
class ClusterNetworkingArgs:
    def __init__(__self__, *,
                 admin: Optional[pulumi.Input['ClusterNetworkingIngressArgs']] = None,
                 default: Optional[pulumi.Input['ClusterNetworkingIngressArgs']] = None):
        """
        :param pulumi.Input['ClusterNetworkingIngressArgs'] admin: Configure the access to admin applications.
        :param pulumi.Input['ClusterNetworkingIngressArgs'] default: Configure the access to applications.
        """
        if admin is not None:
            pulumi.set(__self__, "admin", admin)
        if default is not None:
            pulumi.set(__self__, "default", default)

    @property
    @pulumi.getter
    def admin(self) -> Optional[pulumi.Input['ClusterNetworkingIngressArgs']]:
        """
        Configure the access to admin applications.
        """
        return pulumi.get(self, "admin")

    @admin.setter
    def admin(self, value: Optional[pulumi.Input['ClusterNetworkingIngressArgs']]):
        pulumi.set(self, "admin", value)

    @property
    @pulumi.getter
    def default(self) -> Optional[pulumi.Input['ClusterNetworkingIngressArgs']]:
        """
        Configure the access to applications.
        """
        return pulumi.get(self, "default")

    @default.setter
    def default(self, value: Optional[pulumi.Input['ClusterNetworkingIngressArgs']]):
        pulumi.set(self, "default", value)


@pulumi.input_type
class ClusterNodeGroupArgs:
    def __init__(__self__, *,
                 max_count: pulumi.Input[float],
                 max_unavailable: pulumi.Input[float],
                 min_count: pulumi.Input[float],
                 name: pulumi.Input[str],
                 disk_size: Optional[pulumi.Input[float]] = None,
                 instance_type: Optional[pulumi.Input[str]] = None,
                 subnets_type: Optional[pulumi.Input['ClusterSubnetsType']] = None):
        """
        :param pulumi.Input[float] max_count: The maxium number of nodes running in the node group. Defaults to 2.
        :param pulumi.Input[float] max_unavailable: The maximum number of nodes unavailable at once during a version update. Defaults to 1.
        :param pulumi.Input[float] min_count: The minimum number of nodes running in the node group. Defaults to 1.
        :param pulumi.Input[str] name: The Node Group name.
        :param pulumi.Input[float] disk_size: Disk size in GiB for each node. Defaults to 20.
        :param pulumi.Input[str] instance_type: The EC2 Instance Type to be used to create the Nodes.
        :param pulumi.Input['ClusterSubnetsType'] subnets_type: The subnets type to be used to deploy the Node Groups.
        """
        pulumi.set(__self__, "max_count", max_count)
        pulumi.set(__self__, "max_unavailable", max_unavailable)
        pulumi.set(__self__, "min_count", min_count)
        pulumi.set(__self__, "name", name)
        if disk_size is not None:
            pulumi.set(__self__, "disk_size", disk_size)
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
    @pulumi.getter(name="diskSize")
    def disk_size(self) -> Optional[pulumi.Input[float]]:
        """
        Disk size in GiB for each node. Defaults to 20.
        """
        return pulumi.get(self, "disk_size")

    @disk_size.setter
    def disk_size(self, value: Optional[pulumi.Input[float]]):
        pulumi.set(self, "disk_size", value)

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
class ClusterOidcProvidersArgs:
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
class ClusterPrivateApiArgs:
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
class ClusterPublicApiArgs:
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


@pulumi.input_type
class FluentbitLoggingItemArgs:
    def __init__(__self__, *,
                 enabled: pulumi.Input[bool],
                 data_retention: Optional[pulumi.Input[float]] = None):
        """
        :param pulumi.Input[bool] enabled: Enable logging.
        :param pulumi.Input[float] data_retention: Data retention expressed in days.
        """
        pulumi.set(__self__, "enabled", enabled)
        if data_retention is not None:
            pulumi.set(__self__, "data_retention", data_retention)

    @property
    @pulumi.getter
    def enabled(self) -> pulumi.Input[bool]:
        """
        Enable logging.
        """
        return pulumi.get(self, "enabled")

    @enabled.setter
    def enabled(self, value: pulumi.Input[bool]):
        pulumi.set(self, "enabled", value)

    @property
    @pulumi.getter(name="dataRetention")
    def data_retention(self) -> Optional[pulumi.Input[float]]:
        """
        Data retention expressed in days.
        """
        return pulumi.get(self, "data_retention")

    @data_retention.setter
    def data_retention(self, value: Optional[pulumi.Input[float]]):
        pulumi.set(self, "data_retention", value)


@pulumi.input_type
class FluentbitLoggingArgs:
    def __init__(__self__, *,
                 applications: Optional[pulumi.Input['FluentbitLoggingItemArgs']] = None,
                 dataplane: Optional[pulumi.Input['FluentbitLoggingItemArgs']] = None,
                 host: Optional[pulumi.Input['FluentbitLoggingItemArgs']] = None):
        """
        :param pulumi.Input['FluentbitLoggingItemArgs'] applications: Configure applications logging.
        :param pulumi.Input['FluentbitLoggingItemArgs'] dataplane: Configure data plane logging.
        :param pulumi.Input['FluentbitLoggingItemArgs'] host: Configure host logging.
        """
        if applications is not None:
            pulumi.set(__self__, "applications", applications)
        if dataplane is not None:
            pulumi.set(__self__, "dataplane", dataplane)
        if host is not None:
            pulumi.set(__self__, "host", host)

    @property
    @pulumi.getter
    def applications(self) -> Optional[pulumi.Input['FluentbitLoggingItemArgs']]:
        """
        Configure applications logging.
        """
        return pulumi.get(self, "applications")

    @applications.setter
    def applications(self, value: Optional[pulumi.Input['FluentbitLoggingItemArgs']]):
        pulumi.set(self, "applications", value)

    @property
    @pulumi.getter
    def dataplane(self) -> Optional[pulumi.Input['FluentbitLoggingItemArgs']]:
        """
        Configure data plane logging.
        """
        return pulumi.get(self, "dataplane")

    @dataplane.setter
    def dataplane(self, value: Optional[pulumi.Input['FluentbitLoggingItemArgs']]):
        pulumi.set(self, "dataplane", value)

    @property
    @pulumi.getter
    def host(self) -> Optional[pulumi.Input['FluentbitLoggingItemArgs']]:
        """
        Configure host logging.
        """
        return pulumi.get(self, "host")

    @host.setter
    def host(self, value: Optional[pulumi.Input['FluentbitLoggingItemArgs']]):
        pulumi.set(self, "host", value)


@pulumi.input_type
class IamAuthenticatorRoleArgs:
    def __init__(__self__, *,
                 rolearn: pulumi.Input[str],
                 username: pulumi.Input[str],
                 groups: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None):
        """
        :param pulumi.Input[str] rolearn: The AWS IAM Role arn.
        :param pulumi.Input[str] username: The Kubernetes username to be associated with the AWS IAM Role.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] groups: The list of Kubernetes groups to be associated with the AWS IAM Role.
        """
        pulumi.set(__self__, "rolearn", rolearn)
        pulumi.set(__self__, "username", username)
        if groups is not None:
            pulumi.set(__self__, "groups", groups)

    @property
    @pulumi.getter
    def rolearn(self) -> pulumi.Input[str]:
        """
        The AWS IAM Role arn.
        """
        return pulumi.get(self, "rolearn")

    @rolearn.setter
    def rolearn(self, value: pulumi.Input[str]):
        pulumi.set(self, "rolearn", value)

    @property
    @pulumi.getter
    def username(self) -> pulumi.Input[str]:
        """
        The Kubernetes username to be associated with the AWS IAM Role.
        """
        return pulumi.get(self, "username")

    @username.setter
    def username(self, value: pulumi.Input[str]):
        pulumi.set(self, "username", value)

    @property
    @pulumi.getter
    def groups(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        """
        The list of Kubernetes groups to be associated with the AWS IAM Role.
        """
        return pulumi.get(self, "groups")

    @groups.setter
    def groups(self, value: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]):
        pulumi.set(self, "groups", value)


@pulumi.input_type
class IamAuthenticatorUserArgs:
    def __init__(__self__, *,
                 userarn: pulumi.Input[str],
                 username: pulumi.Input[str],
                 groups: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None):
        """
        :param pulumi.Input[str] userarn: The AWS IAM User arn.
        :param pulumi.Input[str] username: The Kubernetes username to be associated with the AWS IAM User.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] groups: The list of Kubernetes groups to be associated with the AWS IAM User.
        """
        pulumi.set(__self__, "userarn", userarn)
        pulumi.set(__self__, "username", username)
        if groups is not None:
            pulumi.set(__self__, "groups", groups)

    @property
    @pulumi.getter
    def userarn(self) -> pulumi.Input[str]:
        """
        The AWS IAM User arn.
        """
        return pulumi.get(self, "userarn")

    @userarn.setter
    def userarn(self, value: pulumi.Input[str]):
        pulumi.set(self, "userarn", value)

    @property
    @pulumi.getter
    def username(self) -> pulumi.Input[str]:
        """
        The Kubernetes username to be associated with the AWS IAM User.
        """
        return pulumi.get(self, "username")

    @username.setter
    def username(self, value: pulumi.Input[str]):
        pulumi.set(self, "username", value)

    @property
    @pulumi.getter
    def groups(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        """
        The list of Kubernetes groups to be associated with the AWS IAM User.
        """
        return pulumi.get(self, "groups")

    @groups.setter
    def groups(self, value: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]):
        pulumi.set(self, "groups", value)


@pulumi.input_type
class IngressNginxTlsArgs:
    def __init__(__self__, *,
                 domain: pulumi.Input[str],
                 zone_id: pulumi.Input[str],
                 enabled: Optional[pulumi.Input[bool]] = None):
        """
        :param pulumi.Input[str] domain: The domain to be used to create a signed Certificate.
        :param pulumi.Input[str] zone_id: The Zone id.
        :param pulumi.Input[bool] enabled: Enable the signed Certificate.
        """
        pulumi.set(__self__, "domain", domain)
        pulumi.set(__self__, "zone_id", zone_id)
        if enabled is not None:
            pulumi.set(__self__, "enabled", enabled)

    @property
    @pulumi.getter
    def domain(self) -> pulumi.Input[str]:
        """
        The domain to be used to create a signed Certificate.
        """
        return pulumi.get(self, "domain")

    @domain.setter
    def domain(self, value: pulumi.Input[str]):
        pulumi.set(self, "domain", value)

    @property
    @pulumi.getter(name="zoneId")
    def zone_id(self) -> pulumi.Input[str]:
        """
        The Zone id.
        """
        return pulumi.get(self, "zone_id")

    @zone_id.setter
    def zone_id(self, value: pulumi.Input[str]):
        pulumi.set(self, "zone_id", value)

    @property
    @pulumi.getter
    def enabled(self) -> Optional[pulumi.Input[bool]]:
        """
        Enable the signed Certificate.
        """
        return pulumi.get(self, "enabled")

    @enabled.setter
    def enabled(self, value: Optional[pulumi.Input[bool]]):
        pulumi.set(self, "enabled", value)


@pulumi.input_type
class ProjectResourcesArgs:
    def __init__(__self__, *,
                 cpu: Optional[pulumi.Input[str]] = None,
                 limit_cpu: Optional[pulumi.Input[str]] = None,
                 limit_memory: Optional[pulumi.Input[str]] = None,
                 memory: Optional[pulumi.Input[str]] = None):
        """
        :param pulumi.Input[str] cpu: Amount of reserved CPU.
        :param pulumi.Input[str] limit_cpu: Amount of CPU limit.
        :param pulumi.Input[str] limit_memory: Amount of Memory limit.
        :param pulumi.Input[str] memory: Amount of reserved Memory.
        """
        if cpu is not None:
            pulumi.set(__self__, "cpu", cpu)
        if limit_cpu is not None:
            pulumi.set(__self__, "limit_cpu", limit_cpu)
        if limit_memory is not None:
            pulumi.set(__self__, "limit_memory", limit_memory)
        if memory is not None:
            pulumi.set(__self__, "memory", memory)

    @property
    @pulumi.getter
    def cpu(self) -> Optional[pulumi.Input[str]]:
        """
        Amount of reserved CPU.
        """
        return pulumi.get(self, "cpu")

    @cpu.setter
    def cpu(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "cpu", value)

    @property
    @pulumi.getter(name="limitCpu")
    def limit_cpu(self) -> Optional[pulumi.Input[str]]:
        """
        Amount of CPU limit.
        """
        return pulumi.get(self, "limit_cpu")

    @limit_cpu.setter
    def limit_cpu(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "limit_cpu", value)

    @property
    @pulumi.getter(name="limitMemory")
    def limit_memory(self) -> Optional[pulumi.Input[str]]:
        """
        Amount of Memory limit.
        """
        return pulumi.get(self, "limit_memory")

    @limit_memory.setter
    def limit_memory(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "limit_memory", value)

    @property
    @pulumi.getter
    def memory(self) -> Optional[pulumi.Input[str]]:
        """
        Amount of reserved Memory.
        """
        return pulumi.get(self, "memory")

    @memory.setter
    def memory(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "memory", value)



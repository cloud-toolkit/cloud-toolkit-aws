# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import copy
import warnings
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
from .. import _utilities
import pulumi_aws
import pulumi_kubernetes

__all__ = ['IrsaArgs', 'Irsa']

@pulumi.input_type
class IrsaArgs:
    def __init__(__self__, *,
                 identity_providers_arn: pulumi.Input[Sequence[pulumi.Input[str]]],
                 issuer_url: pulumi.Input[str],
                 k8s_provider: pulumi.Input['pulumi_kubernetes.Provider'],
                 namespace: pulumi.Input[str],
                 policies: pulumi.Input[Sequence[pulumi.Input[str]]],
                 service_account_name: pulumi.Input[str]):
        """
        The set of arguments for constructing a Irsa resource.
        """
        pulumi.set(__self__, "identity_providers_arn", identity_providers_arn)
        pulumi.set(__self__, "issuer_url", issuer_url)
        pulumi.set(__self__, "k8s_provider", k8s_provider)
        pulumi.set(__self__, "namespace", namespace)
        pulumi.set(__self__, "policies", policies)
        pulumi.set(__self__, "service_account_name", service_account_name)

    @property
    @pulumi.getter(name="identityProvidersArn")
    def identity_providers_arn(self) -> pulumi.Input[Sequence[pulumi.Input[str]]]:
        return pulumi.get(self, "identity_providers_arn")

    @identity_providers_arn.setter
    def identity_providers_arn(self, value: pulumi.Input[Sequence[pulumi.Input[str]]]):
        pulumi.set(self, "identity_providers_arn", value)

    @property
    @pulumi.getter(name="issuerUrl")
    def issuer_url(self) -> pulumi.Input[str]:
        return pulumi.get(self, "issuer_url")

    @issuer_url.setter
    def issuer_url(self, value: pulumi.Input[str]):
        pulumi.set(self, "issuer_url", value)

    @property
    @pulumi.getter(name="k8sProvider")
    def k8s_provider(self) -> pulumi.Input['pulumi_kubernetes.Provider']:
        return pulumi.get(self, "k8s_provider")

    @k8s_provider.setter
    def k8s_provider(self, value: pulumi.Input['pulumi_kubernetes.Provider']):
        pulumi.set(self, "k8s_provider", value)

    @property
    @pulumi.getter
    def namespace(self) -> pulumi.Input[str]:
        return pulumi.get(self, "namespace")

    @namespace.setter
    def namespace(self, value: pulumi.Input[str]):
        pulumi.set(self, "namespace", value)

    @property
    @pulumi.getter
    def policies(self) -> pulumi.Input[Sequence[pulumi.Input[str]]]:
        return pulumi.get(self, "policies")

    @policies.setter
    def policies(self, value: pulumi.Input[Sequence[pulumi.Input[str]]]):
        pulumi.set(self, "policies", value)

    @property
    @pulumi.getter(name="serviceAccountName")
    def service_account_name(self) -> pulumi.Input[str]:
        return pulumi.get(self, "service_account_name")

    @service_account_name.setter
    def service_account_name(self, value: pulumi.Input[str]):
        pulumi.set(self, "service_account_name", value)


class Irsa(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 identity_providers_arn: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 issuer_url: Optional[pulumi.Input[str]] = None,
                 k8s_provider: Optional[pulumi.Input['pulumi_kubernetes.Provider']] = None,
                 namespace: Optional[pulumi.Input[str]] = None,
                 policies: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 service_account_name: Optional[pulumi.Input[str]] = None,
                 __props__=None):
        """
        Create a Irsa resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: IrsaArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        Create a Irsa resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param IrsaArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(IrsaArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 identity_providers_arn: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 issuer_url: Optional[pulumi.Input[str]] = None,
                 k8s_provider: Optional[pulumi.Input['pulumi_kubernetes.Provider']] = None,
                 namespace: Optional[pulumi.Input[str]] = None,
                 policies: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 service_account_name: Optional[pulumi.Input[str]] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = IrsaArgs.__new__(IrsaArgs)

            if identity_providers_arn is None and not opts.urn:
                raise TypeError("Missing required property 'identity_providers_arn'")
            __props__.__dict__["identity_providers_arn"] = identity_providers_arn
            if issuer_url is None and not opts.urn:
                raise TypeError("Missing required property 'issuer_url'")
            __props__.__dict__["issuer_url"] = issuer_url
            if k8s_provider is None and not opts.urn:
                raise TypeError("Missing required property 'k8s_provider'")
            __props__.__dict__["k8s_provider"] = k8s_provider
            if namespace is None and not opts.urn:
                raise TypeError("Missing required property 'namespace'")
            __props__.__dict__["namespace"] = namespace
            if policies is None and not opts.urn:
                raise TypeError("Missing required property 'policies'")
            __props__.__dict__["policies"] = policies
            if service_account_name is None and not opts.urn:
                raise TypeError("Missing required property 'service_account_name'")
            __props__.__dict__["service_account_name"] = service_account_name
            __props__.__dict__["name"] = None
            __props__.__dict__["role"] = None
            __props__.__dict__["role_policy_attachments"] = None
            __props__.__dict__["service_account"] = None
        super(Irsa, __self__).__init__(
            'cloud-toolkit-aws:kubernetes:Irsa',
            resource_name,
            __props__,
            opts,
            remote=True)

    @property
    @pulumi.getter
    def name(self) -> pulumi.Output[str]:
        return pulumi.get(self, "name")

    @property
    @pulumi.getter
    def policies(self) -> pulumi.Output[Sequence['pulumi_aws.iam.Policy']]:
        return pulumi.get(self, "policies")

    @property
    @pulumi.getter
    def role(self) -> pulumi.Output['pulumi_aws.iam.Role']:
        return pulumi.get(self, "role")

    @property
    @pulumi.getter(name="rolePolicyAttachments")
    def role_policy_attachments(self) -> pulumi.Output[Sequence['pulumi_aws.iam.RolePolicyAttachment']]:
        return pulumi.get(self, "role_policy_attachments")

    @property
    @pulumi.getter(name="serviceAccount")
    def service_account(self) -> pulumi.Output['pulumi_kubernetes.core.v1.ServiceAccount']:
        return pulumi.get(self, "service_account")

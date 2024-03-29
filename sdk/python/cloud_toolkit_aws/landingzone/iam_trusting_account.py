# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import copy
import warnings
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
from .. import _utilities
from . import outputs
from ._inputs import *
import pulumi_aws

__all__ = ['IamTrustingAccountArgs', 'IamTrustingAccount']

@pulumi.input_type
class IamTrustingAccountArgs:
    def __init__(__self__, *,
                 delegated_account_ids: pulumi.Input[Sequence[pulumi.Input[str]]],
                 delegated_roles: Optional[pulumi.Input[Sequence[pulumi.Input['IamTrustingAccountRoleArgs']]]] = None):
        """
        The set of arguments for constructing a IamTrustingAccount resource.
        """
        pulumi.set(__self__, "delegated_account_ids", delegated_account_ids)
        if delegated_roles is not None:
            pulumi.set(__self__, "delegated_roles", delegated_roles)

    @property
    @pulumi.getter(name="delegatedAccountIds")
    def delegated_account_ids(self) -> pulumi.Input[Sequence[pulumi.Input[str]]]:
        return pulumi.get(self, "delegated_account_ids")

    @delegated_account_ids.setter
    def delegated_account_ids(self, value: pulumi.Input[Sequence[pulumi.Input[str]]]):
        pulumi.set(self, "delegated_account_ids", value)

    @property
    @pulumi.getter(name="delegatedRoles")
    def delegated_roles(self) -> Optional[pulumi.Input[Sequence[pulumi.Input['IamTrustingAccountRoleArgs']]]]:
        return pulumi.get(self, "delegated_roles")

    @delegated_roles.setter
    def delegated_roles(self, value: Optional[pulumi.Input[Sequence[pulumi.Input['IamTrustingAccountRoleArgs']]]]):
        pulumi.set(self, "delegated_roles", value)


class IamTrustingAccount(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 delegated_account_ids: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 delegated_roles: Optional[pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamTrustingAccountRoleArgs']]]]] = None,
                 __props__=None):
        """
        Create a IamTrustingAccount resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: IamTrustingAccountArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        Create a IamTrustingAccount resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param IamTrustingAccountArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(IamTrustingAccountArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 delegated_account_ids: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 delegated_roles: Optional[pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamTrustingAccountRoleArgs']]]]] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = IamTrustingAccountArgs.__new__(IamTrustingAccountArgs)

            if delegated_account_ids is None and not opts.urn:
                raise TypeError("Missing required property 'delegated_account_ids'")
            __props__.__dict__["delegated_account_ids"] = delegated_account_ids
            __props__.__dict__["delegated_roles"] = delegated_roles
            __props__.__dict__["delegated_role_policy_attachments"] = None
        super(IamTrustingAccount, __self__).__init__(
            'cloud-toolkit-aws:landingzone:IamTrustingAccount',
            resource_name,
            __props__,
            opts,
            remote=True)

    @property
    @pulumi.getter(name="delegatedRolePolicyAttachments")
    def delegated_role_policy_attachments(self) -> pulumi.Output[Sequence['outputs.IamTrustingAccountRolePolicyAttachmentMapping']]:
        return pulumi.get(self, "delegated_role_policy_attachments")

    @property
    @pulumi.getter(name="delegatedRoles")
    def delegated_roles(self) -> pulumi.Output[Sequence['outputs.IamTrustingAccountRoleMapping']]:
        return pulumi.get(self, "delegated_roles")


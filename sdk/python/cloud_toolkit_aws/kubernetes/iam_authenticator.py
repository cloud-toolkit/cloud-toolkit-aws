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
import pulumi_kubernetes

__all__ = ['IamAuthenticatorArgs', 'IamAuthenticator']

@pulumi.input_type
class IamAuthenticatorArgs:
    def __init__(__self__, *,
                 cluster_arn: pulumi.Input[str],
                 kubeconfig: pulumi.Input[str],
                 accounts: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 cluster_admins: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 node_group_roles: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]]] = None,
                 roles: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]]] = None,
                 users: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorUserArgs']]]] = None):
        """
        The set of arguments for constructing a IamAuthenticator resource.
        :param pulumi.Input[str] cluster_arn: The EKS Cluster ARN.
        :param pulumi.Input[str] kubeconfig: The Kubeconfig to access to the cluster.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] accounts: List of AWS Accounts allowed to authenticate in the cluster.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] cluster_admins: The list of AWS IAM Users names to be configured as cluster-admin.
        :param pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]] node_group_roles: The list of AWS IAM Roles for NodeGroups to generate the aws-auth ConfigMap.
        :param pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]] roles: The list of AWS IAM Roles to generate the aws-auth ConfigMap.
        :param pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorUserArgs']]] users: The list of AWS IAM Users to generate the aws-auth ConfigMap.
        """
        pulumi.set(__self__, "cluster_arn", cluster_arn)
        pulumi.set(__self__, "kubeconfig", kubeconfig)
        if accounts is not None:
            pulumi.set(__self__, "accounts", accounts)
        if cluster_admins is not None:
            pulumi.set(__self__, "cluster_admins", cluster_admins)
        if node_group_roles is not None:
            pulumi.set(__self__, "node_group_roles", node_group_roles)
        if roles is not None:
            pulumi.set(__self__, "roles", roles)
        if users is not None:
            pulumi.set(__self__, "users", users)

    @property
    @pulumi.getter(name="clusterArn")
    def cluster_arn(self) -> pulumi.Input[str]:
        """
        The EKS Cluster ARN.
        """
        return pulumi.get(self, "cluster_arn")

    @cluster_arn.setter
    def cluster_arn(self, value: pulumi.Input[str]):
        pulumi.set(self, "cluster_arn", value)

    @property
    @pulumi.getter
    def kubeconfig(self) -> pulumi.Input[str]:
        """
        The Kubeconfig to access to the cluster.
        """
        return pulumi.get(self, "kubeconfig")

    @kubeconfig.setter
    def kubeconfig(self, value: pulumi.Input[str]):
        pulumi.set(self, "kubeconfig", value)

    @property
    @pulumi.getter
    def accounts(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        """
        List of AWS Accounts allowed to authenticate in the cluster.
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
    @pulumi.getter(name="nodeGroupRoles")
    def node_group_roles(self) -> Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]]]:
        """
        The list of AWS IAM Roles for NodeGroups to generate the aws-auth ConfigMap.
        """
        return pulumi.get(self, "node_group_roles")

    @node_group_roles.setter
    def node_group_roles(self, value: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]]]):
        pulumi.set(self, "node_group_roles", value)

    @property
    @pulumi.getter
    def roles(self) -> Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]]]:
        """
        The list of AWS IAM Roles to generate the aws-auth ConfigMap.
        """
        return pulumi.get(self, "roles")

    @roles.setter
    def roles(self, value: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorRoleArgs']]]]):
        pulumi.set(self, "roles", value)

    @property
    @pulumi.getter
    def users(self) -> Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorUserArgs']]]]:
        """
        The list of AWS IAM Users to generate the aws-auth ConfigMap.
        """
        return pulumi.get(self, "users")

    @users.setter
    def users(self, value: Optional[pulumi.Input[Sequence[pulumi.Input['IamAuthenticatorUserArgs']]]]):
        pulumi.set(self, "users", value)


class IamAuthenticator(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 accounts: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 cluster_admins: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 cluster_arn: Optional[pulumi.Input[str]] = None,
                 kubeconfig: Optional[pulumi.Input[str]] = None,
                 node_group_roles: Optional[pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamAuthenticatorRoleArgs']]]]] = None,
                 roles: Optional[pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamAuthenticatorRoleArgs']]]]] = None,
                 users: Optional[pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamAuthenticatorUserArgs']]]]] = None,
                 __props__=None):
        """
        IamAuthenticator is a component that integrates the AWS IAM service with the Kubernetes authentication system. He receives a list of AWS IAM users and roles to enable their authentication to the cluster.

        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] accounts: List of AWS Accounts allowed to authenticate in the cluster.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] cluster_admins: The list of AWS IAM Users names to be configured as cluster-admin.
        :param pulumi.Input[str] cluster_arn: The EKS Cluster ARN.
        :param pulumi.Input[str] kubeconfig: The Kubeconfig to access to the cluster.
        :param pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamAuthenticatorRoleArgs']]]] node_group_roles: The list of AWS IAM Roles for NodeGroups to generate the aws-auth ConfigMap.
        :param pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamAuthenticatorRoleArgs']]]] roles: The list of AWS IAM Roles to generate the aws-auth ConfigMap.
        :param pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamAuthenticatorUserArgs']]]] users: The list of AWS IAM Users to generate the aws-auth ConfigMap.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: IamAuthenticatorArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        IamAuthenticator is a component that integrates the AWS IAM service with the Kubernetes authentication system. He receives a list of AWS IAM users and roles to enable their authentication to the cluster.

        :param str resource_name: The name of the resource.
        :param IamAuthenticatorArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(IamAuthenticatorArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 accounts: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 cluster_admins: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 cluster_arn: Optional[pulumi.Input[str]] = None,
                 kubeconfig: Optional[pulumi.Input[str]] = None,
                 node_group_roles: Optional[pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamAuthenticatorRoleArgs']]]]] = None,
                 roles: Optional[pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamAuthenticatorRoleArgs']]]]] = None,
                 users: Optional[pulumi.Input[Sequence[pulumi.Input[pulumi.InputType['IamAuthenticatorUserArgs']]]]] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = IamAuthenticatorArgs.__new__(IamAuthenticatorArgs)

            __props__.__dict__["accounts"] = accounts
            __props__.__dict__["cluster_admins"] = cluster_admins
            if cluster_arn is None and not opts.urn:
                raise TypeError("Missing required property 'cluster_arn'")
            __props__.__dict__["cluster_arn"] = cluster_arn
            if kubeconfig is None and not opts.urn:
                raise TypeError("Missing required property 'kubeconfig'")
            __props__.__dict__["kubeconfig"] = kubeconfig
            __props__.__dict__["node_group_roles"] = node_group_roles
            __props__.__dict__["roles"] = roles
            __props__.__dict__["users"] = users
            __props__.__dict__["cluster_admin_group"] = None
            __props__.__dict__["cluster_admin_group_policy"] = None
            __props__.__dict__["cluster_admin_role"] = None
            __props__.__dict__["cluster_admin_role_policy"] = None
            __props__.__dict__["cluster_admin_user_group_memberships"] = None
            __props__.__dict__["cluster_user_policy"] = None
            __props__.__dict__["cluster_user_policy_attachment"] = None
            __props__.__dict__["config_map"] = None
            __props__.__dict__["provider"] = None
        super(IamAuthenticator, __self__).__init__(
            'cloud-toolkit-aws:kubernetes:IamAuthenticator',
            resource_name,
            __props__,
            opts,
            remote=True)

    @property
    @pulumi.getter(name="clusterAdminGroup")
    def cluster_admin_group(self) -> pulumi.Output['pulumi_aws.iam.Group']:
        """
        The AWS IAM Group that has admin permission in the cluster.
        """
        return pulumi.get(self, "cluster_admin_group")

    @property
    @pulumi.getter(name="clusterAdminGroupPolicy")
    def cluster_admin_group_policy(self) -> pulumi.Output['pulumi_aws.iam.GroupPolicy']:
        """
        The AWS IAM Group Policy that has admin permission in the cluster.
        """
        return pulumi.get(self, "cluster_admin_group_policy")

    @property
    @pulumi.getter(name="clusterAdminRole")
    def cluster_admin_role(self) -> pulumi.Output['pulumi_aws.iam.Role']:
        """
        The AWS IAM Role that has admin permission in the cluster.
        """
        return pulumi.get(self, "cluster_admin_role")

    @property
    @pulumi.getter(name="clusterAdminRolePolicy")
    def cluster_admin_role_policy(self) -> pulumi.Output['pulumi_aws.iam.RolePolicy']:
        """
        The AWS IAM Group Policy that has admin permission in the cluster.
        """
        return pulumi.get(self, "cluster_admin_role_policy")

    @property
    @pulumi.getter(name="clusterAdminUserGroupMemberships")
    def cluster_admin_user_group_memberships(self) -> pulumi.Output[Sequence['pulumi_aws.iam.UserGroupMembership']]:
        """
        The list of AWS IAM UserGroupMemebership to provide cluster-admin access to the given users.
        """
        return pulumi.get(self, "cluster_admin_user_group_memberships")

    @property
    @pulumi.getter(name="clusterUserPolicy")
    def cluster_user_policy(self) -> pulumi.Output['pulumi_aws.iam.Policy']:
        """
        The AWS IAM Group Policy that has admin permission in the cluster.
        """
        return pulumi.get(self, "cluster_user_policy")

    @property
    @pulumi.getter(name="clusterUserPolicyAttachment")
    def cluster_user_policy_attachment(self) -> pulumi.Output[Optional['pulumi_aws.iam.PolicyAttachment']]:
        """
        The AWS IAM Group Policy that has admin permission in the cluster.
        """
        return pulumi.get(self, "cluster_user_policy_attachment")

    @property
    @pulumi.getter(name="configMap")
    def config_map(self) -> pulumi.Output['pulumi_kubernetes.core.v1.ConfigMap']:
        """
        The Path applied to the authentication ConfigMap.
        """
        return pulumi.get(self, "config_map")

    @property
    @pulumi.getter
    def provider(self) -> pulumi.Output['pulumi_kubernetes.Provider']:
        """
        The Kubernetes provider.
        """
        return pulumi.get(self, "provider")


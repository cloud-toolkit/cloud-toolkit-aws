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
import pulumi_kubernetes

__all__ = ['ClusterAddonsArgs', 'ClusterAddons']

@pulumi.input_type
class ClusterAddonsArgs:
    def __init__(__self__, *,
                 cluster_name: pulumi.Input[str],
                 identity_providers_arn: pulumi.Input[Sequence[pulumi.Input[str]]],
                 issuer_url: pulumi.Input[str],
                 k8s_provider: pulumi.Input['pulumi_kubernetes.Provider'],
                 ingress: Optional[pulumi.Input['ClusterAddonsIngressArgsArgs']] = None):
        """
        The set of arguments for constructing a ClusterAddons resource.
        :param pulumi.Input[str] cluster_name: The EKS Cluster name.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] identity_providers_arn: The OIDC Identity Provider arn.
        :param pulumi.Input[str] issuer_url: The OIDC Identity Provider url.
        :param pulumi.Input['pulumi_kubernetes.Provider'] k8s_provider: The Pulumi provider used for Kubernetes resources.
        :param pulumi.Input['ClusterAddonsIngressArgsArgs'] ingress: The configuration for Ingress Controller.
        """
        pulumi.set(__self__, "cluster_name", cluster_name)
        pulumi.set(__self__, "identity_providers_arn", identity_providers_arn)
        pulumi.set(__self__, "issuer_url", issuer_url)
        pulumi.set(__self__, "k8s_provider", k8s_provider)
        if ingress is not None:
            pulumi.set(__self__, "ingress", ingress)

    @property
    @pulumi.getter(name="clusterName")
    def cluster_name(self) -> pulumi.Input[str]:
        """
        The EKS Cluster name.
        """
        return pulumi.get(self, "cluster_name")

    @cluster_name.setter
    def cluster_name(self, value: pulumi.Input[str]):
        pulumi.set(self, "cluster_name", value)

    @property
    @pulumi.getter(name="identityProvidersArn")
    def identity_providers_arn(self) -> pulumi.Input[Sequence[pulumi.Input[str]]]:
        """
        The OIDC Identity Provider arn.
        """
        return pulumi.get(self, "identity_providers_arn")

    @identity_providers_arn.setter
    def identity_providers_arn(self, value: pulumi.Input[Sequence[pulumi.Input[str]]]):
        pulumi.set(self, "identity_providers_arn", value)

    @property
    @pulumi.getter(name="issuerUrl")
    def issuer_url(self) -> pulumi.Input[str]:
        """
        The OIDC Identity Provider url.
        """
        return pulumi.get(self, "issuer_url")

    @issuer_url.setter
    def issuer_url(self, value: pulumi.Input[str]):
        pulumi.set(self, "issuer_url", value)

    @property
    @pulumi.getter(name="k8sProvider")
    def k8s_provider(self) -> pulumi.Input['pulumi_kubernetes.Provider']:
        """
        The Pulumi provider used for Kubernetes resources.
        """
        return pulumi.get(self, "k8s_provider")

    @k8s_provider.setter
    def k8s_provider(self, value: pulumi.Input['pulumi_kubernetes.Provider']):
        pulumi.set(self, "k8s_provider", value)

    @property
    @pulumi.getter
    def ingress(self) -> Optional[pulumi.Input['ClusterAddonsIngressArgsArgs']]:
        """
        The configuration for Ingress Controller.
        """
        return pulumi.get(self, "ingress")

    @ingress.setter
    def ingress(self, value: Optional[pulumi.Input['ClusterAddonsIngressArgsArgs']]):
        pulumi.set(self, "ingress", value)


class ClusterAddons(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 cluster_name: Optional[pulumi.Input[str]] = None,
                 identity_providers_arn: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 ingress: Optional[pulumi.Input[pulumi.InputType['ClusterAddonsIngressArgsArgs']]] = None,
                 issuer_url: Optional[pulumi.Input[str]] = None,
                 k8s_provider: Optional[pulumi.Input['pulumi_kubernetes.Provider']] = None,
                 __props__=None):
        """
        ClusterAddons is a component that manages the Lubernetes addons to setup a production-ready cluster.

        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        :param pulumi.Input[str] cluster_name: The EKS Cluster name.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] identity_providers_arn: The OIDC Identity Provider arn.
        :param pulumi.Input[pulumi.InputType['ClusterAddonsIngressArgsArgs']] ingress: The configuration for Ingress Controller.
        :param pulumi.Input[str] issuer_url: The OIDC Identity Provider url.
        :param pulumi.Input['pulumi_kubernetes.Provider'] k8s_provider: The Pulumi provider used for Kubernetes resources.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: ClusterAddonsArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        ClusterAddons is a component that manages the Lubernetes addons to setup a production-ready cluster.

        :param str resource_name: The name of the resource.
        :param ClusterAddonsArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(ClusterAddonsArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 cluster_name: Optional[pulumi.Input[str]] = None,
                 identity_providers_arn: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 ingress: Optional[pulumi.Input[pulumi.InputType['ClusterAddonsIngressArgsArgs']]] = None,
                 issuer_url: Optional[pulumi.Input[str]] = None,
                 k8s_provider: Optional[pulumi.Input['pulumi_kubernetes.Provider']] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = ClusterAddonsArgs.__new__(ClusterAddonsArgs)

            if cluster_name is None and not opts.urn:
                raise TypeError("Missing required property 'cluster_name'")
            __props__.__dict__["cluster_name"] = cluster_name
            if identity_providers_arn is None and not opts.urn:
                raise TypeError("Missing required property 'identity_providers_arn'")
            __props__.__dict__["identity_providers_arn"] = identity_providers_arn
            __props__.__dict__["ingress"] = ingress
            if issuer_url is None and not opts.urn:
                raise TypeError("Missing required property 'issuer_url'")
            __props__.__dict__["issuer_url"] = issuer_url
            if k8s_provider is None and not opts.urn:
                raise TypeError("Missing required property 'k8s_provider'")
            __props__.__dict__["k8s_provider"] = k8s_provider
            __props__.__dict__["admin_ingress_nginx"] = None
            __props__.__dict__["argocd"] = None
            __props__.__dict__["aws_load_balancer_controller"] = None
            __props__.__dict__["calico"] = None
            __props__.__dict__["cert_manager"] = None
            __props__.__dict__["cluster_autoscaler"] = None
            __props__.__dict__["dashboard"] = None
            __props__.__dict__["default_ingress_nginx"] = None
            __props__.__dict__["ebs_csi_driver"] = None
            __props__.__dict__["external_dns"] = None
        super(ClusterAddons, __self__).__init__(
            'cloud-toolkit-aws:kubernetes:ClusterAddons',
            resource_name,
            __props__,
            opts,
            remote=True)

    @property
    @pulumi.getter(name="adminIngressNginx")
    def admin_ingress_nginx(self) -> pulumi.Output[Optional[Any]]:
        """
        The IngressNginx addon used for admin access.
        """
        return pulumi.get(self, "admin_ingress_nginx")

    @property
    @pulumi.getter
    def argocd(self) -> pulumi.Output[Any]:
        """
        The ArgoCD addon.
        """
        return pulumi.get(self, "argocd")

    @property
    @pulumi.getter(name="awsLoadBalancerController")
    def aws_load_balancer_controller(self) -> pulumi.Output[Any]:
        """
        The AWS LoadBalancer Controller.
        """
        return pulumi.get(self, "aws_load_balancer_controller")

    @property
    @pulumi.getter
    def calico(self) -> pulumi.Output[Any]:
        """
        The Calico addon used to manage network policies.
        """
        return pulumi.get(self, "calico")

    @property
    @pulumi.getter(name="certManager")
    def cert_manager(self) -> pulumi.Output[Any]:
        """
        The CertManager addon.
        """
        return pulumi.get(self, "cert_manager")

    @property
    @pulumi.getter(name="clusterAutoscaler")
    def cluster_autoscaler(self) -> pulumi.Output[Any]:
        """
        The Kubernetes ClusterAutoscaler addon.
        """
        return pulumi.get(self, "cluster_autoscaler")

    @property
    @pulumi.getter
    def dashboard(self) -> pulumi.Output[Any]:
        """
        The Kubernetes dashboard addon.
        """
        return pulumi.get(self, "dashboard")

    @property
    @pulumi.getter(name="defaultIngressNginx")
    def default_ingress_nginx(self) -> pulumi.Output[Optional[Any]]:
        """
        The IngressNginx addon used for default access.
        """
        return pulumi.get(self, "default_ingress_nginx")

    @property
    @pulumi.getter(name="ebsCsiDriver")
    def ebs_csi_driver(self) -> pulumi.Output[Any]:
        """
        The EBS CSI driver that allows to create volumes using the block storage service of AWS.
        """
        return pulumi.get(self, "ebs_csi_driver")

    @property
    @pulumi.getter(name="externalDns")
    def external_dns(self) -> pulumi.Output[Any]:
        """
        The ExternalDns addon.
        """
        return pulumi.get(self, "external_dns")


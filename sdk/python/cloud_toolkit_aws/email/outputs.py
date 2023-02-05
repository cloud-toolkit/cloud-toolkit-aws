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
    'AdditionalQueue',
    'DnsDkimRecord',
]

@pulumi.output_type
class AdditionalQueue(dict):
    def __init__(__self__, *,
                 arn: str,
                 url: str):
        """
        :param str arn: Amazon Resource Name for the Queue component.
        :param str url: Endpoint of the Queue component in AWS.
        """
        pulumi.set(__self__, "arn", arn)
        pulumi.set(__self__, "url", url)

    @property
    @pulumi.getter
    def arn(self) -> str:
        """
        Amazon Resource Name for the Queue component.
        """
        return pulumi.get(self, "arn")

    @property
    @pulumi.getter
    def url(self) -> str:
        """
        Endpoint of the Queue component in AWS.
        """
        return pulumi.get(self, "url")


@pulumi.output_type
class DnsDkimRecord(dict):
    def __init__(__self__, *,
                 name: str,
                 token: str):
        """
        :param str name: Name of the Record.
        :param str token: Token of the Record.
        """
        pulumi.set(__self__, "name", name)
        pulumi.set(__self__, "token", token)

    @property
    @pulumi.getter
    def name(self) -> str:
        """
        Name of the Record.
        """
        return pulumi.get(self, "name")

    @property
    @pulumi.getter
    def token(self) -> str:
        """
        Token of the Record.
        """
        return pulumi.get(self, "token")



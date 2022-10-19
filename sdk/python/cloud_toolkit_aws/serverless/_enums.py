# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

from enum import Enum

__all__ = [
    'DeadLetterQueueTypes',
]


class DeadLetterQueueTypes(str, Enum):
    """
    Dead Letter Queue type that will receive the faulty messages from the base Queue.
    Permissive - Messages will be sent to the Dead Letter Queue after 10 failed delivery attempts.
    Restrictive - Messages will be sent to the Dead Letter Queue after the first failed delivery attempt.
    """
    PERMISSIVE = "permissive"
    RESTRICTIVE = "restrictive"
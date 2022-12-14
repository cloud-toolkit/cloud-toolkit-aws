# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

from enum import Enum

__all__ = [
    'NotificationTypes',
]


class NotificationTypes(str, Enum):
    """
    Types of Email Notifications that are covered by Email Sender.
    * Bounce usually occurs when the recipient address does not exist, their inbox is full, the content of the message if flagged or other casuistics.
    * Complaint indicates that the recipient does not want the email that was sent to them. It is usually a proactive action and it is best to remove the recipient address from the mailing list whenever it is.
    * Delivery marks an email as correctly delivered.
    """
    BOUNCE = "Bounce"
    COMPLAINT = "Complaint"
    DELIVERY = "Delivery"

export declare const NotificationTypes: {
    readonly Bounce: "Bounce";
    readonly Complaint: "Complaint";
    readonly Delivery: "Delivery";
};
/**
 * Types of Email Notifications that are covered by Email Sender.
 * * Bounce usually occurs when the recipient address does not exist, their inbox is full, the content of the message if flagged or other casuistics.
 * * Complaint indicates that the recipient does not want the email that was sent to them. It is usually a proactive action and it is best to remove the recipient address from the mailing list whenever it is.
 * * Delivery marks an email as correctly delivered.
 */
export declare type NotificationTypes = (typeof NotificationTypes)[keyof typeof NotificationTypes];

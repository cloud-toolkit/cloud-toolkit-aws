export declare const DeadLetterQueueTypes: {
    readonly PERMISSIVE: "PERMISSIVE";
    readonly RESTRICTIVE: "RESTRICTIVE";
};
/**
 * Dead Letter Queue type that will receive the faulty messages from the base Queue.
 * Permissive - Messages will be sent to the Dead Letter Queue after 10 failed delivery attempts.
 * Restrictive - Messages will be sent to the Dead Letter Queue after the first failed delivery attempt.
 */
export declare type DeadLetterQueueTypes = (typeof DeadLetterQueueTypes)[keyof typeof DeadLetterQueueTypes];

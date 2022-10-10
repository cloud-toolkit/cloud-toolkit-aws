"use strict";
// *** WARNING: this file was generated by Pulumi SDK Generator. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const pulumi = require("@pulumi/pulumi");
const utilities = require("../utilities");
/**
 * Cloud Toolkit component for Queues. Creates a Simple Queue Service Queue alongside a Dead Letter Queue for faulty message deliveries.
 */
class Queue extends pulumi.ComponentResource {
    /**
     * Create a Queue resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name, args, opts) {
        let resourceInputs = {};
        opts = opts || {};
        if (!opts.id) {
            resourceInputs["DeadLetterQueueTypeArgs"] = args ? args.DeadLetterQueueTypeArgs : undefined;
            resourceInputs["isFifo"] = args ? args.isFifo : undefined;
            resourceInputs["maxMessageSize"] = args ? args.maxMessageSize : undefined;
            resourceInputs["messageRetentionSeconds"] = args ? args.messageRetentionSeconds : undefined;
            resourceInputs["policy"] = args ? args.policy : undefined;
            resourceInputs["deadLetterQueue"] = undefined /*out*/;
            resourceInputs["sqsQueue"] = undefined /*out*/;
        }
        else {
            resourceInputs["deadLetterQueue"] = undefined /*out*/;
            resourceInputs["sqsQueue"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        super(Queue.__pulumiType, name, resourceInputs, opts, true /*remote*/);
    }
    /**
     * Returns true if the given object is an instance of Queue.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj) {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Queue.__pulumiType;
    }
}
exports.Queue = Queue;
/** @internal */
Queue.__pulumiType = 'cloud-toolkit-aws:serverless:Queue';
//# sourceMappingURL=queue.js.map
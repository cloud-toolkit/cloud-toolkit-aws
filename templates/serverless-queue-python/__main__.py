import pulumi
import cloud_toolkit_aws

config = pulumi.Config();

cloud_toolkit_aws.serverless.Queue("queue_name", 
is_fifo = config.get_bool("isFifo"), 
dead_letter_queue_type_args = "permissive")

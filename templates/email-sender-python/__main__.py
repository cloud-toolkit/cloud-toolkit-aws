import pulumi
import cloud_toolkit_aws

config = pulumi.Config();

cloud_toolkit_aws.email.EmailSender("email_sender_name_name", 
identity = config.get("identity"), 
configure_dns = config.get_bool("configure_dns"))

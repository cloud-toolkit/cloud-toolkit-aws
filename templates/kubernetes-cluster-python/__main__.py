import pulumi
import cloud_toolkit_aws

config = pulumi.Config();

cloud_toolkit_aws.kubernetes.Cluster(config.get("cluster_name"))

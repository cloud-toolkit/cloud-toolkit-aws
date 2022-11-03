*** Settings ***
Documentation    Kubernetes
Suite Setup      I deploy the Kubernetes Cluster with Pulumi
Suite Teardown   I destroy the Kubernetes Cluster with Pulumi

Resource         ../../resources/keywords_library/kubernetes.robot
 
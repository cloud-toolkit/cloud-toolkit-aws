*** Settings ***
Documentation     Kubernetes keywords

Resource    pulumi.robot

*** Keywords ***
I deploy the Kubernetes Cluster with Pulumi
    Given I apply the infrastructure present on the Pulumi project path "${ROOT_PROJECTS_PATH}/kubernetes"

I destroy the Kubernetes Cluster with Pulumi
    Given I destroy the infrastructure present on the Pulumi project path "${ROOT_PROJECTS_PATH}/kubernetes"

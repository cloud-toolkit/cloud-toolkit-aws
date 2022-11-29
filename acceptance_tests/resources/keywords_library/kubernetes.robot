*** Settings ***
Documentation     Kubernetes keywords

Resource    pulumi.robot
Library           robot.libraries.DateTime

*** Variables ***


*** Keywords ***
I deploy the Kubernetes Cluster with Pulumi
    ${date}=  Get Current Date  UTC  exclude_millis=yes  result_format=%Y%m%d%H%M%S
    Given I install the NodeJS dependencies on project with path "${ROOT_PROJECTS_PATH}/kubernetes"
      And I create a Pulumi stack with name "component-tests-${date}" on the Pulumi project with path "${ROOT_PROJECTS_PATH}/kubernetes"
     Then I apply the infrastructure present on the Pulumi project path "${ROOT_PROJECTS_PATH}/kubernetes"

I destroy the Kubernetes Cluster with Pulumi
    Given I destroy the infrastructure present on the Pulumi project path "${ROOT_PROJECTS_PATH}/kubernetes"
     Then I delete the current Pulumi stack on the Pulumi project with path "${ROOT_PROJECTS_PATH}/kubernetes"

*** Settings ***
Documentation     Kubernetes keywords

Resource    pulumi.robot
Library     robot.libraries.DateTime

*** Variables ***
${EXISTING_STACK}  %{PULUMI_STACK=""}

*** Keywords ***
I deploy the Kubernetes Cluster with Pulumi
    Given I install the NodeJS dependencies on project with path "${ROOT_PROJECTS_PATH}/kubernetes"
    IF  "${EXISTING_STACK}" == ""
      ${date}=  Get Current Date  UTC  exclude_millis=yes  result_format=%Y%m%d%H%M%S
      And I create a Pulumi stack with name "component-tests-${date}" on the Pulumi project with path "${ROOT_PROJECTS_PATH}/kubernetes"
      Then I apply the infrastructure present on the Pulumi project path "${ROOT_PROJECTS_PATH}/kubernetes"
    ELSE
      Then I select an existing Pulumi stack with name "${EXISTING_STACK}" on the Pulumi project with path "${ROOT_PROJECTS_PATH}/kubernetes"
      Log To Console  hey this is an else
    END
I destroy the Kubernetes Cluster with Pulumi
    Skip If  "${EXISTING_STACK}" != ""
    Given I destroy the infrastructure present on the Pulumi project path "${ROOT_PROJECTS_PATH}/kubernetes"
     Then I delete the current Pulumi stack on the Pulumi project with path "${ROOT_PROJECTS_PATH}/kubernetes"

I apply the YAML file with path "${file_path}"
    ${result} =  Run Process  kubectl  apply  -f  yaml/${file_path}  stderr=STDOUT  cwd=${ROOT_PROJECTS_PATH}/kubernetes

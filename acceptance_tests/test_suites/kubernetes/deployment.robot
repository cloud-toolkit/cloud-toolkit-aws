*** Settings ***
Library         Process
Resource        ../../resources/keywords_library/kubernetes.robot

Test Setup      Test Setup

Force Tags      docker-ci


*** Variables ***
${namespace}                default
${label_selector}           app\=deployment
${label_selector_json}      {"app": "deployment"}


*** Test Cases ***
Deployment exists
    Given I apply the YAML file with path "${BASIC_RESOURCES_PATH}/deployment.yaml"
    And waited for pods matching "nginx-deployment" in namespace "${namespace}" to be READY
    When getting pods matching "nginx-deployment" in namespace "${namespace}"
    Then pods have labels "${label_selector_json}"


*** Keywords ***
Test Setup
    deployments with labels "${label_selector}" in namespace "${namespace}" are deleted
    waited for namespace "${namespace}" to not have any pod

*** Settings ***
Documentation       Kubernetes

Resource            ../../resources/keywords_library/kubernetes.robot

Suite Setup         Suit Setup
Suite Teardown      Suit Teardown


*** Keywords ***
Suit Setup
    Given I install the NodeJS dependencies on project with path "${KUBERNETES_PROJECT_PATH}"
     Then I prepare the Pulumi stack on project with path "${KUBERNETES_PROJECT_PATH}"
      And I deploy the Kubernetes Cluster with Pulumi on project with path "${KUBERNETES_PROJECT_PATH}"
      And I retrieve the Pulumi output with name "kubeconfig" and save it on a file with name "kubeconfig" on project with path "${KUBERNETES_PROJECT_PATH}"

Suit Teardown
    Given I destroy the Kubernetes Cluster with Pulumi on project with path "${KUBERNETES_PROJECT_PATH}"
     Then I cleanup the Pulumi stack on project with path "${KUBERNETES_PROJECT_PATH}"
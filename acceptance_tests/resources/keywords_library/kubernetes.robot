*** Settings ***
Documentation       Kubernetes keywords

Library             String
Library             KubeLibrary    ${KUBECONFIG_PATH}
Resource            pulumi.robot


*** Variables ***
${ROOT_PROJECTS_PATH}           ${CURDIR}/../../resources/projects
${KUBERNETES_PROJECT_PATH}      ${ROOT_PROJECTS_PATH}/kubernetes
${BASIC_RESOURCES_PATH}         ${KUBERNETES_PROJECT_PATH}/yamls/basics
${KUBECONFIG_PATH}              %{KUBECONFIG=${KUBERNETES_PROJECT_PATH}/kubeconfig}
${KLIB_POD_TIMEOUT}             %{KLIB_POD_TIMEOUT=1min}
${KLIB_POD_RETRY_INTERVAL}      %{KLIB_POD_RETRY_INTERVAL=5sec}


*** Keywords ***
I deploy the Kubernetes Cluster with Pulumi on project with path "${project_path}"
    IF    ${EXISTING_PULUMI_STACK} == ""
        I apply the infrastructure present on the Pulumi project path "${project_path}"
    END

I destroy the Kubernetes Cluster with Pulumi on project with path "${project_path}"
    IF    ${EXISTING_PULUMI_STACK} == ""
        I destroy the infrastructure present on the Pulumi project path "${KUBERNETES_PROJECT_PATH}"
    END

I apply the YAML file with path "${file_path}"
    ${result}=    Run Process
    ...    kubectl
    ...    --kubeconfig
    ...    ${KUBECONFIG_PATH}
    ...    apply
    ...    -f
    ...    ${file_path}
    Log Many    stdout: ${result.stdout}    stderr: ${result.stderr}
    Should Be Empty    ${result.stderr}

waited for pods matching "${name_pattern}" in namespace "${namespace}" to be READY
    Wait Until Keyword Succeeds
    ...    ${KLIB_POD_TIMEOUT}
    ...    ${KLIB_POD_RETRY_INTERVAL}
    ...    pod "${name_pattern}" status in namespace "${namespace}" is READY

pod "${name_pattern}" status in namespace "${namespace}" is READY
    @{namespace_pods}=    list_namespaced_pod_by_pattern    ${name_pattern}    ${namespace}
    @{namespace_pods_names}=    Filter Names    ${namespace_pods}
    ${num_of_pods}=    Get Length    ${namespace_pods_names}
    Should Be True    ${num_of_pods} >= 1    No pods matching "${name_pattern}" found
    FOR    ${pod}    IN    @{namespace_pods_names}
        ${status}=    read_namespaced_pod_status    ${pod}    ${namespace}
        ${conditions}=    Filter by Key    ${status.conditions}    type    Ready
        Should Be True    '${conditions[0].status}'=='True'
    END

waited for namespace "${namespace}" to not have any pod
    Wait Until Keyword Succeeds
    ...    ${KLIB_POD_TIMEOUT}
    ...    ${KLIB_POD_RETRY_INTERVAL}
    ...    namespace "${namespace}" does not have any pod

namespace "${namespace}" does not have any pod
    @{namespace_pods}=    list_namespaced_pod_by_pattern    .*    ${namespace}
    ${num_of_pods}=    Get Length    ${namespace_pods}
    Should Be True    ${num_of_pods} == 0    Namespace ${namespace} has ${num_of_pods} pods

getting pods matching "${name_pattern}" in namespace "${namespace}"
    @{namespace_pods}=    list_namespaced_pod_by_pattern    ${name_pattern}    ${namespace}
    Set Test Variable    ${namespace_pods}

getting deployments matching labels "${labels}" in namespace "${namespace}"
    @{namespace_deployments}=    List Namespaced Deployment By Pattern    .*    ${namespace}    ${labels}
    Set Test Variable    ${namespace_deployments}

pods have labels "${pod_labels}"
    FOR    ${pod}    IN    @{namespace_pods}
        ${assertion}=    assert_pod_has_labels    ${pod}    ${pod_labels}
        Should Be True    ${assertion}
    END

deployments with labels "${pod_labels}" in namespace "${namespace}" are deleted
    Wait Until Keyword Succeeds
    ...    ${KLIB_POD_TIMEOUT}
    ...    ${KLIB_POD_RETRY_INTERVAL}
    ...    delete    api_version=v1    kind=Deployment    label_selector=${pod_labels}    namespace=default

pods with labels "${pod_labels}" are deleted
    Wait Until Keyword Succeeds
    ...    ${KLIB_POD_TIMEOUT}
    ...    ${KLIB_POD_RETRY_INTERVAL}
    ...    delete    api_version=v1    kind=Pod    label_selector=${pod_labels}    namespace=default

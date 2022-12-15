*** Settings ***
Documentation       Pulumi wrapper in Robot framework.
...
...                 Generic implementation ready to be used with Behavior Driven Development (BDD).

Library             Process
Library             robot.libraries.DateTime
Library             OperatingSystem


*** Variables ***
${EXISTING_PULUMI_STACK}    "%{EXISTING_PULUMI_STACK=}"

*** Keywords ***
I install the NodeJS dependencies on project with path "${project_path}"
    ${result} =    Run Process    npm    install    cwd=${project_path}
    Log Many    stdout: ${result.stdout}    stderr: ${result.stderr}
    Should Be Empty    ${result.stderr}

I create a Pulumi stack with name "${stack_name}" on the Pulumi project with path "${project_path}"
    ${result} =    Run Process
    ...    pulumi
    ...    stack
    ...    init
    ...    ${stack_name}
    ...    timeout=10s
    ...    cwd=${project_path}
    Log Many    stdout: ${result.stdout}    stderr: ${result.stderr}
    Should Be Empty    ${result.stderr}

I select an existing Pulumi stack with name "${stack_name}" on the Pulumi project with path "${project_path}"
    ${result} =    Run Process
    ...    pulumi
    ...    stack
    ...    select
    ...    ${stack_name}
    ...    timeout=10s
    ...    cwd=${project_path}
    Log Many    stdout: ${result.stdout}    stderr: ${result.stderr}
    Should Be Empty    ${result.stderr}

I delete the current Pulumi stack on the Pulumi project with path "${project_path}"
    ${result} =    Run Process    pulumi    stack    rm    -y    timeout=30s    cwd=${project_path}
    Log Many    stdout: ${result.stdout}    stderr: ${result.stderr}
    Should Be Empty    ${result.stderr}

I apply the infrastructure present on the Pulumi project path "${project_path}"
    ${result} =    Run Process    pulumi    up    -y    cwd=${project_path}
    Log Many    stdout: ${result.stdout}    stderr: ${result.stderr}
    Should Be Empty    ${result.stderr}

I destroy the infrastructure present on the Pulumi project path "${project_path}"
    ${result} =    Run Process    pulumi    destroy    -y    cwd=${project_path}
    Log Many    stdout: ${result.stdout}    stderr: ${result.stderr}
    Should Be Empty    ${result.stderr}

I prepare the Pulumi stack on project with path "${project_path}"
    IF    ${EXISTING_PULUMI_STACK} == ""
        ${date} =    Get Current Date    UTC    exclude_millis=yes    result_format=%Y%m%d%H%M%S
        And I create a Pulumi stack with name "component-tests-${date}" on the Pulumi project with path "${project_path}"
    ELSE
        Then I select an existing Pulumi stack with name "%{EXISTING_PULUMI_STACK=""}" on the Pulumi project with path "${project_path}"
    END

I cleanup the Pulumi stack on project with path "${project_path}"
    IF    ${EXISTING_PULUMI_STACK} == ""
        Then I delete the current Pulumi stack on the Pulumi project with path "${project_path}"
    END

I retrieve the Pulumi output with name "${output_name}" and save it on a file with name "${file_name}" on project with path "${project_path}"
    ${result} =    Run Process    pulumi    stack    output    ${output_name}    cwd=${project_path}
    Log Many    stdout: ${result.stdout}    stderr: ${result.stderr}
    Should Be Empty    ${result.stderr}
    Create File    ${project_path}/${file_name}    ${result.stdout}
    File Should Not Be Empty    ${project_path}/${file_name}

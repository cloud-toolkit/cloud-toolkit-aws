*** Settings ***
Documentation     Pulumi wrapper in Robot framework.
...
...               Generic implementation ready to be used with Behavior Driven Development (BDD).
Library    Process

*** Variables ***
${ROOT_PROJECTS_PATH}  ./resources/projects/


*** Keywords ***
I apply the infrastructure present on the Pulumi project path "${project_path}"
   ${result} =  Run Process  ls  ${project_path}
  Log To Console  ${result.stdout}


I destroy the infrastructure present on the Pulumi project path "${project_path}"
    ${result} =  Run Process  ls  ${project_path}
    Log To Console  ${result.stdout}
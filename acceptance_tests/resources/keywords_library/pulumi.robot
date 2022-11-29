*** Settings ***
Documentation     Pulumi wrapper in Robot framework.
...
...               Generic implementation ready to be used with Behavior Driven Development (BDD).
Library    Process

*** Variables ***
${ROOT_PROJECTS_PATH}  ./resources/projects


*** Keywords ***
I install the NodeJS dependencies on project with path "${project_path}"
  ${result} =  Run Process  npm  install  stderr=STDOUT  cwd=${project_path}
  Log To Console  ${result.stdout}

I create a Pulumi stack with name "${stack_name}" on the Pulumi project with path "${project_path}"
  ${result} =  Run Process  pulumi  stack  init  ${stack_name}  stderr=STDOUT  timeout=10s  cwd=${project_path}
  Log To Console  ${result.stdout}

I delete the current Pulumi stack on the Pulumi project with path "${project_path}"
  ${result} =  Run Process  pulumi  stack  rm  -y  stderr=STDOUT  timeout=30s  cwd=${project_path}
  Log To Console  ${result.stdout}

I apply the infrastructure present on the Pulumi project path "${project_path}"
  ${result} =  Run Process  pulumi  up  -y  stderr=STDOUT  cwd=${project_path}
  Log To Console  ${result.stdout}

I destroy the infrastructure present on the Pulumi project path "${project_path}"
  ${result} =  Run Process  pulumi  destroy  -y  stderr=STDOUT  cwd=${project_path}
  Log To Console  ${result.stdout}

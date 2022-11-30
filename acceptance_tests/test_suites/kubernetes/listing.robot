*** Settings ***
Force Tags  docker-ci
Library    Process

Resource         ../../resources/keywords_library/kubernetes.robot

*** Test Cases ***
Deployment exists
    Given I apply the YAML file with path "basics/deployment"  
    ${result} =  Run Process  echo  "It obviously exists"
    Log To Console  ${result.stdout}

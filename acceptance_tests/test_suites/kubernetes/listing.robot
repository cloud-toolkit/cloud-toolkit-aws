*** Settings ***
Force Tags  docker-ci
Library    Process

*** Test Cases ***
Deployment exists
  ${result} =  Run Process  echo  "It obviously exists"
  Log To Console  ${result.stdout}

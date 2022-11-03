#!/bin/bash

# INFRASTRUCTURE_DIR="$(pwd)/../resources"
INFRASTRUCTURE_DIR="$(pwd)/../../../../examples/example-typescript/"

CURRENT_DIR=$(pwd)
STACK_NAME="integration-tests"

cd "${INFRASTRUCTURE_DIR}" || exit 1
pulumi stack select ${STACK_NAME}
pulumi stack output kubeconfig > "${CURRENT_DIR}/kubeconfig"
cd "${CURRENT_DIR}" || exit 1

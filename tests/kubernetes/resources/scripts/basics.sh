#!/bin/bash
TIMEOUT_TIME=30s

shopt -s expand_aliases
alias k='kubectl --kubeconfig kubeconfig'

k apply -f yamls/basics/deployment.yaml
k wait pods -n default -l app=deployment --for condition=Ready --timeout=${TIMEOUT_TIME}
k wait deployment -n default -l app=deployment --for=condition=available --for=jsonpath=.status.availableReplicas=3 --timeout=${TIMEOUT_TIME}
k get pods -n default
k get deployment -n default
k delete deployment -l app=deployment

#!/bin/bash
timestamp=$(date +%Y%m%d-%H%M%S)
output_folder="./logs/acceptance_tests/${timestamp}"

mkdir -p "${output_folder}" &&
robot --exclude skip --outputdir "${output_folder}" test_suites/

# Component tests

## Introduction

Cloud Toolkit leverages the tools that the Pulumi team offers to test that the components are being correctly created. Nonetheless, testing only that the pieces exist is not enough to validate that a component did not break with recently introduced changes.

The workflow of a component test consists of deploying a component or set of them, verifying that they function as expected and finally cleaning everything.

**Robot Framework** is an open source test automation framework for acceptance testing and acceptance test-driven development. Written in **Python**, it allows great flexibility in the development of test cases definition and the tools needed for test automatization.

## Set Up

For local development is recommended that you install Robot Framework at the system level so that IDE plugins can work best.

```bash
$> python3 -m pip install robotframework
```

In the installation didn't set your robot binary on your `PATH`, you can create an alias for ease of use:

```bash
$> alias robot="python -m robot"
```

Remember to add it to your `.bashrc`, `.zshrc` or equivalent so that it is available at the start of the terminal session.

### IDE extensions:

Robot Framework has support in the main IDEs used for Python development:

* [Code extension](https://open-vsx.org/extension/robocorp/robotframework-lsp)
You will most likely need to set the path to the Python executable that has robot installed in the settings of the extension.

## Running locally 

Running all tests:

```bash
$> robot test_suites/
```

Running a specific test suite:

```bash
$> robot test_suites/kubernetes
```

Running a test case from a test suite:

```bash
$> robot -t "Deployment exists" test_suites/kubernetes
```

## Running with Docker

Set the following env vars that are going to get passed to the container:

```bash
$> export AWS_PROFILE=<AWS_PROFILE>
$> export AWS_PROFILE_CONFIG=<AWS_PROFILE_CONFIG>
$> export AWS_PROFILE_CREDENTIALS=<AWS_PROFILE_CREDENTIALS>
$> export PULUMI_ACCESS_TOKEN=<PULUMI_ACCESS_TOKEN>
```

You can use the provided dockerfile to build and run the container:

```bash
$> docker compose up --build 
```

The `--build` flag will rebuild the image everytime. Feel free to exclude if you don't need it.

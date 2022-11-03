# Component tests

## Introduction
Cloud Toolkit leverages the tools that the Pulumi team offers to test that the components are being correctly created. Nonetheless, testing only that the pieces exist is not enough to validate that a component did not break with recently introduced changes.

The workflow of a component test consists of deploying a component or set of them, verifying that they function as expected and finally cleaning everything.

**Robot Framework** is an open source test automation framework for acceptance testing and acceptance test-driven development. Written in **Python**, it allows great flexibility in the development of test cases definition and the tools needed for test automatization.

## Set Up
For local development is recommended that you install Robot Framework at the system level so that IDE plugins can work best.

```bash
python3 -m pip install robotframework
```

Robot Framework has support in the main IDEs used for Python development:

* [Code extension](https://open-vsx.org/extension/robocorp/robotframework-lsp)

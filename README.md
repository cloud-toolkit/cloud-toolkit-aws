# Cloud Toolkit AWS

The Cloud Toolkit AWS provider for Pulumi lets you deploy well-architected solutions in AWS. With Cloud Toolkit AWS you can use your preferred programming language to manage your platform with Infrastructure as Code.

## Supported languages

- NodeJS
- Python

## Architecture

This repository is composed by the following components:

| Component | Description | Path |
|---|---|---|
| Provider | This is the Pulumi provider written in TypeScript. | `provider/cmd/pulumi-resource-cloud-toolkit-aws/` |
| Schema | The Pulumi schema that describes the resources and types managed by the Provider. It is used to generate the SDKs. | `schema.yaml` |
| SDKs | A set of SDK to use the Provider from many users. | `sdk/` |

## Development

### Requirements

- Pulumi CLI
- Pulumictl
- Node.js 8+
- NPM 16+
- Go 1.17
- Python 3.6+
- setuptools 1.63+

### Provider

After applying changes to the Provider code, you can build and install it using the following command:

```bash
make install_provider
```

The provider will be installed inside the `bin` directory at the root level of this repository. To use the provider just add the `bin` directory to your PATH:

```bash
export PATH=$PATH:$(pwd)/bin
```

### Schema and SDKs

If you added or modified any Component, you need to update the `schema.yaml` file.

For example you cloud add a `StaticPage` component adding the following content to the `resources` property:

```diff
+  cloud-toolkit-aws:index:StaticPage:
+    description: StaticPage component to deploy a web page using S3 bucket.
+    properties:
+      bucket:
+        description: The S3 bucket used to store the web page.
+        $ref: /aws/v5.10.0/schema.json#/resources/aws:s3%2fbucketV2:BucketV2
```

After updating the Schema content, it is required to regenerate the SDKs with the following command.

```bash
make build_sdk
```

Once the SDKs are generated, you can use them as described below.

__NodeJS__

Install the compiled SDK placed under the `sdk/nodejs/bin` directory:

```bash
npm install <path-to-this-repo>/sdk/nodejs/bin
```

__Python__

Install the compiled SDK placed under the `sdk/python/bin` directory:

```bash
pip install -e <path-to-this-repo>/sdk/python/bin
```

### Integration tests

To execute the tests you need to specify the route of the provider in your `PATH` variable:

```bash
export PATH=$PATH:$(pwd)/bin
```

Run integration tests with the following command:

```bash
make integration_tests
```

You can also execute the tests manually as usual with `go test`. 
You will still need to have the provider in the PATH.

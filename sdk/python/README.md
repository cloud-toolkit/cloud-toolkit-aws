# Cloud Toolkit AWS

The Cloud Toolkit AWS provider for Pulumi provision well-architected solutions in [AWS](https://aws.amazon.com/). With Cloud Toolkit AWS you can use your preferred programming language to manage your platform with Infrastructure as Code.

## Install

### JavaScript / TypeScript

To use from JavaScript or TypeScript, install using either `npm`:

```bash
npm install @cloudtoolkit/aws
```

or `yarn`:

```bash
yarn add @cloudtoolkit/aws
```

### Python

To use from Python, install using `pip`:

```bash
pip install cloud-toolkit-aws
```

## Configuration

To provision resources with the Cloud Toolkit AWS provider, you need to have AWS credentials. You can use the instructions on if you plan to use AWS credentials from a shared credentials file (which the AWS CLI usually manages for you) or from an environment variable. For more details, see the [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).


## Examples

### JavaScript / TypeScript

Create a private Bucket:

```typescript
const ct = require("@cloudtoolkit/aws");

const bucket = new ct.storage.Bucket("mybucket");
```

### Python

Create a private Bucket:

```python
import cloud_toolkit_aws as ct

bucket = ct.storage.Bucket("bucket")
```

## Development

Visit the [development page](docs/development/README.md).

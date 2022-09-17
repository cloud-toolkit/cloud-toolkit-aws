import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface ExampleArgs {
  name: string;
}

export class Example extends pulumi.ComponentResource {
  public readonly bucket: aws.s3.BucketV2;

  constructor(
    name: string,
    args: ExampleArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("cloud-toolkit-aws:index:Example", name, args, opts);

    const resourceOpts = pulumi.mergeOptions(opts, { parent: this });
    this.bucket = new aws.s3.BucketV2(name, {}, resourceOpts);

    this.registerOutputs({
      bucket: this.bucket,
    });
  }
}

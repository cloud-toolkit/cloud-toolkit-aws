package main

import (
	ct "github.com/cloud-toolkit/cloud-toolkit-aws/sdk/go/aws"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		example, err := ct.NewExample(ctx, "test", &ct.ExampleArgs{Name: pulumi.StringPtr("test")})
		if err != nil {
			return err
		}

		ctx.Export("bucket", example.Bucket)
		ctx.Export("bucketName", example.Bucket.Bucket())
		return nil
	})
}

// Code generated by Pulumi SDK Generator DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package landingzone

import (
	"context"
	"reflect"

	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/cloudtrail"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/cloudwatch"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/s3"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

type AuditLogging struct {
	pulumi.ResourceState

	// The S3 Bucket used to store the data.
	Bucket s3.BucketV2Output `pulumi:"bucket"`
	// The S3 Bucket ACL.
	BucketAcl s3.BucketAclV2Output `pulumi:"bucketAcl"`
	// The S3 Bucket Lifecycle Configuration to configure data retention on S3 Bucket.
	BucketLifecycleConfiguration s3.BucketLifecycleConfigurationV2Output `pulumi:"bucketLifecycleConfiguration"`
	// The S3 Bucket policy.
	BucketPolicy s3.BucketPolicyOutput `pulumi:"bucketPolicy"`
	// The S3 Bucket Public Access Block to make data private.
	BucketPublicAccessBlock s3.BucketPublicAccessBlockOutput `pulumi:"bucketPublicAccessBlock"`
	// The CloudWatch dashboard to review the audit logs.
	CloudWatchDashboard cloudwatch.DashboardOutput `pulumi:"cloudWatchDashboard"`
	// The CloudWatch Log Group used to store the data.
	CloudWatchLogGroup cloudwatch.LogGroupOutput `pulumi:"cloudWatchLogGroup"`
	// The IAM Policy used by the IAM Role for Cloud Trail.
	CloudWatchPolicy iam.PolicyOutput `pulumi:"cloudWatchPolicy"`
	// The IAM Role used by Cloud Trail to write to CloudWatch..
	CloudWatchRole iam.RoleOutput `pulumi:"cloudWatchRole"`
	// The IAM Role Policy Attachments that attach the IAM Role with the IAM Policy.
	CloudWatchRolePolicyAttachment iam.RolePolicyAttachmentOutput `pulumi:"cloudWatchRolePolicyAttachment"`
	// The AWS Organization id.
	OrganizationId pulumi.StringOutput `pulumi:"organizationId"`
	// The AWS Organization master account id.
	OrganizationMasterAccountId pulumi.StringOutput `pulumi:"organizationMasterAccountId"`
	// The Cloud Trail.
	Trail cloudtrail.TrailOutput `pulumi:"trail"`
}

// NewAuditLogging registers a new resource with the given unique name, arguments, and options.
func NewAuditLogging(ctx *pulumi.Context,
	name string, args *AuditLoggingArgs, opts ...pulumi.ResourceOption) (*AuditLogging, error) {
	if args == nil {
		args = &AuditLoggingArgs{}
	}

	opts = pkgResourceDefaultOpts(opts)
	var resource AuditLogging
	err := ctx.RegisterRemoteComponentResource("cloud-toolkit-aws:landingzone:AuditLogging", name, args, &resource, opts...)
	if err != nil {
		return nil, err
	}
	return &resource, nil
}

type auditLoggingArgs struct {
	// The AWS provider to used to create the Bucket.
	BucketProvider *aws.Provider `pulumi:"bucketProvider"`
	// Store the audit logs in CloudWatch to enable easy searching.
	Cloudwatch *AuditLoggingCloudWatch `pulumi:"cloudwatch"`
	// The region to be used to store the data.
	Region *string `pulumi:"region"`
	// The data retention in days. Defaults to '7'.
	RetentionDays *float64 `pulumi:"retentionDays"`
}

// The set of arguments for constructing a AuditLogging resource.
type AuditLoggingArgs struct {
	// The AWS provider to used to create the Bucket.
	BucketProvider aws.ProviderInput
	// Store the audit logs in CloudWatch to enable easy searching.
	Cloudwatch AuditLoggingCloudWatchPtrInput
	// The region to be used to store the data.
	Region pulumi.StringPtrInput
	// The data retention in days. Defaults to '7'.
	RetentionDays pulumi.Float64PtrInput
}

func (AuditLoggingArgs) ElementType() reflect.Type {
	return reflect.TypeOf((*auditLoggingArgs)(nil)).Elem()
}

type AuditLoggingInput interface {
	pulumi.Input

	ToAuditLoggingOutput() AuditLoggingOutput
	ToAuditLoggingOutputWithContext(ctx context.Context) AuditLoggingOutput
}

func (*AuditLogging) ElementType() reflect.Type {
	return reflect.TypeOf((**AuditLogging)(nil)).Elem()
}

func (i *AuditLogging) ToAuditLoggingOutput() AuditLoggingOutput {
	return i.ToAuditLoggingOutputWithContext(context.Background())
}

func (i *AuditLogging) ToAuditLoggingOutputWithContext(ctx context.Context) AuditLoggingOutput {
	return pulumi.ToOutputWithContext(ctx, i).(AuditLoggingOutput)
}

// AuditLoggingArrayInput is an input type that accepts AuditLoggingArray and AuditLoggingArrayOutput values.
// You can construct a concrete instance of `AuditLoggingArrayInput` via:
//
//	AuditLoggingArray{ AuditLoggingArgs{...} }
type AuditLoggingArrayInput interface {
	pulumi.Input

	ToAuditLoggingArrayOutput() AuditLoggingArrayOutput
	ToAuditLoggingArrayOutputWithContext(context.Context) AuditLoggingArrayOutput
}

type AuditLoggingArray []AuditLoggingInput

func (AuditLoggingArray) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*AuditLogging)(nil)).Elem()
}

func (i AuditLoggingArray) ToAuditLoggingArrayOutput() AuditLoggingArrayOutput {
	return i.ToAuditLoggingArrayOutputWithContext(context.Background())
}

func (i AuditLoggingArray) ToAuditLoggingArrayOutputWithContext(ctx context.Context) AuditLoggingArrayOutput {
	return pulumi.ToOutputWithContext(ctx, i).(AuditLoggingArrayOutput)
}

// AuditLoggingMapInput is an input type that accepts AuditLoggingMap and AuditLoggingMapOutput values.
// You can construct a concrete instance of `AuditLoggingMapInput` via:
//
//	AuditLoggingMap{ "key": AuditLoggingArgs{...} }
type AuditLoggingMapInput interface {
	pulumi.Input

	ToAuditLoggingMapOutput() AuditLoggingMapOutput
	ToAuditLoggingMapOutputWithContext(context.Context) AuditLoggingMapOutput
}

type AuditLoggingMap map[string]AuditLoggingInput

func (AuditLoggingMap) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*AuditLogging)(nil)).Elem()
}

func (i AuditLoggingMap) ToAuditLoggingMapOutput() AuditLoggingMapOutput {
	return i.ToAuditLoggingMapOutputWithContext(context.Background())
}

func (i AuditLoggingMap) ToAuditLoggingMapOutputWithContext(ctx context.Context) AuditLoggingMapOutput {
	return pulumi.ToOutputWithContext(ctx, i).(AuditLoggingMapOutput)
}

type AuditLoggingOutput struct{ *pulumi.OutputState }

func (AuditLoggingOutput) ElementType() reflect.Type {
	return reflect.TypeOf((**AuditLogging)(nil)).Elem()
}

func (o AuditLoggingOutput) ToAuditLoggingOutput() AuditLoggingOutput {
	return o
}

func (o AuditLoggingOutput) ToAuditLoggingOutputWithContext(ctx context.Context) AuditLoggingOutput {
	return o
}

// The S3 Bucket used to store the data.
func (o AuditLoggingOutput) Bucket() s3.BucketV2Output {
	return o.ApplyT(func(v *AuditLogging) s3.BucketV2Output { return v.Bucket }).(s3.BucketV2Output)
}

// The S3 Bucket ACL.
func (o AuditLoggingOutput) BucketAcl() s3.BucketAclV2Output {
	return o.ApplyT(func(v *AuditLogging) s3.BucketAclV2Output { return v.BucketAcl }).(s3.BucketAclV2Output)
}

// The S3 Bucket Lifecycle Configuration to configure data retention on S3 Bucket.
func (o AuditLoggingOutput) BucketLifecycleConfiguration() s3.BucketLifecycleConfigurationV2Output {
	return o.ApplyT(func(v *AuditLogging) s3.BucketLifecycleConfigurationV2Output { return v.BucketLifecycleConfiguration }).(s3.BucketLifecycleConfigurationV2Output)
}

// The S3 Bucket policy.
func (o AuditLoggingOutput) BucketPolicy() s3.BucketPolicyOutput {
	return o.ApplyT(func(v *AuditLogging) s3.BucketPolicyOutput { return v.BucketPolicy }).(s3.BucketPolicyOutput)
}

// The S3 Bucket Public Access Block to make data private.
func (o AuditLoggingOutput) BucketPublicAccessBlock() s3.BucketPublicAccessBlockOutput {
	return o.ApplyT(func(v *AuditLogging) s3.BucketPublicAccessBlockOutput { return v.BucketPublicAccessBlock }).(s3.BucketPublicAccessBlockOutput)
}

// The CloudWatch dashboard to review the audit logs.
func (o AuditLoggingOutput) CloudWatchDashboard() cloudwatch.DashboardOutput {
	return o.ApplyT(func(v *AuditLogging) cloudwatch.DashboardOutput { return v.CloudWatchDashboard }).(cloudwatch.DashboardOutput)
}

// The CloudWatch Log Group used to store the data.
func (o AuditLoggingOutput) CloudWatchLogGroup() cloudwatch.LogGroupOutput {
	return o.ApplyT(func(v *AuditLogging) cloudwatch.LogGroupOutput { return v.CloudWatchLogGroup }).(cloudwatch.LogGroupOutput)
}

// The IAM Policy used by the IAM Role for Cloud Trail.
func (o AuditLoggingOutput) CloudWatchPolicy() iam.PolicyOutput {
	return o.ApplyT(func(v *AuditLogging) iam.PolicyOutput { return v.CloudWatchPolicy }).(iam.PolicyOutput)
}

// The IAM Role used by Cloud Trail to write to CloudWatch..
func (o AuditLoggingOutput) CloudWatchRole() iam.RoleOutput {
	return o.ApplyT(func(v *AuditLogging) iam.RoleOutput { return v.CloudWatchRole }).(iam.RoleOutput)
}

// The IAM Role Policy Attachments that attach the IAM Role with the IAM Policy.
func (o AuditLoggingOutput) CloudWatchRolePolicyAttachment() iam.RolePolicyAttachmentOutput {
	return o.ApplyT(func(v *AuditLogging) iam.RolePolicyAttachmentOutput { return v.CloudWatchRolePolicyAttachment }).(iam.RolePolicyAttachmentOutput)
}

// The AWS Organization id.
func (o AuditLoggingOutput) OrganizationId() pulumi.StringOutput {
	return o.ApplyT(func(v *AuditLogging) pulumi.StringOutput { return v.OrganizationId }).(pulumi.StringOutput)
}

// The AWS Organization master account id.
func (o AuditLoggingOutput) OrganizationMasterAccountId() pulumi.StringOutput {
	return o.ApplyT(func(v *AuditLogging) pulumi.StringOutput { return v.OrganizationMasterAccountId }).(pulumi.StringOutput)
}

// The Cloud Trail.
func (o AuditLoggingOutput) Trail() cloudtrail.TrailOutput {
	return o.ApplyT(func(v *AuditLogging) cloudtrail.TrailOutput { return v.Trail }).(cloudtrail.TrailOutput)
}

type AuditLoggingArrayOutput struct{ *pulumi.OutputState }

func (AuditLoggingArrayOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*AuditLogging)(nil)).Elem()
}

func (o AuditLoggingArrayOutput) ToAuditLoggingArrayOutput() AuditLoggingArrayOutput {
	return o
}

func (o AuditLoggingArrayOutput) ToAuditLoggingArrayOutputWithContext(ctx context.Context) AuditLoggingArrayOutput {
	return o
}

func (o AuditLoggingArrayOutput) Index(i pulumi.IntInput) AuditLoggingOutput {
	return pulumi.All(o, i).ApplyT(func(vs []interface{}) *AuditLogging {
		return vs[0].([]*AuditLogging)[vs[1].(int)]
	}).(AuditLoggingOutput)
}

type AuditLoggingMapOutput struct{ *pulumi.OutputState }

func (AuditLoggingMapOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*AuditLogging)(nil)).Elem()
}

func (o AuditLoggingMapOutput) ToAuditLoggingMapOutput() AuditLoggingMapOutput {
	return o
}

func (o AuditLoggingMapOutput) ToAuditLoggingMapOutputWithContext(ctx context.Context) AuditLoggingMapOutput {
	return o
}

func (o AuditLoggingMapOutput) MapIndex(k pulumi.StringInput) AuditLoggingOutput {
	return pulumi.All(o, k).ApplyT(func(vs []interface{}) *AuditLogging {
		return vs[0].(map[string]*AuditLogging)[vs[1].(string)]
	}).(AuditLoggingOutput)
}

func init() {
	pulumi.RegisterInputType(reflect.TypeOf((*AuditLoggingInput)(nil)).Elem(), &AuditLogging{})
	pulumi.RegisterInputType(reflect.TypeOf((*AuditLoggingArrayInput)(nil)).Elem(), AuditLoggingArray{})
	pulumi.RegisterInputType(reflect.TypeOf((*AuditLoggingMapInput)(nil)).Elem(), AuditLoggingMap{})
	pulumi.RegisterOutputType(AuditLoggingOutput{})
	pulumi.RegisterOutputType(AuditLoggingArrayOutput{})
	pulumi.RegisterOutputType(AuditLoggingMapOutput{})
}

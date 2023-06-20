// Code generated by Pulumi SDK Generator DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package databases

import (
	"context"
	"reflect"

	"github.com/pkg/errors"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/ec2"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/rds"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/secretsmanager"
	"github.com/pulumi/pulumi-random/sdk/v4/go/random"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// Cloud Toolkit component for Mysql instances.
type Mysql struct {
	pulumi.ResourceState

	// Security rules to allow connections to this databse instance
	IngressSecurityGroupRules ec2.SecurityGroupRuleArrayOutput `pulumi:"ingressSecurityGroupRules"`
	// Underlying database instance for this component
	Instance rds.InstanceOutput `pulumi:"instance"`
	// Random password generated for admin user
	InstancePassword random.RandomPasswordOutput `pulumi:"instancePassword"`
	// Component that protects and stores admin password in AWS
	Secret secretsmanager.SecretOutput `pulumi:"secret"`
	// Component that updates secrets in AWS
	SecretVersion secretsmanager.SecretVersionOutput `pulumi:"secretVersion"`
	// Security Group attached to this database instance
	SecurityGroup ec2.SecurityGroupOutput `pulumi:"securityGroup"`
	// Set of subnets in which database instance will be deployed
	SubnetGroup rds.SubnetGroupOutput `pulumi:"subnetGroup"`
}

// NewMysql registers a new resource with the given unique name, arguments, and options.
func NewMysql(ctx *pulumi.Context,
	name string, args *MysqlArgs, opts ...pulumi.ResourceOption) (*Mysql, error) {
	if args == nil {
		return nil, errors.New("missing one or more required arguments")
	}

	if args.Database == nil {
		return nil, errors.New("invalid value for required argument 'Database'")
	}
	if args.Version == nil {
		return nil, errors.New("invalid value for required argument 'Version'")
	}
	opts = pkgResourceDefaultOpts(opts)
	var resource Mysql
	err := ctx.RegisterRemoteComponentResource("cloud-toolkit-aws:databases:Mysql", name, args, &resource, opts...)
	if err != nil {
		return nil, err
	}
	return &resource, nil
}

type mysqlArgs struct {
	// Backup configuration parameters for the database instance
	Backup *MysqlBackup `pulumi:"backup"`
	// Configuration parameters for the database instance
	Database MysqlDatabase `pulumi:"database"`
	// Instance type to run the database instance
	Instance *string `pulumi:"instance"`
	// Network configuration parameters for the database instance
	Networking *MysqlNetworking `pulumi:"networking"`
	// Storage configuration parameters for the database instance
	Storage *MysqlStorage `pulumi:"storage"`
	// Version for database instance
	Version MysqlVersion `pulumi:"version"`
}

// The set of arguments for constructing a Mysql resource.
type MysqlArgs struct {
	// Backup configuration parameters for the database instance
	Backup MysqlBackupPtrInput
	// Configuration parameters for the database instance
	Database MysqlDatabaseInput
	// Instance type to run the database instance
	Instance pulumi.StringPtrInput
	// Network configuration parameters for the database instance
	Networking MysqlNetworkingPtrInput
	// Storage configuration parameters for the database instance
	Storage MysqlStoragePtrInput
	// Version for database instance
	Version MysqlVersionInput
}

func (MysqlArgs) ElementType() reflect.Type {
	return reflect.TypeOf((*mysqlArgs)(nil)).Elem()
}

type MysqlInput interface {
	pulumi.Input

	ToMysqlOutput() MysqlOutput
	ToMysqlOutputWithContext(ctx context.Context) MysqlOutput
}

func (*Mysql) ElementType() reflect.Type {
	return reflect.TypeOf((**Mysql)(nil)).Elem()
}

func (i *Mysql) ToMysqlOutput() MysqlOutput {
	return i.ToMysqlOutputWithContext(context.Background())
}

func (i *Mysql) ToMysqlOutputWithContext(ctx context.Context) MysqlOutput {
	return pulumi.ToOutputWithContext(ctx, i).(MysqlOutput)
}

// MysqlArrayInput is an input type that accepts MysqlArray and MysqlArrayOutput values.
// You can construct a concrete instance of `MysqlArrayInput` via:
//
//	MysqlArray{ MysqlArgs{...} }
type MysqlArrayInput interface {
	pulumi.Input

	ToMysqlArrayOutput() MysqlArrayOutput
	ToMysqlArrayOutputWithContext(context.Context) MysqlArrayOutput
}

type MysqlArray []MysqlInput

func (MysqlArray) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*Mysql)(nil)).Elem()
}

func (i MysqlArray) ToMysqlArrayOutput() MysqlArrayOutput {
	return i.ToMysqlArrayOutputWithContext(context.Background())
}

func (i MysqlArray) ToMysqlArrayOutputWithContext(ctx context.Context) MysqlArrayOutput {
	return pulumi.ToOutputWithContext(ctx, i).(MysqlArrayOutput)
}

// MysqlMapInput is an input type that accepts MysqlMap and MysqlMapOutput values.
// You can construct a concrete instance of `MysqlMapInput` via:
//
//	MysqlMap{ "key": MysqlArgs{...} }
type MysqlMapInput interface {
	pulumi.Input

	ToMysqlMapOutput() MysqlMapOutput
	ToMysqlMapOutputWithContext(context.Context) MysqlMapOutput
}

type MysqlMap map[string]MysqlInput

func (MysqlMap) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*Mysql)(nil)).Elem()
}

func (i MysqlMap) ToMysqlMapOutput() MysqlMapOutput {
	return i.ToMysqlMapOutputWithContext(context.Background())
}

func (i MysqlMap) ToMysqlMapOutputWithContext(ctx context.Context) MysqlMapOutput {
	return pulumi.ToOutputWithContext(ctx, i).(MysqlMapOutput)
}

type MysqlOutput struct{ *pulumi.OutputState }

func (MysqlOutput) ElementType() reflect.Type {
	return reflect.TypeOf((**Mysql)(nil)).Elem()
}

func (o MysqlOutput) ToMysqlOutput() MysqlOutput {
	return o
}

func (o MysqlOutput) ToMysqlOutputWithContext(ctx context.Context) MysqlOutput {
	return o
}

// Security rules to allow connections to this databse instance
func (o MysqlOutput) IngressSecurityGroupRules() ec2.SecurityGroupRuleArrayOutput {
	return o.ApplyT(func(v *Mysql) ec2.SecurityGroupRuleArrayOutput { return v.IngressSecurityGroupRules }).(ec2.SecurityGroupRuleArrayOutput)
}

// Underlying database instance for this component
func (o MysqlOutput) Instance() rds.InstanceOutput {
	return o.ApplyT(func(v *Mysql) rds.InstanceOutput { return v.Instance }).(rds.InstanceOutput)
}

// Random password generated for admin user
func (o MysqlOutput) InstancePassword() random.RandomPasswordOutput {
	return o.ApplyT(func(v *Mysql) random.RandomPasswordOutput { return v.InstancePassword }).(random.RandomPasswordOutput)
}

// Component that protects and stores admin password in AWS
func (o MysqlOutput) Secret() secretsmanager.SecretOutput {
	return o.ApplyT(func(v *Mysql) secretsmanager.SecretOutput { return v.Secret }).(secretsmanager.SecretOutput)
}

// Component that updates secrets in AWS
func (o MysqlOutput) SecretVersion() secretsmanager.SecretVersionOutput {
	return o.ApplyT(func(v *Mysql) secretsmanager.SecretVersionOutput { return v.SecretVersion }).(secretsmanager.SecretVersionOutput)
}

// Security Group attached to this database instance
func (o MysqlOutput) SecurityGroup() ec2.SecurityGroupOutput {
	return o.ApplyT(func(v *Mysql) ec2.SecurityGroupOutput { return v.SecurityGroup }).(ec2.SecurityGroupOutput)
}

// Set of subnets in which database instance will be deployed
func (o MysqlOutput) SubnetGroup() rds.SubnetGroupOutput {
	return o.ApplyT(func(v *Mysql) rds.SubnetGroupOutput { return v.SubnetGroup }).(rds.SubnetGroupOutput)
}

type MysqlArrayOutput struct{ *pulumi.OutputState }

func (MysqlArrayOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*Mysql)(nil)).Elem()
}

func (o MysqlArrayOutput) ToMysqlArrayOutput() MysqlArrayOutput {
	return o
}

func (o MysqlArrayOutput) ToMysqlArrayOutputWithContext(ctx context.Context) MysqlArrayOutput {
	return o
}

func (o MysqlArrayOutput) Index(i pulumi.IntInput) MysqlOutput {
	return pulumi.All(o, i).ApplyT(func(vs []interface{}) *Mysql {
		return vs[0].([]*Mysql)[vs[1].(int)]
	}).(MysqlOutput)
}

type MysqlMapOutput struct{ *pulumi.OutputState }

func (MysqlMapOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*Mysql)(nil)).Elem()
}

func (o MysqlMapOutput) ToMysqlMapOutput() MysqlMapOutput {
	return o
}

func (o MysqlMapOutput) ToMysqlMapOutputWithContext(ctx context.Context) MysqlMapOutput {
	return o
}

func (o MysqlMapOutput) MapIndex(k pulumi.StringInput) MysqlOutput {
	return pulumi.All(o, k).ApplyT(func(vs []interface{}) *Mysql {
		return vs[0].(map[string]*Mysql)[vs[1].(string)]
	}).(MysqlOutput)
}

func init() {
	pulumi.RegisterInputType(reflect.TypeOf((*MysqlInput)(nil)).Elem(), &Mysql{})
	pulumi.RegisterInputType(reflect.TypeOf((*MysqlArrayInput)(nil)).Elem(), MysqlArray{})
	pulumi.RegisterInputType(reflect.TypeOf((*MysqlMapInput)(nil)).Elem(), MysqlMap{})
	pulumi.RegisterOutputType(MysqlOutput{})
	pulumi.RegisterOutputType(MysqlArrayOutput{})
	pulumi.RegisterOutputType(MysqlMapOutput{})
}

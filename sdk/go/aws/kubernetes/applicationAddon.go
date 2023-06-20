// Code generated by Pulumi SDK Generator DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package kubernetes

import (
	"context"
	"reflect"

	"github.com/pkg/errors"
	"github.com/pulumi/pulumi-kubernetes/sdk/v3/go/kubernetes"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// IRSAAddon is a component that deploy an HelmChart as ArgoCD Application.
type ApplicationAddon struct {
	pulumi.ResourceState
}

// NewApplicationAddon registers a new resource with the given unique name, arguments, and options.
func NewApplicationAddon(ctx *pulumi.Context,
	name string, args *ApplicationAddonArgs, opts ...pulumi.ResourceOption) (*ApplicationAddon, error) {
	if args == nil {
		return nil, errors.New("missing one or more required arguments")
	}

	if args.K8sProvider == nil {
		return nil, errors.New("invalid value for required argument 'K8sProvider'")
	}
	if args.Name == nil {
		return nil, errors.New("invalid value for required argument 'Name'")
	}
	if args.Namespace == nil {
		return nil, errors.New("invalid value for required argument 'Namespace'")
	}
	opts = pkgResourceDefaultOpts(opts)
	var resource ApplicationAddon
	err := ctx.RegisterRemoteComponentResource("cloud-toolkit-aws:kubernetes:ApplicationAddon", name, args, &resource, opts...)
	if err != nil {
		return nil, err
	}
	return &resource, nil
}

type applicationAddonArgs struct {
	// Create a new Namespace using the given name.
	CreateNamespace *bool `pulumi:"createNamespace"`
	// Kubernetes provider used by Pulumi.
	K8sProvider *kubernetes.Provider `pulumi:"k8sProvider"`
	// The name of the instanced component.
	Name string `pulumi:"name"`
	// The Namespace name where the addon will be installed.
	Namespace string `pulumi:"namespace"`
}

// The set of arguments for constructing a ApplicationAddon resource.
type ApplicationAddonArgs struct {
	// Create a new Namespace using the given name.
	CreateNamespace pulumi.BoolPtrInput
	// Kubernetes provider used by Pulumi.
	K8sProvider kubernetes.ProviderInput
	// The name of the instanced component.
	Name pulumi.StringInput
	// The Namespace name where the addon will be installed.
	Namespace pulumi.StringInput
}

func (ApplicationAddonArgs) ElementType() reflect.Type {
	return reflect.TypeOf((*applicationAddonArgs)(nil)).Elem()
}

type ApplicationAddonInput interface {
	pulumi.Input

	ToApplicationAddonOutput() ApplicationAddonOutput
	ToApplicationAddonOutputWithContext(ctx context.Context) ApplicationAddonOutput
}

func (*ApplicationAddon) ElementType() reflect.Type {
	return reflect.TypeOf((**ApplicationAddon)(nil)).Elem()
}

func (i *ApplicationAddon) ToApplicationAddonOutput() ApplicationAddonOutput {
	return i.ToApplicationAddonOutputWithContext(context.Background())
}

func (i *ApplicationAddon) ToApplicationAddonOutputWithContext(ctx context.Context) ApplicationAddonOutput {
	return pulumi.ToOutputWithContext(ctx, i).(ApplicationAddonOutput)
}

// ApplicationAddonArrayInput is an input type that accepts ApplicationAddonArray and ApplicationAddonArrayOutput values.
// You can construct a concrete instance of `ApplicationAddonArrayInput` via:
//
//	ApplicationAddonArray{ ApplicationAddonArgs{...} }
type ApplicationAddonArrayInput interface {
	pulumi.Input

	ToApplicationAddonArrayOutput() ApplicationAddonArrayOutput
	ToApplicationAddonArrayOutputWithContext(context.Context) ApplicationAddonArrayOutput
}

type ApplicationAddonArray []ApplicationAddonInput

func (ApplicationAddonArray) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*ApplicationAddon)(nil)).Elem()
}

func (i ApplicationAddonArray) ToApplicationAddonArrayOutput() ApplicationAddonArrayOutput {
	return i.ToApplicationAddonArrayOutputWithContext(context.Background())
}

func (i ApplicationAddonArray) ToApplicationAddonArrayOutputWithContext(ctx context.Context) ApplicationAddonArrayOutput {
	return pulumi.ToOutputWithContext(ctx, i).(ApplicationAddonArrayOutput)
}

// ApplicationAddonMapInput is an input type that accepts ApplicationAddonMap and ApplicationAddonMapOutput values.
// You can construct a concrete instance of `ApplicationAddonMapInput` via:
//
//	ApplicationAddonMap{ "key": ApplicationAddonArgs{...} }
type ApplicationAddonMapInput interface {
	pulumi.Input

	ToApplicationAddonMapOutput() ApplicationAddonMapOutput
	ToApplicationAddonMapOutputWithContext(context.Context) ApplicationAddonMapOutput
}

type ApplicationAddonMap map[string]ApplicationAddonInput

func (ApplicationAddonMap) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*ApplicationAddon)(nil)).Elem()
}

func (i ApplicationAddonMap) ToApplicationAddonMapOutput() ApplicationAddonMapOutput {
	return i.ToApplicationAddonMapOutputWithContext(context.Background())
}

func (i ApplicationAddonMap) ToApplicationAddonMapOutputWithContext(ctx context.Context) ApplicationAddonMapOutput {
	return pulumi.ToOutputWithContext(ctx, i).(ApplicationAddonMapOutput)
}

type ApplicationAddonOutput struct{ *pulumi.OutputState }

func (ApplicationAddonOutput) ElementType() reflect.Type {
	return reflect.TypeOf((**ApplicationAddon)(nil)).Elem()
}

func (o ApplicationAddonOutput) ToApplicationAddonOutput() ApplicationAddonOutput {
	return o
}

func (o ApplicationAddonOutput) ToApplicationAddonOutputWithContext(ctx context.Context) ApplicationAddonOutput {
	return o
}

type ApplicationAddonArrayOutput struct{ *pulumi.OutputState }

func (ApplicationAddonArrayOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*ApplicationAddon)(nil)).Elem()
}

func (o ApplicationAddonArrayOutput) ToApplicationAddonArrayOutput() ApplicationAddonArrayOutput {
	return o
}

func (o ApplicationAddonArrayOutput) ToApplicationAddonArrayOutputWithContext(ctx context.Context) ApplicationAddonArrayOutput {
	return o
}

func (o ApplicationAddonArrayOutput) Index(i pulumi.IntInput) ApplicationAddonOutput {
	return pulumi.All(o, i).ApplyT(func(vs []interface{}) *ApplicationAddon {
		return vs[0].([]*ApplicationAddon)[vs[1].(int)]
	}).(ApplicationAddonOutput)
}

type ApplicationAddonMapOutput struct{ *pulumi.OutputState }

func (ApplicationAddonMapOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*ApplicationAddon)(nil)).Elem()
}

func (o ApplicationAddonMapOutput) ToApplicationAddonMapOutput() ApplicationAddonMapOutput {
	return o
}

func (o ApplicationAddonMapOutput) ToApplicationAddonMapOutputWithContext(ctx context.Context) ApplicationAddonMapOutput {
	return o
}

func (o ApplicationAddonMapOutput) MapIndex(k pulumi.StringInput) ApplicationAddonOutput {
	return pulumi.All(o, k).ApplyT(func(vs []interface{}) *ApplicationAddon {
		return vs[0].(map[string]*ApplicationAddon)[vs[1].(string)]
	}).(ApplicationAddonOutput)
}

func init() {
	pulumi.RegisterInputType(reflect.TypeOf((*ApplicationAddonInput)(nil)).Elem(), &ApplicationAddon{})
	pulumi.RegisterInputType(reflect.TypeOf((*ApplicationAddonArrayInput)(nil)).Elem(), ApplicationAddonArray{})
	pulumi.RegisterInputType(reflect.TypeOf((*ApplicationAddonMapInput)(nil)).Elem(), ApplicationAddonMap{})
	pulumi.RegisterOutputType(ApplicationAddonOutput{})
	pulumi.RegisterOutputType(ApplicationAddonArrayOutput{})
	pulumi.RegisterOutputType(ApplicationAddonMapOutput{})
}

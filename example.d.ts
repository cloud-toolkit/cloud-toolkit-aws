import * as pulumi from "@pulumi/pulumi";
import * as pulumiAws from "@pulumi/aws";
export declare class Example extends pulumi.ComponentResource {
    /**
     * Returns true if the given object is an instance of Example.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Example;
    readonly bucket: pulumi.Output<pulumiAws.s3.BucketV2>;
    /**
     * Create a Example resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ExampleArgs, opts?: pulumi.ComponentResourceOptions);
}
/**
 * The set of arguments for constructing a Example resource.
 */
export interface ExampleArgs {
    name: pulumi.Input<string>;
}

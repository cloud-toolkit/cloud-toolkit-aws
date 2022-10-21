import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import { ApplicationAddon } from "./applicationAddon";
import { AwsEbsCsiDriverArgs } from "./ebsCsiDriverArgs";
import { Irsa } from "./irsa";

export { AwsEbsCsiDriverArgs };

export class AwsEbsCsiDriver extends ApplicationAddon<AwsEbsCsiDriverArgs> {
    public readonly namespace?: kubernetes.core.v1.Namespace;

    public readonly application: kubernetes.apiextensions.CustomResource;

    public readonly irsa: Irsa;

    constructor(
        name: string,
        args: AwsEbsCsiDriverArgs,
        opts?: pulumi.CustomResourceOptions
    ) {
        super("cloudToolkit:aws:kubernetes:AwsEbsCsiDriver", name, args, opts);

        const resourceOpts = pulumi.mergeOptions(opts, {
            parent: this,
        });

        this.namespace = this.setupNamespace(resourceOpts);
        this.irsa = this.setupIrsa(resourceOpts);
        this.application = this.setupApplication(resourceOpts);

        this.registerOutputs({
            chart: this.application,
            irsa: this.irsa,
            namespace: this.namespace,
        });
    }

    protected validateArgs(a: AwsEbsCsiDriverArgs): AwsEbsCsiDriverArgs {
        return a;
    }

    private setupIrsa(opts?: pulumi.ResourceOptions): Irsa {
        return new Irsa(`${this.name}-cert-manager`, {
            identityProvidersArn: [...this.args.identityProvidersArn],
            issuerUrl: this.args.issuerUrl,
            k8sProvider: this.args.k8sProvider,
            namespace: this.args.namespace,
            serviceAccountName: this.args.serviceAccountName,
            policies: [this.getIAMPolicy()],
        }, opts);
    }


    protected getIAMPolicy(): pulumi.Output<string> {
        const document = aws.iam.getPolicyDocumentOutput({
            version: "2012-10-17",
            statements: [
                {
                    effect: "Allow",
                    resources: ["*"],
                    actions: [
                        "ec2:CreateSnapshot",
                        "ec2:AttachVolume",
                        "ec2:DetachVolume",
                        "ec2:ModifyVolume",
                        "ec2:DescribeAvailabilityZones",
                        "ec2:DescribeInstances",
                        "ec2:DescribeSnapshots",
                        "ec2:DescribeTags",
                        "ec2:DescribeVolumes",
                        "ec2:DescribeVolumesModifications",
                    ],
                },
                {
                    effect: "Allow",
                    resources: [
                        pulumi.interpolate`arn:${this.args.awsPartition}:ec2:*:*:volume/*`,
                        pulumi.interpolate`arn:${this.args.awsPartition}:ec2:*:*:snapshot/*`,
                    ],
                    actions: ["ec2:CreateTags"],
                    conditions: [
                        {
                            test: "StringEquals",
                            variable: "ec2:CreateAction",
                            values: ["CreateVolume", "CreateSnapshot"],
                        },
                    ],
                },
                {
                    sid: "",
                    effect: "Allow",
                    resources: [
                        pulumi.interpolate`arn:${this.args.awsPartition}:ec2:*:*:volume/*`,
                        pulumi.interpolate`arn:${this.args.awsPartition}:ec2:*:*:snapshot/*`,
                    ],
                    actions: ["ec2:DeleteTags"],
                },
                {
                    effect: "Allow",
                    resources: ["*"],
                    actions: ["ec2:CreateVolume"],
                    conditions: [
                        {
                            test: "StringLike",
                            variable: "aws:RequestTag/ebs.csi.aws.com/cluster",
                            values: ["true"],
                        },
                    ],
                },
                {
                    effect: "Allow",
                    resources: ["*"],
                    actions: ["ec2:CreateVolume"],
                    conditions: [
                        {
                            test: "StringLike",
                            variable: "aws:RequestTag/CSIVolumeName",
                            values: ["*"],
                        },
                    ],
                },
                {
                    effect: "Allow",
                    resources: ["*"],
                    actions: ["ec2:CreateVolume"],
                    conditions: [
                        {
                            test: "StringLike",
                            variable: "aws:RequestTag/kubernetes.io/cluster/*",
                            values: ["owned"],
                        },
                    ],
                },
                {
                    effect: "Allow",
                    resources: ["*"],
                    actions: ["ec2:DeleteVolume"],
                    conditions: [
                        {
                            test: "StringLike",
                            variable: "ec2:ResourceTag/ebs.csi.aws.com/cluster",
                            values: ["true"],
                        },
                    ],
                },
                {
                    effect: "Allow",
                    resources: ["*"],
                    actions: ["ec2:DeleteVolume"],
                    conditions: [
                        {
                            test: "StringLike",
                            variable: "ec2:ResourceTag/CSIVolumeName",
                            values: ["*"],
                        },
                    ],
                },
                {
                    effect: "Allow",
                    resources: ["*"],
                    actions: ["ec2:DeleteVolume"],
                    conditions: [
                        {
                            test: "StringLike",
                            variable: "ec2:ResourceTag/kubernetes.io/cluster/*",
                            values: ["owned"],
                        },
                    ],
                },
                {
                    effect: "Allow",
                    resources: ["*"],
                    actions: ["ec2:DeleteSnapshot"],
                    conditions: [
                        {
                            test: "StringLike",
                            variable: "ec2:ResourceTag/CSIVolumeSnapshotName",
                            values: ["*"],
                        },
                    ],
                },
                {
                    effect: "Allow",
                    resources: ["*"],
                    actions: ["ec2:DeleteSnapshot"],
                    conditions: [
                        {
                            test: "StringLike",
                            variable: "ec2:ResourceTag/ebs.csi.aws.com/cluster",
                            values: ["true"],
                        },
                    ],
                },
            ],
        });

        return document.json;
    }

    protected getApplicationSpec(): any {
        return {
            project: "default",
            source: {
                repoURL: "https://kubernetes-sigs.github.io/aws-ebs-csi-driver/",
                chart: "aws-ebs-csi-driver",
                targetRevision: "2.9.0",
                helm: {
                    releaseName: this.args.name,
                    parameters: [
                        {
                            name: "serviceAccount.create",
                            value: "false",
                        },
                        {
                            name: "serviceAccount.name",
                            value: this.irsa.name,
                        },
                    ],
                },
            },
            destination: {
                server: "https://kubernetes.default.svc",
                namespace: "kube-system",
            },
            syncPolicy: {
                automated: {
                    prune: true,
                    selfHeal: true,
                    allowEmpty: false,
                },
                retry: {
                    limit: 10,
                    backoff: {
                        duration: "5s",
                        factor: 2,
                        maxDuration: "1m",
                    },
                },
                syncOptions: [
                    "Validate=false",
                    "PrunePropagationPolicy=foreground",
                    "PruneLast=true",
                ],
            },
        };
    }
}

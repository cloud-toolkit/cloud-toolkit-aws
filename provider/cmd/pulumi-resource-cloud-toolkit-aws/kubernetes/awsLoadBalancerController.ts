import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";
import { ApplicationAddon } from "./applicationAddon";
import { AwsLoadBalancerControllerArgs } from "./awsLoadBalancerControllerArgs";
import { Irsa } from "./irsa";

export { AwsLoadBalancerControllerArgs };

export class AwsLoadBalancerController extends ApplicationAddon<AwsLoadBalancerControllerArgs> {
    public readonly namespace?: kubernetes.core.v1.Namespace;

    public readonly application: kubernetes.apiextensions.CustomResource;

    public readonly irsa: Irsa;

    constructor(
        name: string,
        args: AwsLoadBalancerControllerArgs,
        opts?: pulumi.CustomResourceOptions
    ) {
        super("cloud-toolkit-aws:kubernetes:AwsLoadBalancerController", name, args, opts);

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

    protected validateArgs(a: AwsLoadBalancerControllerArgs): AwsLoadBalancerControllerArgs {
        return a;
    }

    private setupIrsa(opts?: pulumi.ResourceOptions): Irsa {
        return new Irsa(this.name, {
            identityProvidersArn: [...this.args.identityProvidersArn],
            issuerUrl: this.args.issuerUrl,
            k8sProvider: this.args.k8sProvider,
            namespace: this.args.namespace,
            serviceAccountName: this.args.serviceAccountName,
            policies: [this.getIAMPolicy()],
        }, opts);
    }

    protected getIAMPolicy(): pulumi.Output<string> {
      const current = pulumi.output(aws.getPartition());
      const partition = current.partition;
      const document = aws.iam.getPolicyDocumentOutput({
        version: "2012-10-17",
        statements: [
          {
            effect: "Allow",
            resources: ["*"],
            actions: [
              "iam:CreateServiceLinkedRole",
            ],
            conditions: [
              {
                test: "StringEquals",
                variable: "iam:AWSServiceName",
                values: ["elasticloadbalancing.amazonaws.com"],
              }
            ]
          },
          {
            effect: "Allow",
            resources: ["*"],
            actions: [
              "ec2:DescribeAccountAttributes",
              "ec2:DescribeAddresses",
              "ec2:DescribeAvailabilityZones",
              "ec2:DescribeCoipPools",
              "ec2:DescribeInstances",
              "ec2:DescribeInternetGateways",
              "ec2:DescribeNetworkInterfaces",
              "ec2:DescribeSecurityGroups",
              "ec2:DescribeSubnets",
              "ec2:DescribeTags",
              "ec2:DescribeVpcPeeringConnections",
              "ec2:DescribeVpcs",
              "ec2:GetCoipPoolUsage",
              "elasticloadbalancing:DescribeListenerCertificates",
              "elasticloadbalancing:DescribeListeners",
              "elasticloadbalancing:DescribeLoadBalancerAttributes",
              "elasticloadbalancing:DescribeLoadBalancers",
              "elasticloadbalancing:DescribeRules",
              "elasticloadbalancing:DescribeSSLPolicies",
              "elasticloadbalancing:DescribeTags",
              "elasticloadbalancing:DescribeTargetGroupAttributes",
              "elasticloadbalancing:DescribeTargetGroups",
              "elasticloadbalancing:DescribeTargetHealth",
            ],
          },
          {
            sid: "",
            effect: "Allow",
            resources: ["*"],
            actions: [
              "acm:DescribeCertificate",
              "acm:ListCertificates",
              "cognito-idp:DescribeUserPoolClient",
              "iam:GetServerCertificate",
              "iam:ListServerCertificates",
              "shield:CreateProtection",
              "shield:DeleteProtection",
              "shield:DescribeProtection",
              "shield:GetSubscriptionState",
              "waf-regional:AssociateWebACL",
              "waf-regional:DisassociateWebACL",
              "waf-regional:GetWebACL",
              "waf-regional:GetWebACLForResource",
              "wafv2:AssociateWebACL",
              "wafv2:DisassociateWebACL",
              "wafv2:GetWebACL",
              "wafv2:GetWebACLForResource",
            ]
          },
          {
            effect: "Allow",
            resources: ["*"],
            actions: [
              "ec2:AuthorizeSecurityGroupIngress",
              "ec2:RevokeSecurityGroupIngress",
            ],
          },
          {
            effect: "Allow",
            resources: ["*"],
            actions: [
              "ec2:CreateSecurityGroup"
            ],
          },
          {
            effect: "Allow",
            resources: [pulumi.interpolate`arn:${partition}:ec2:*:*:security-group/*`],
            actions: [
              "ec2:CreateTags"
            ],
            conditions: [
              {
                test: "Null",
                variable: "aws:RequestTag/elbv2.k8s.aws/cluster",
                values: ["false"],
              },
              {
                test: "StringEquals",
                variable: "ec2:CreateAction",
                values: ["CreateSecurityGroup"],
              }
            ],
          },
          {
            effect: "Allow",
            resources: [pulumi.interpolate`arn:${partition}:ec2:*:*:security-group/*`],
            actions: [
              "ec2:CreateTags",
              "ec2:DeleteTags",
            ],
            conditions: [
              {
                test: "Null",
                variable : "aws:ResourceTag/ingress.k8s.aws/cluster",
                values   : ["false"],
              },
            ],
          },

          {
            effect: "Allow",
            resources: [
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:loadbalancer/app/*/*`,
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:loadbalancer/net/*/*`,
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:targetgroup/*/*`,
            ],
            actions: [
              "elasticloadbalancing:AddTags",
              "elasticloadbalancing:DeleteTargetGroup",
              "elasticloadbalancing:RemoveTags",
            ],
            conditions: [
              {
                test     : "Null",
                variable : "aws:ResourceTag/ingress.k8s.aws/cluster",
                values   : ["false"],
              },
            ],
          },

          {
            effect: "Allow",
            resources: [
              pulumi.interpolate`arn:${partition}:ec2:*:*:security-group/*`,
            ],
            actions: [
              "ec2:CreateTags",
              "ec2:DeleteTags",
            ],
            conditions: [
              {
                test  : "Null",
                variable : "aws:ResourceTag/elbv2.k8s.aws/cluster",
                values   : ["false"],
              },
              {
                test     : "Null",
                variable : "aws:RequestTag/elbv2.k8s.aws/cluster",
                values   : ["true"],
              }
            ],
          },

          {
            effect: "Allow",
            resources: ["*"],
            actions: [
              "ec2:AuthorizeSecurityGroupIngress",
              "ec2:DeleteSecurityGroup",
              "ec2:RevokeSecurityGroupIngress",
            ],
            conditions: [
              {
                test     : "Null",
                variable : "aws:ResourceTag/elbv2.k8s.aws/cluster",
                values   : ["false"],
              },
            ],
          },

          {
            effect: "Allow",
            resources: ["*"],
            actions: [
              "elasticloadbalancing:CreateLoadBalancer",
              "elasticloadbalancing:CreateTargetGroup",
            ],
            conditions: [
              {
                test     : "Null",
                variable : "aws:ResourceTag/elbv2.k8s.aws/cluster",
                values   : ["false"],
              },
            ],
          },

          {
            effect: "Allow",
            resources: ["*"],
            actions: [
              "elasticloadbalancing:CreateListener",
              "elasticloadbalancing:CreateRule",
              "elasticloadbalancing:DeleteListener",
              "elasticloadbalancing:DeleteRule",
            ],
            conditions: [
              {
                test     : "Null",
                variable : "aws:ResourceTag/elbv2.k8s.aws/cluster",
                values   : ["false"],
              },
            ],
          },

          {
            effect: "Allow",
            resources: [
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:loadbalancer/app/*/*`,
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:loadbalancer/net/*/*`,
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:targetgroup/*/*`,
            ],
            actions: [
              "elasticloadbalancing:AddTags",
              "elasticloadbalancing:RemoveTags",
            ],
            conditions: [
              {
                test     : "Null",
                variable : "aws:RequestTag/elbv2.k8s.aws/cluster",
                values   : ["true"],
              },

              {
                test     : "Null",
                variable : "aws:ResourceTag/elbv2.k8s.aws/cluster",
                values   : ["false"],
              }
            ],
          },

          {
            effect: "Allow",
            resources: [
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:listener/net/*/*/*`,
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:listener/app/*/*/*`,
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:listener-rule/net/*/*/*`,
              pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:listener-rule/app/*/*/*`,
            ],
            actions: [
              "elasticloadbalancing:AddTags",
              "elasticloadbalancing:RemoveTags",
            ],
          },
          {
            effect: "Allow",
            resources: ["*"],
            actions: [
              "elasticloadbalancing:DeleteLoadBalancer",
              "elasticloadbalancing:DeleteTargetGroup",
              "elasticloadbalancing:ModifyLoadBalancerAttributes",
              "elasticloadbalancing:ModifyTargetGroup",
              "elasticloadbalancing:ModifyTargetGroupAttributes",
              "elasticloadbalancing:SetIpAddressType",
              "elasticloadbalancing:SetSecurityGroups",
              "elasticloadbalancing:SetSubnets",
            ],
            conditions: [
              {
                test     : "Null",
                variable : "aws:ResourceTag/elbv2.k8s.aws/cluster",
                values   : ["false"],
              }
            ]
          },
          {
            effect: "Allow",
            resources: [pulumi.interpolate`arn:${partition}:elasticloadbalancing:*:*:targetgroup/*/*`],
            actions: [
              "elasticloadbalancing:DeregisterTargets",
              "elasticloadbalancing:RegisterTargets",
            ],
          },
          {
            effect: "Allow",
            resources: ["*"],
            actions: [
              "elasticloadbalancing:AddListenerCertificates",
              "elasticloadbalancing:ModifyListener",
              "elasticloadbalancing:ModifyRule",
              "elasticloadbalancing:RemoveListenerCertificates",
              "elasticloadbalancing:SetWebAcl",
            ],
          }
        ],
      });

      return document.json;
    }

  protected getApplicationSpec(): any {
    return {
      project: "default",
      source: {
        repoURL: "https://aws.github.io/eks-charts",
        chart: "aws-load-balancer-controller",
        targetRevision: "1.4.3",
        helm: {
          releaseName: this.args.name,
          parameters: [
            {
              name: "serviceAccount.create",
              value: "false",
            },
            {
              name: "serviceAccount.name",
              value: this.irsa.serviceAccount.metadata.name,
            },
            {
              name: "clusterName",
              value: this.args.clusterName,
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

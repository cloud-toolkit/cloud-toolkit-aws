# Cloud Toolkit Email Sender template

## The Gist

This is a template for the Cloud Toolkit Kubernetes cluster component.

## Architecture

The Kubernetes Cluster is built on top of the Elastic Kubernetes Service provided by Amazon Webservices. It creates everything that you will need, including Node Groups, Addons and the Cluster itself. The only mandatory parameters that you will have to provide are the IPs for the subnet and your cluster name. Note that for this demo a VPC will be created with what we consider safe default IP addresses. You don't have to use them in production, you are free to set your already existing VPCs so that your services can connect to the Kubernetes Cluster.

A Node Group is as the same suggest, a group of nodes. It contains a set of rules that appplies to a subset of nodes in Kubernetes Cluster. Instead of managing individual Virtual Machines, a Node Group will automatically create those instances for you whenever they are need. Some parameters that can be passed to a Node Group are the instance type for the VMs in that group and the minimum and maximum number of nodes that can be up at any given time. Node Groups always live within a Cluster and they cannot be shared accross Clusters. It does not mean that two Node Groups can't communicate with each other, they just need to be in the same VPC or have another mechanism that allows connections between them. For a Cluster to make sense, it needs at leat one Node Group. If not, you will not be able to deploy any application!

Cloud Toolkit Kubernetes Cluster does also offer some addons such as [ADOT Collector](https://github.com/aws-observability/aws-otel-collector) which sends telemetry to AWS CloudWatch, the networking tool for containers [Calico](https://projectcalico.docs.tigera.io/getting-started/kubernetes/) or [cert-manager](https://cert-manager.io/docs/). 

The Ingress backend of choice is (Nginx)[https://www.nginx.com/], one of the most widely used traffic management solutions.

![](assets/Infrastructure%20-%20Kubernetes.svg)

## Usage

### Applying the stack

The stack can be applied like every other Pulumi project.

```bash
pulumi up
``` 

Check the Stack Tree. It should look like the following:

```
    TYPE                                                                        NAME
    pulumi:pulumi:Stack                                                         kubernetes-edu-kubernetes-edu-dev
    ├─ pulumi:providers:aws                                                     default_5_10_0
    ├─ cloudToolkit:aws:kubernetes:Cluster                                      my-cluster-name
    │  ├─ aws:iam/role:Role                                                     my-cluster-name
    │  ├─ aws:iam/rolePolicyAttachment:RolePolicyAttachment                     my-cluster-name
    │  ├─ aws:ec2/tag:Tag                                                       my-cluster-name-subnet-subnet-0679a462c3cd1b2b3-elb
    │  ├─ aws:ec2/securityGroup:SecurityGroup                                   my-cluster-name
    │  ├─ aws:ec2/tag:Tag                                                       my-cluster-name-subnet-subnet-0f26b2ea4d91f4657-elb
    │  ├─ aws:ec2/tag:Tag                                                       my-cluster-name-subnet-subnet-0d7f2a6935b3822bb-elb
    │  ├─ aws:ec2/tag:Tag                                                       my-cluster-name-subnet-0086fec3a403cc1ce-elb
    │  ├─ aws:ec2/tag:Tag                                                       my-cluster-name-subnet-0086fec3a403cc1ce-shared
    │  ├─ aws:ec2/tag:Tag                                                       my-cluster-name-subnet-051fef7c7d61502cd-elb
    │  ├─ aws:ec2/tag:Tag                                                       my-cluster-name-subnet-051fef7c7d61502cd-shared
    │  ├─ aws:ec2/tag:Tag                                                       my-cluster-name-subnet-0d37ee63c65249322-elb
    │  ├─ aws:ec2/tag:Tag                                                       my-cluster-name-subnet-0d37ee63c65249322-shared
    │  ├─ aws:eks/cluster:Cluster                                               my-cluster-name
    │  │  └─ pulumi:providers:kubernetes                                        my-cluster-name
    │  ├─ cloudToolkit:aws:kubernetes:NodeGroup                                 my-cluster-name-default
    │  │  ├─ aws:ec2/launchTemplate:LaunchTemplate                              my-cluster-name-default
    │  │  ├─ aws:iam/role:Role                                                  my-cluster-name-default
    │  │  ├─ aws:iam/rolePolicyAttachment:RolePolicyAttachment                  my-cluster-name-default-nodePolicy
    │  │  ├─ aws:iam/rolePolicyAttachment:RolePolicyAttachment                  my-cluster-name-default-cniPolicy
    │  │  ├─ aws:iam/rolePolicyAttachment:RolePolicyAttachment                  my-cluster-name-default-ecr-readonly
    │  │  └─ aws:eks/nodeGroup:NodeGroup                                        my-cluster-name-default
    │  ├─ cloudToolkit:aws:networking:DNSZone                                   my-cluster-name
    │  │  └─ aws:route53/zone:Zone                                              my-cluster-name
    │  ├─ cloudToolkit:aws:kubernetes:AddonsManager                             my-cluster-name
    │  │  ├─ cloudToolkit:aws:kubernetes:ArgoCD                                 my-cluster-name
    │  │  │  ├─ kubernetes:helm.sh/v3:Chart                                     my-cluster-name
    │  │  │  │  ├─ kubernetes:core/v1:ConfigMap                                 system-argocd/argocd-ssh-known-hosts-cm
    │  │  │  │  ├─ kubernetes:core/v1:ServiceAccount                            system-argocd/argocd-application-controller
    │  │  │  │  ├─ kubernetes:core/v1:Secret                                    system-argocd/argocd-secret
    │  │  │  │  ├─ kubernetes:core/v1:ConfigMap                                 system-argocd/argocd-rbac-cm
    │  │  │  │  ├─ kubernetes:core/v1:ServiceAccount                            system-argocd/argocd-server
    │  │  │  │  ├─ kubernetes:core/v1:ConfigMap                                 system-argocd/argocd-cm
    │  │  │  │  ├─ kubernetes:core/v1:ConfigMap                                 system-argocd/argocd-gpg-keys-cm
    │  │  │  │  ├─ kubernetes:core/v1:ConfigMap                                 system-argocd/argocd-tls-certs-cm
    │  │  │  │  ├─ kubernetes:core/v1:ServiceAccount                            system-argocd/argocd-dex-server
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:ClusterRoleBinding   my-cluster-name-argocd-server
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:Role                 system-argocd/my-cluster-name-argocd-dex-server
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:RoleBinding          system-argocd/my-cluster-name-argocd-application-controller
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:RoleBinding          system-argocd/my-cluster-name-argocd-server
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:Role                 system-argocd/my-cluster-name-argocd-server
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:ClusterRole          my-cluster-name-argocd-server
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:ClusterRoleBinding   my-cluster-name-argocd-application-controller
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:RoleBinding          system-argocd/my-cluster-name-argocd-dex-server
    │  │  │  │  ├─ kubernetes:apiextensions.k8s.io/v1:CustomResourceDefinition  argocdextensions.argoproj.io
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:ClusterRole          my-cluster-name-argocd-application-controller
    │  │  │  │  ├─ kubernetes:rbac.authorization.k8s.io/v1:Role                 system-argocd/my-cluster-name-argocd-application-controller
    │  │  │  │  ├─ kubernetes:apiextensions.k8s.io/v1:CustomResourceDefinition  appprojects.argoproj.io
    │  │  │  │  ├─ kubernetes:apiextensions.k8s.io/v1:CustomResourceDefinition  applications.argoproj.io
    │  │  │  │  ├─ kubernetes:apps/v1:Deployment                                system-argocd/my-cluster-name-argocd-redis
    │  │  │  │  ├─ kubernetes:core/v1:Service                                   system-argocd/my-cluster-name-argocd-redis
    │  │  │  │  ├─ kubernetes:core/v1:Service                                   system-argocd/my-cluster-name-argocd-repo-server
    │  │  │  │  ├─ kubernetes:core/v1:Service                                   system-argocd/my-cluster-name-argocd-dex-server
    │  │  │  │  ├─ kubernetes:core/v1:Service                                   system-argocd/my-cluster-name-argocd-server
    │  │  │  │  ├─ kubernetes:apps/v1:Deployment                                system-argocd/my-cluster-name-argocd-dex-server
    │  │  │  │  ├─ kubernetes:core/v1:Service                                   system-argocd/my-cluster-name-argocd-application-controller
    │  │  │  │  ├─ kubernetes:apps/v1:StatefulSet                               system-argocd/my-cluster-name-argocd-application-controller
    │  │  │  │  ├─ kubernetes:apps/v1:Deployment                                system-argocd/my-cluster-name-argocd-server
    │  │  │  │  ├─ kubernetes:apps/v1:Deployment                                system-argocd/my-cluster-name-argocd-repo-server
    │  │  │  │  └─ kubernetes:networking.k8s.io/v1:Ingress                      system-argocd/my-cluster-name-argocd-server
    │  │  │  └─ kubernetes:core/v1:Namespace                                    my-cluster-name
    │  │  ├─ cloudToolkit:aws:kubernetes:addon:Calico                           my-cluster-name-calico
    │  │  │  ├─ kubernetes:core/v1:Namespace                                    my-cluster-name-calico-system-calico
    │  │  │  └─ kubernetes:argoproj.io/v1alpha1:Application                     my-cluster-name-calico
    │  │  ├─ cloudToolkit:aws:kubernetes:addon:Dashboard                        my-cluster-name-dashboard
    │  │  │  ├─ kubernetes:core/v1:Namespace                                    my-cluster-name-dashboard-system-dashboard
    │  │  │  └─ kubernetes:argoproj.io/v1alpha1:Application                     my-cluster-name-dashboard
    │  │  ├─ cloudToolkit:aws:kubernetes:ClusterAutoscaler                      my-cluster-name-cluster-autoscaler
    │  │  │  ├─ kubernetes:core/v1:Namespace                                    my-cluster-name-cluster-autoscaler-system-cluster-autoscaler
    │  │  │  ├─ kubernetes:argoproj.io/v1alpha1:Application                     my-cluster-name-cluster-autoscaler
    │  │  │  ├─ aws:iam/role:Role                                               my-cluster-name-cluster-autoscaler
    │  │  │  ├─ aws:iam/policy:Policy                                           my-cluster-name-cluster-autoscaler
    │  │  │  ├─ kubernetes:core/v1:ServiceAccount                               my-cluster-name-cluster-autoscaler
    │  │  │  └─ aws:iam/rolePolicyAttachment:RolePolicyAttachment               my-cluster-name-cluster-autoscaler-0
    │  │  ├─ cloudToolkit:aws:kubernetes:AwsDistroForOpenTelemetry              my-cluster-name-adot
    │  │  │  ├─ kubernetes:core/v1:Namespace                                    my-cluster-name-adot-system-observability
    │  │  │  ├─ aws:iam/role:Role                                               my-cluster-name-adot-adot-collector
    │  │  │  ├─ aws:iam/role:Role                                               my-cluster-name-adot-fluent-bit
    │  │  │  ├─ aws:iam/policy:Policy                                           my-cluster-name-adot-fluent-bit
    │  │  │  ├─ aws:iam/policy:Policy                                           my-cluster-name-adot-adot-collector
    │  │  │  ├─ aws:cloudwatch/logGroup:LogGroup                                my-cluster-name-adotperformance
    │  │  │  ├─ aws:iam/rolePolicyAttachment:RolePolicyAttachment               my-cluster-name-adot-adot-collector-1
    │  │  │  ├─ kubernetes:argoproj.io/v1alpha1:Application                     my-cluster-name-adot-operator
    │  │  │  ├─ aws:iam/rolePolicyAttachment:RolePolicyAttachment               my-cluster-name-adot-fluent-bit-0
    │  │  │  ├─ aws:iam/rolePolicyAttachment:RolePolicyAttachment               my-cluster-name-adot-adot-collector-0
    │  │  │  └─ kubernetes:argoproj.io/v1alpha1:Application                     my-cluster-name-adot-application
    │  │  ├─ cloudToolkit:aws:kubernetes:ExternalDNS                            my-cluster-name-external-dns
    │  │  │  ├─ kubernetes:core/v1:Namespace                                    my-cluster-name-external-dns-system-external-dns
    │  │  │  ├─ kubernetes:argoproj.io/v1alpha1:Application                     my-cluster-name-external-dns
    │  │  │  ├─ aws:iam/role:Role                                               my-cluster-name-external-dns
    │  │  │  ├─ kubernetes:core/v1:ServiceAccount                               my-cluster-name-external-dns
    │  │  │  ├─ aws:iam/policy:Policy                                           my-cluster-name-external-dns
    │  │  │  └─ aws:iam/rolePolicyAttachment:RolePolicyAttachment               my-cluster-name-external-dns-0
    │  │  ├─ cloudToolkit:aws:kubernetes:CertManager                            my-cluster-name-cert-manager
    │  │  │  ├─ kubernetes:core/v1:Namespace                                    my-cluster-name-cert-manager-system-cert-manager
    │  │  │  ├─ aws:iam/policy:Policy                                           my-cluster-name-cert-manager
    │  │  │  ├─ aws:iam/role:Role                                               my-cluster-name-cert-manager
    │  │  │  ├─ kubernetes:argoproj.io/v1alpha1:Application                     my-cluster-name-cert-manager
    │  │  │  ├─ aws:iam/rolePolicyAttachment:RolePolicyAttachment               my-cluster-name-cert-manager-0
    │  │  │  └─ kubernetes:core/v1:ServiceAccount                               my-cluster-name-cert-manager
    │  │  ├─ cloudToolkit:aws:kubernetes:AwsEbsCsiDriver                        my-cluster-name-aws-ebs-csi-driver
    │  │  │  ├─ aws:iam/policy:Policy                                           my-cluster-name-aws-ebs-csi-driver
    │  │  │  ├─ kubernetes:argoproj.io/v1alpha1:Application                     my-cluster-name-aws-ebs-csi-driver
    │  │  │  ├─ aws:iam/role:Role                                               my-cluster-name-aws-ebs-csi-driver
    │  │  │  ├─ kubernetes:core/v1:ServiceAccount                               my-cluster-name-aws-ebs-csi-driver
    │  │  │  └─ aws:iam/rolePolicyAttachment:RolePolicyAttachment               my-cluster-name-aws-ebs-csi-driver-0
    │  │  └─ cloudToolkit:aws:kubernetes:addon:IngressNginx                     my-cluster-name-ingress
    │  │     ├─ kubernetes:core/v1:Namespace                                    my-cluster-name-ingress-system-ingress
    │  │     └─ kubernetes:argoproj.io/v1alpha1:Application                     my-cluster-name-ingress
    │  ├─ aws:iam/openIdConnectProvider:OpenIdConnectProvider                   my-cluster-name
    │  └─ kubernetes:apps/v1:DaemonSetPatch                                     my-cluster-name
    ├─ cloudToolkit:aws:networking:VPC                                          vpc
    │  ├─ aws:resourcegroups/group:Group                                        VPC-vpc
    │  ├─ aws:ec2/vpc:Vpc                                                       vpc
    │  ├─ aws:ec2/routeTable:RouteTable                                         vpc-public
    │  ├─ aws:ec2/subnet:Subnet                                                 vpc-private-2
    │  ├─ aws:ec2/routeTable:RouteTable                                         vpc-private
    │  ├─ aws:ec2/subnet:Subnet                                                 vpc-private-1
    │  ├─ aws:ec2/internetGateway:InternetGateway                               vpc
    │  ├─ aws:ec2/subnet:Subnet                                                 vpc-private-3
    │  ├─ aws:ec2/routeTableAssociation:RouteTableAssociation                   vpc-private-2
    │  ├─ aws:ec2/routeTableAssociation:RouteTableAssociation                   vpc-private-1
    │  ├─ aws:ec2/route:Route                                                   vpc-internet-ipv4
    │  ├─ aws:ec2/route:Route                                                   vpc-internet-ipv6
    │  ├─ aws:ec2/routeTableAssociation:RouteTableAssociation                   vpc-private-3
    │  ├─ aws:ec2/subnet:Subnet                                                 vpc-public-2
    │  ├─ aws:ec2/subnet:Subnet                                                 vpc-public-1
    │  ├─ aws:ec2/subnet:Subnet                                                 vpc-public-3
    │  ├─ aws:ec2/routeTableAssociation:RouteTableAssociation                   vpc-public-2
    │  ├─ aws:ec2/routeTableAssociation:RouteTableAssociation                   vpc-public-1
    │  └─ aws:ec2/routeTableAssociation:RouteTableAssociation                   vpc-public-3
    └─ pulumi:providers:tls                                                     default_4_6_0 

```

### Accessing the cluster

The kubeconfig will be exported as a Pulumi output. You can grab it directly from the Terminal Output when applying the changes or by accessing it from the Pulumi CLI afterwards:

```bash
pulumi stack output kubeconfig
```

## Troubleshooting

If you find any problem, you can open an issue in the Cloud Toolkit AWS Templates repository.

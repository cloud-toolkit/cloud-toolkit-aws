import * as pulumi from "@pulumi/pulumi";
import * as bucket from "./storage/bucket";

import {
  Certificate,
  CertificateArgs,
} from "./commons";
import {
  // StaticWeb
  StaticWeb,
  StaticWebArgs,
  TYPENAME_STATICWEB,
  // Queue
  Queue,
  QueueArgs,
  TYPENAME_QUEUE,
} from "./serverless";
import { EmailSender, EmailSenderArgs } from "./email/sender";
import {
  ArgoCD,
  ArgoCDArgs,
  AwsLoadBalancerController,
  AwsLoadBalancerControllerArgs,
  CertManager,
  CertManagerArgs,
  Cluster,
  ClusterAddons,
  ClusterAddonsArgs,
  ClusterArgs,
  ClusterAutoscaler,
  ClusterAutoscalerArgs,
  ExternalDns,
  ExternalDnsArgs,
  IngressNginx,
  IngressNginxArgs,
  NodeGroup,
  NodeGroupArgs,
} from "./kubernetes";
import {
  AccountIam,
  AccountIamArgs,
  AuditLogging,
  AuditLoggingArgs,
  IamTrustedAccount,
  IamTrustedAccountArgs,
  IamTrustingAccount,
  IamTrustingAccountArgs,
  LandingZone,
  LandingZoneArgs,
  Organization,
  OrganizationArgs
} from "./landingzone";
import { Mysql, MysqlArgs} from "./databases/mysql";
import { Calico, CalicoArgs } from "./kubernetes/calico";
import { Dashboard, DashboardArgs } from "./kubernetes/dashboard";
import { AwsEbsCsiDriver, AwsEbsCsiDriverArgs } from "./kubernetes/ebsCsiDriver";
import { AdotApplication } from "./kubernetes/adotApplication";
import { AdotApplicationArgs } from "./kubernetes/adotApplicationArgs";
import { AdotOperator } from "./kubernetes/adotOperator";
import { AdotOperatorArgs } from "./kubernetes/adotOperatorArgs";
import { Fluentbit } from "./kubernetes/fluentbit";
import { FluentbitArgs } from "./kubernetes/fluentbitArgs";


export class Provider implements pulumi.provider.Provider {
  constructor(readonly version: string, readonly schema: string) {}

  async construct(
    name: string,
    type: string,
    inputs: pulumi.Inputs,
    options: pulumi.ComponentResourceOptions
  ): Promise<pulumi.provider.ConstructResult> {
    switch (type) {
      case "cloud-toolkit-aws:common:Certificate":
        return await constructCertificate(name, inputs, options);
      case TYPENAME_QUEUE:
        return await constructQueue(name, inputs, options);
      case TYPENAME_STATICWEB:
          return await constructStaticWeb(name, inputs, options);
      case "cloud-toolkit-aws:email:EmailSender":
        return await constructEmailSender(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:Cluster":
        return await constructKubernetesCluster(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:NodeGroup":
        return await constructKubernetesNodeGroup(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:ClusterAddons":
        return await constructKubernetesClusterAddons(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:ArgoCD":
        return await constructKubernetesArgoCD(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:CertManager":
        return await constructKubernetesCertManager(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:ExternalDns":
        return await constructKubernetesExternalDns(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:IngressNginx":
        return await constructKubernetesIngressNginx(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:Dashboard":
        return await constructKubernetesDashboard(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:Calico":
        return await constructKubernetesCalico(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:AwsEbsCsiDriver":
        return await constructKubernetesEbsDriver(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:ClusterAutoscaler":
        return await constructKubernetesClusterAutoscaler(name, inputs, options);
      case "cloudToolkit:aws:kubernetes:AdotApplication":
        return await constructKubernetesAdotApplication(name, inputs, options);
      case "cloudToolkit:aws:kubernetes:AdotOperator":
        return await constructKubernetesAdotOperator(name, inputs, options);
      case "cloud-toolkit-aws:kubernetes:Fluentbit":
        return await constructKubernetesFluentbit(name, inputs, options);
      case "cloud-toolkit-aws:landingzone:AccountIam":
        return await constructLandingZoneAccountIam(name, inputs, options);
      case "cloud-toolkit-aws:landingzone:Organization":
        return await constructLandingZoneOranization(name, inputs, options);
      case "cloud-toolkit-aws:landingzone:AuditLogging":
        return await constructLandingZoneAuditLogging(name, inputs, options);
      case "cloud-toolkit-aws:landingzone:IamTrustedAccount":
        return await constructLandingZoneIamTrustedAccount(name, inputs, options);
      case "cloud-toolkit-aws:landingzone:IamTrustingAccount":
        return await constructLandingZoneIamTrustingAccount(name, inputs, options);
      case "cloud-toolkit-aws:landingzone:LandingZone":
        return await constructLandingZoneLandingZone(name, inputs, options);
      case "cloud-toolkit-aws:storage:Bucket":
        return await constructBucket(name, inputs, options);
      case "cloud-toolkit-aws:databases:Mysql":
        return await constructMysql(name, inputs, options);
      default:
        throw new Error(`unknown resource type ${type}`);
    }
  }
}
async function constructCertificate(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new Certificate(name, inputs as CertificateArgs, options);

  return {
    urn: resource.urn,
    state: {
      provider: resource.provider,
      certificate: resource.certificate,
      dnsRecords: resource.dnsRecords,
    }
  };
}

async function constructKubernetesCluster(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new Cluster(name, inputs as ClusterArgs, options);

  return {
    urn: resource.urn,
    state: {
      cluster: resource.cluster,
      clusterAddons: resource.clusterAddons,
      cniChart: resource.cniChart,
      defaultOidcProvider: resource.defaultOidcProvider,
      kubeconfig: resource.kubeconfig,
      nodeGroups: resource.nodeGroups,
      provider: resource.provider,
      provisionerRole: resource.provisionerRole,
      provisionerRolePolicy: resource.provisionerRolePolicy,
      provisionerProvider: resource.provisionerProvider,
      role: resource.role,
      rolePolicyAttachment: resource.rolePolicyAttachment,
      securityGroup: resource.securityGroup,
      subnetTags: resource.subnetTags,
    },
  };
}

async function constructKubernetesNodeGroup(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new NodeGroup(name, inputs as NodeGroupArgs, options);
  return {
    urn: resource.urn,
    state: {
      role: resource.role,
      rolePolcyAttachments: resource.rolePolicyAttachments,
      launchTemplate: resource.launchTemplate,
      nodeGroup: resource.nodeGroup,
    },
  };
}

async function constructKubernetesClusterAddons(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new ClusterAddons(name, inputs as ClusterAddonsArgs, options);

  return {
    urn: resource.urn,
    state: {
      adminIngressNginx: resource.adminIngressNginx,
      adotApplication: resource.adotApplication,
      adotOperator: resource.adotOperator,
      argocd: resource.argocd,
      awsLoadBalancerController: resource.awsLoadBalancerController,
      calico: resource.calico,
      certManager: resource.certManager,
      clusterAutoscaler: resource.clusterAutoscaler,
      dashboard: resource.dashboard,
      defaultIngressNginx: resource.defaultIngressNginx,
      ebsCsiDriver: resource.ebsCsiDriver,
      externalDns: resource.externalDns,
    },
  };
}

async function constructKubernetesArgoCD(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new ArgoCD(name, inputs as ArgoCDArgs, options);

  return {
    urn: resource.urn,
    state: {
      adminPassword: resource.adminPassword,
      chart: resource.chart,
      namespace: resource.namespace,
    },
  };
}

async function constructKubernetesExternalDns(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new ExternalDns(name, inputs as ExternalDnsArgs, options);

  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      irsa: resource.irsa,
      namespace: resource.namespace,
    },
  };
}

async function constructKubernetesIngressNginx(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new IngressNginx(name, inputs as IngressNginxArgs, options);

  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      namespace: resource.namespace,
    },
  };
}


async function constructKubernetesCertManager(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new CertManager(name, inputs as CertManagerArgs, options);

  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      irsa: resource.irsa,
      namespace: resource.namespace,
    },
  };
}

async function constructKubernetesDashboard(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new Dashboard(name, inputs as DashboardArgs, options);

  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      namespace: resource.namespace,
    },
  };
}


async function constructKubernetesCalico(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new Calico(name, inputs as CalicoArgs, options);

  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      namespace: resource.namespace,
      installation: resource.installation,
      installationCrd: resource.installationCrd,
    },
  };
}

async function constructKubernetesEbsDriver(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new AwsEbsCsiDriver(name, inputs as AwsEbsCsiDriverArgs, options);

  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      namespace: resource.namespace,
    },
  };
}

async function constructKubernetesAwsLoadBalancerController(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new AwsLoadBalancerController(name, inputs as AwsLoadBalancerControllerArgs, options);
  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      irsa: resource.irsa,
      namespace: resource.namespace,
    },
  };
}

async function constructKubernetesClusterAutoscaler(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new ClusterAutoscaler(name, inputs as ClusterAutoscalerArgs, options);

  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      irsa: resource.irsa,
      namespace: resource.namespace,
    },
  };
}

async function constructKubernetesAdotApplication(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new AdotApplication(name, inputs as AdotApplicationArgs, options);

  return {
    urn: resource.urn,
    state: {
      adotCollectorIRSA: resource.adotCollectorIRSA,
      application: resource.application,
      logGroupMetrics: resource.logGroupMetrics,
      namespace: resource.namespace,
    },
  };
}

async function constructKubernetesFluentbit(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new Fluentbit(name, inputs as FluentbitArgs, options);

  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      fluentBitIRSA: resource.fluentBitIRSA,
      logGroupApplicationLog: resource.logGroupApplicationLog,
      logGroupDataplaneLog: resource.logGroupDataplaneLog,
      logGroupHostLog: resource.logGroupHostLog,
      namespace: resource.namespace,
    },
  };
}

async function constructKubernetesAdotOperator(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const resource = new AdotOperator(name, inputs as AdotOperatorArgs, options);

  return {
    urn: resource.urn,
    state: {
      application: resource.application,
      namespace: resource.namespace,
    },
  };
}

async function constructQueue(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const q = new Queue(name, inputs as  QueueArgs, options);

  return {
    urn: q.sqsQueue.urn,
    state: {
      sqsQueue: q.sqsQueue,
      deadLetterQueue: q.deadLetterQueue
    },
  };
}

async function constructStaticWeb(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const staticweb = new StaticWeb(name, inputs as  StaticWebArgs, options);
  
  return {
    urn: staticweb.urn,
    state: {
      contentBucket: staticweb.contentBucket,
      logsBucket: staticweb.logsBucket,
      contentBucketPolicy: staticweb.contentBucketPolicy,
      originAccessIdentity: staticweb.originAccessIdentity,
      distribution: staticweb.distribution,
      certificate: staticweb.certificate,
      domainValidationOptions: staticweb.domainValidationOptions,
      certificateValidation: staticweb.certificateValidation,
      DNSRecords: staticweb.DNSRecords,
      DNSRecordsForValidation: staticweb.DNSRecordsForValidation,
    },
  };
}

async function constructEmailSender(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const emailSender = new EmailSender(name, inputs as EmailSenderArgs, options);

  return {
    urn: emailSender.urn,
    state: {
      resourceGroups: emailSender.resourceGroups,
      domainIdentity: emailSender.domainIdentity,
      emailIdentity: emailSender.emailIdentity,
      address: emailSender.address,
      domainDKIM: emailSender.domainDKIM,
      dnsDkimRecords: emailSender.dnsDkimRecords,
      dnsZoneId: emailSender.dnsZoneId,
      dnsRecords: emailSender.dnsRecords,
      bounceTopic: emailSender.bounceTopic,
      bounceIdentityNotificationTopic: emailSender.bounceIdentityNotificationTopic,
      bounceQueues: emailSender.bounceQueues,
      bounceAdditionalQueues: emailSender.bounceAdditionalQueues,
      bounceAdditionalQueuesPolicies: emailSender.bounceAdditionalQueuesPolicies,
      bounceTopicSubscriptions: emailSender.bounceTopicSubscriptions,
      complaintTopic: emailSender.complaintTopic,
      complaintIdentityNotificationTopic: emailSender.complaintIdentityNotificationTopic,
      complaintQueues: emailSender.complaintQueues,
      complaintAdditionalQueues: emailSender.complaintAdditionalQueues,
      complaintAdditionalQueuesPolicies: emailSender.complaintAdditionalQueuesPolicies,
      complaintTopicSubscriptions: emailSender.complaintTopicSubscriptions,
      deliveryTopic: emailSender.deliveryTopic,
      deliveryIdentityNotificationTopic: emailSender.deliveryIdentityNotificationTopic,
      deliveryQueues: emailSender.deliveryQueues,
      deliveryAdditionalQueues: emailSender.deliveryAdditionalQueues,
      deliveryAdditionalQueuesPolicies: emailSender.deliveryAdditionalQueuesPolicies,
      deliveryTopicSubscriptions: emailSender.deliveryTopicSubscriptions,
      senderPolicy: emailSender.senderPolicy,
      notificationsPolicy: emailSender.notificationsPolicy,
    },
  };
}

async function constructLandingZoneAccountIam(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const component = new AccountIam(name, inputs as AccountIamArgs, options);

  return {
    urn: component.urn,
    state: {
      alias: component.alias,
      passwordPolicy: component.passwordPolicy,
    }
  };
}

async function constructBucket(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const q = new bucket.Bucket(name, inputs as bucket.BucketArgs, options);

  return {
    urn: q.urn,
    state: {
      role: q.role,
      bucket: q.bucket,
      bucketVersioning: q.bucketVersioning,
      writeBucketPolicy: q.writeBucketPolicy,
      readOnlyBucketPolicy: q.readOnlyBucketPolicy,
      website: q.website,
      bucketPublicAccess: q.bucketPublicAccess,
      bucketPublicAccessPolicy: q.bucketPublicAccessPolicy,
      bucketOwnership: q.bucketOwnership,
      replicationPolicyAttachment: q.replicationPolicyAttachment,
      replicationConfig: q.replicationConfig,
      bucketEncryption: q.bucketEncryption
    },
  };
}

async function constructLandingZoneOranization(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const component = new Organization(name, inputs as OrganizationArgs, options);

  return {
    urn: component.urn,
    state: {
      accountIds: component.accountIds,
      accountProviders: component.accountProviders,
      accounts: component.accounts,
      organization: component.organization,
      organizationalUnits: component.organizationalUnits,
      policies: component.policies,
      policyAttachments: component.policyAttachments,
    },
  };
}

async function constructLandingZoneAuditLogging(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const component = new AuditLogging(name, inputs as AuditLoggingArgs, options);

  return {
    urn: component.urn,
    state: {
      cloudWatchLogGroup: component.cloudWatchLogGroup,
      cloudWatchRole: component.cloudWatchRole,
      cloudWatchPolicy: component.cloudWatchPolicy,
      cloudWatchRolePolicyAttachment: component.cloudWatchRolePolicyAttachment,
      cloudWatchDashboard: component.cloudWatchDashboard,
      bucket: component.bucket,
      bucketPublicAccessBlock: component.bucketPublicAccessBlock,
      bucketLifecycleConfiguration: component.bucketLifecycleConfiguration,
      bucketPolicy: component.bucketPolicy,
      trail: component.trail,
    },
  };
}

async function constructLandingZoneIamTrustedAccount(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const component = new IamTrustedAccount(name, inputs as IamTrustedAccountArgs, options);

  return {
    urn: component.urn,
    state: {
      roleGroups: component.roleGroups,
      roleGroupPolicies: component.roleGroupPolicies,
    },
  };
}

async function constructLandingZoneIamTrustingAccount(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const component = new IamTrustingAccount(name, inputs as IamTrustingAccountArgs, options);

  return {
    urn: component.urn,
    state: {
      delegatedRoles: component.delegatedRoles,
      delegatedRolePolicyAttachments: component.delegatedRolePolicyAttachments,
    },
  };
}

async function constructLandingZoneLandingZone(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const component = new LandingZone(name, inputs as LandingZoneArgs, options);

  return {
    urn: component.urn,
    state: {
      organization: component.organization,
      auditLogging: component.auditLogging,
    },
  };
}

async function constructMysql(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const mysqldb = new Mysql(name, inputs as MysqlArgs, options);

  return {
    urn: mysqldb.urn,
    state: {
      mysql: mysqldb.instance,
      instancePassword: mysqldb.instancePassword,
      secret: mysqldb.secret,
      secretVersion: mysqldb.secretVersion,
      subnetGroup: mysqldb.subnetGroup,
      securityGroup: mysqldb.securityGroup,
      instance: mysqldb.instance,
      ingressSecurityGroupRules: mysqldb.ingressSecurityGroupRules
    },
  };
}

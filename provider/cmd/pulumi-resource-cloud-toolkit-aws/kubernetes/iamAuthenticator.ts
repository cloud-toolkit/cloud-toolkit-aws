import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as kubernetes from "@pulumi/kubernetes";
import * as jsyaml from "js-yaml";
import defaultsDeep from "lodash.defaultsdeep";
import {
  defaultIamAuthenticatorArgs,
  IamAuthenticatorArgs,
} from "./iamAuthenticatorArgs";

export { IamAuthenticatorArgs };

/**
 * IamAuthenticator is a component that integrates the AWS IAM service with the Kubernetes authentication system. He receives a list of AWS IAM users and roles to enable their authentication to the cluster.
 */
export class IamAuthenticator extends pulumi.ComponentResource {
  private args: IamAuthenticatorArgs;
  private name: string;

  /**
   * The list of AWS IAM UserGroupMemebership to provide cluster-admin access to the given users.
   */
  public readonly clusterAdminUserGroupMemberships: aws.iam.UserGroupMembership[];

  /**
   * The AWS IAM Group that has admin permission in the cluster.
   */
  public readonly clusterAdminGroup: aws.iam.Group;

  /**
   * The AWS IAM Group Policy that has admin permission in the cluster.
   */
  public readonly clusterAdminGroupPolicy: aws.iam.GroupPolicy;

  /**
   * The AWS IAM Group Policy that has admin permission in the cluster.
   */
  public readonly clusterAdminRolePolicy: aws.iam.RolePolicy;

  /**
   * The AWS IAM Role that has admin permission in the cluster.
   */
  public readonly clusterAdminRole: aws.iam.Role;

  /**
   * The AWS IAM Group Policy that has admin permission in the cluster.
   */
  public readonly clusterUserPolicy: aws.iam.Policy;

  /**
   * The AWS IAM Group Policy that has admin permission in the cluster.
   */
  public readonly clusterUserPolicyAttachment?: aws.iam.PolicyAttachment;

  /**
   * The Path applied to the authentication ConfigMap.
   */
  public readonly configMap: kubernetes.core.v1.ConfigMap;

  /**
   * The Kubernetes provider.
   */
  public readonly provider: kubernetes.Provider;

  private accountId: Promise<string>;

  constructor(
    name: string,
    args: IamAuthenticatorArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:IamAuthenticator", name, args, opts);
    this.name = name;
    this.args = this.validateArgs(args);

    this.accountId = aws.getCallerIdentity().then(identity => identity.accountId);
    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });

    this.clusterAdminRole = this.setupClusterAdminRole(resourceOpts);
    this.clusterAdminRolePolicy = this.setupClusterAdminRolePolicy(resourceOpts);
    this.clusterAdminGroup = this.setupClusterAdminGroup(resourceOpts);
    this.clusterAdminGroupPolicy = this.setupClusterAdminGroupPolicy(resourceOpts);
    this.clusterAdminUserGroupMemberships = this.setupClusterAdminUserGroupMemberships(resourceOpts);

    this.clusterUserPolicy = this.setupClusterUserPolicy(resourceOpts);
    this.clusterUserPolicyAttachment = this.setupClusterUserPolicyAttachment(resourceOpts);

    this.provider = this.setupKubernetesProvider();
    const k8sOpts = pulumi.mergeOptions(resourceOpts, {
      provider: this.provider,
    });
    this.configMap = this.setupConfigMap(k8sOpts);
  }

  private validateArgs(a: IamAuthenticatorArgs): IamAuthenticatorArgs {
    const args = defaultsDeep({ ...a }, defaultIamAuthenticatorArgs);
    return args;
  }

  private setupClusterAdminRole(opts: pulumi.ResourceOptions): aws.iam.Role {
    const assumePolicy = aws.iam.getPolicyDocumentOutput({
      statements: [
        {
          effect: "Allow",
          principals: [{
            type: "AWS",
            identifiers: [pulumi.interpolate`arn:aws:iam::${this.accountId}:root`],
          }],
          actions: ["sts:AssumeRole"],
        },
      ],
    }, opts);
    return new aws.iam.Role(
      `${this.name}-cluster-admin`,
      {
        name: `${this.name}-cluster-admin`,
        assumeRolePolicy: assumePolicy.json,
      },
      opts
    );
  }

  private setupClusterAdminRolePolicy(opts: pulumi.ResourceOptions): aws.iam.RolePolicy {
    const policyDocument = aws.iam.getPolicyDocumentOutput({
      statements: [
        {
          effect: "Allow",
          actions: ["eks:DescribeCluster"],
          resources: [
            this.args.clusterArn,
          ],
        },
        {
          actions: ["iam:PassRole"],
          resources: ["*"],
          conditions: [{
            test: "StringEquals",
            variable: "iam:PassedToService",
            values: ["eks.amazonaws.com"],
          }],
        },
        {
          effect: "Allow",
          actions: [
            "iam:GetUserPolicy",
            "iam:ListGroupsForUser",
            "iam:ListAttachedUserPolicies",
            "iam:ListUserPolicies",
            "iam:GetUser",
            "iam:ListRoles",
          ],
          resources: ["*"],
        },
        {
          effect: "Allow",
          actions: [
            "iam:GetGroupPolicy",
            "iam:GetPolicyVersion",
            "iam:GetPolicy",
            "iam:ListAttachedGroupPolicies",
            "iam:ListGroupPolicies",
            "iam:ListPolicyVersions",
            "iam:ListPolicies",
            "iam:ListUsers",
          ],
          resources: ["*"],
        }
      ]
    });
    return new aws.iam.RolePolicy(
      `${this.name}-cluster-admin`,
      {
        role: this.clusterAdminRole.id,
        policy: policyDocument.json,
      },
      opts
    );
  }

  private setupClusterAdminGroupPolicy(opts: pulumi.ResourceOptions): aws.iam.GroupPolicy {
    const name =`${this.name}-cluster-admin`;
    const groupPolicyDocument = aws.iam.getPolicyDocumentOutput({
      statements: [
        {
          effect: "Allow",
          actions: ["sts:AssumeRole"],
          resources: [
            this.clusterAdminRole.arn,
          ],
        },
        {
          effect: "Allow",
          actions: ["eks:*"],
          resources: [
            this.args.clusterArn,
          ],
        },
        {
          effect: "Allow",
          actions: ["eks:ListClusters"],
          resources: ["*"],
        },
        {
          effect: "Allow",
          actions: [
            "iam:GetGroupPolicy",
            "iam:GetPolicyVersion",
            "iam:GetPolicy",
            "iam:ListAttachedGroupPolicies",
            "iam:ListGroupPolicies",
            "iam:ListPolicyVersions",
            "iam:ListPolicies",
            "iam:ListRoles",
            "iam:ListUsers",
          ],
          resources: ["*"],
        }
      ],
    });
    return new aws.iam.GroupPolicy(
      name,
      {
        name: name,
        group: this.clusterAdminGroup.name,
        policy: groupPolicyDocument.json,
      },
      opts
    );
  }

  private setupClusterAdminGroup(opts: pulumi.ResourceOptions): aws.iam.Group {
    return new aws.iam.Group(
      `${this.name}-cluster-admin`,
      {
        name: `${this.name}-cluster-admin`,
      },
      opts
    );
  }

  private setupClusterAdminUserGroupMemberships(opts: pulumi.ResourceOptions): aws.iam.UserGroupMembership[] {
    const list: aws.iam.UserGroupMembership[] = [];
    for (const clusterAdmin of this.args.clusterAdmins || []) {
      const membership = new aws.iam.UserGroupMembership(`${this.name}-${clusterAdmin}`, {
        user: clusterAdmin,
        groups: [this.clusterAdminGroup.name],
      });
      list.push(membership);
    }
    return list;
  }

  private setupClusterUserPolicy(opts: pulumi.ResourceOptions): aws.iam.Policy {
    const policyDocument = aws.iam.getPolicyDocumentOutput({
      statements: [
        {
          effect: "Allow",
          actions: ["eks:DescribeCluster"],
          resources: [
            this.args.clusterArn,
          ],
        },
      ]
    });
    return new aws.iam.Policy(
      `${this.name}-cluster-user`,
      {
        policy: policyDocument.json,
      },
      opts
    );
  }

  private setupClusterUserPolicyAttachment(opts: pulumi.ResourceOptions): aws.iam.PolicyAttachment | undefined {
    const name =`${this.name}-cluster-user`;

    let roles: string[] = [];
    if (this.args.roles !== undefined) {
      roles = this.args.roles.map(m => {
        try {
          return m.rolearn.toString().split("/")[1];
        } catch (e) {
          throw Error(`Unable to parse role arn ${m.rolearn}`);
        }
      });
    }

    let users: string[] = [];
    if (this.args.users !== undefined) {
      users = this.args.users.map(m => {
        try {
          return m.userarn.toString().split("/")[1];
        } catch (e) {
          throw Error(`Unable to parse user arn ${m.userarn}`);
        }
      });
    }

    if (roles.length == 0 && users.length == 0) {
      return;
    }

    this.args.roles?.map(m => m.rolearn)
    return new aws.iam.PolicyAttachment(
      `${this.name}-cluster-user`, {
        policyArn: this.clusterUserPolicy.arn,
        roles: roles,
        users: users,
      },
      opts
    );
  }

  private setupConfigMap(opts: pulumi.ResourceOptions): kubernetes.core.v1.ConfigMap {
    const adminRole = {
      rolearn: this.clusterAdminRole.arn,
      username: "admin",
      groups: ["system:masters"]
    };

    const mapRoles = pulumi.all([this.args.roles || [], this.args.nodeGroupRoles || [], [adminRole]]).apply(([roles, nodeGroupRoles, adminRoles]) => {
      return jsyaml.dump([...roles, ...nodeGroupRoles, ...adminRoles]);
    });

    const users = this.args.users || [];
    const clusterAdmins = this.args.clusterAdmins || [];

    const accountId = aws.getCallerIdentity().then(identity => identity.accountId);
    const mapUsers = pulumi.all([users, clusterAdmins, accountId]).apply(([users, clusterAdmins, accountId]) => {
      for (const clusterAdmin of clusterAdmins) {
        users.push({
          userarn: `arn:aws:iam::${accountId}:user/${clusterAdmin}`,
          username: clusterAdmin,
          groups: ["system:masters"],
        });
      }
      return jsyaml.dump(users);
    });
    const mapAccounts = pulumi.all([this.args.accounts || []]).apply(([accounts]) => {
       return jsyaml.dump(accounts);
    });

    return new kubernetes.core.v1.ConfigMap(
      this.name,
      {
        metadata: {
          name: "aws-auth",
          namespace: "kube-system",
        },
        data: {
          mapRoles: mapRoles,
          mapUsers: mapUsers,
          mapAccounts: mapAccounts,
        }
      },
      opts
    );
  }

  private setupKubernetesProvider(): kubernetes.Provider {
    const provider = new kubernetes.Provider(
      this.name,
      {
        kubeconfig: this.args.kubeconfig,
        enableServerSideApply: true,
      }
    );

    return provider;
  }
}

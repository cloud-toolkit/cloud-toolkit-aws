import * as pulumi from "@pulumi/pulumi";

export interface ProjectArgs {
  /**
   * The Project name.
   */
  name: pulumi.Input<string>;
  
  /**
   * The cluster resources to be assigned to the project.
   */
  resources?: ProjectResourcesArgs;

  /**
   * Kubernetes provider used by Pulumi.
   */
  kubeconfig: pulumi.Input<string>;

  /**
   * The Namespace name where the addon will be installed.
   */
  namespace: pulumi.Input<string>;

  /**
   * The list of AWS IAM User arns that can access to this project with 'admin' role.
   */
  adminUserArns?: pulumi.Input<string>[];

  /**
   * The list of AWS IAM User arns that can access to this project with 'edit' role.
   */
  editUserArns?: pulumi.Input<string>[];

  /**
   * The list of AWS IAM User arns that can access to this project with 'view' role.
   */
  viewUserArns?: pulumi.Input<string>[];
}

export interface ProjectResourcesArgs {
  /**
   * Amount of reserverd CPU.
   */
  cpu?: string;

  /**
   * Amount of reserved Memory.
   */
  memory?: string;

  /**
   * Amount of CPU limit.
   */
  limitCpu?: string;

  /**
   * Amount of Memory limit.
   */
  limitMemory?: string;
}

export const defaultProjectArgs = <ProjectArgs>{};

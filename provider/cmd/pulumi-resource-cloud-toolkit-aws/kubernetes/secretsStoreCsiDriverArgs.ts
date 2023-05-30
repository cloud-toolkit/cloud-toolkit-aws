import * as pulumi from "@pulumi/pulumi";
import { ApplicationAddonArgs } from "./applicationAddonArgs";

export interface SecretsStoreCsiDriverArgs extends ApplicationAddonArgs {

  /**
   * Enable synchronization from volumes to Kubernetes secretes.
   */
  syncSecretEnabled: string;
}

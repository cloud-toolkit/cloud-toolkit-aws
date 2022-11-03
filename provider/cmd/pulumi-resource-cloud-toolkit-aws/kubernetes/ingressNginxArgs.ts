import * as pulumi from "@pulumi/pulumi";
import { ApplicationAddonArgs } from "./applicationAddonArgs";

export interface IngressNginxArgs extends ApplicationAddonArgs {
  /**
   * The domain associated to the IngressController.
   */
  tls?: IngressNginxTlsArgs;

  /**
   * The Ingress class name.
   */
  className: string;

  /**
   * The whitelist of CIDR to access to the Ingress Controller.
   */
  whitelist?: string[];

  /**
   * Expose the IngressController with a public Load Balancer.
   */
  public?: boolean;

  /**
   * Set this IngressController with the defaul IngressClass.
   */
  default?: boolean;
}

export interface IngressNginxTlsArgs {
  /**
   * Enable the signed Certificate.
   */
  enabled?: boolean;

  /**
   * The domain to be used to create a signed Certificate.
   */
  domain: string;

  /**
   * The Zone id.
   */
  zoneId: pulumi.Input<string>;
}

export const defaultArgs = {
  className: "",
  whitelist: [],
  public: true,
  default: false,
  tls: {
    enabled: true,
  }
};

import { ApplicationAddonArgs } from "./applicationAddonArgs";

export interface IngressNginxArgs extends ApplicationAddonArgs {
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
}

export const defaultArgs = {
  className: "",
  whitelist: [],
  public: true,
};

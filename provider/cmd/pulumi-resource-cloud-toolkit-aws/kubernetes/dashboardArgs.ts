import { ApplicationAddonArgs } from "./applicationAddonArgs";

export interface DashboardArgs extends ApplicationAddonArgs {
  /**
   * The hostname associated with the dashboard.
   */
  hostname?: string;
}

export const defaultArgs = {};

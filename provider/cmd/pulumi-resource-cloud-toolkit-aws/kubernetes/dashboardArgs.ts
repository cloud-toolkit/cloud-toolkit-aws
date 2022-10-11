import { ApplicationAddonArgs } from "./applicationAddonArgs";

export interface DashboardArgs extends ApplicationAddonArgs {
  hostname?: string;
}

export const defaultArgs = {};
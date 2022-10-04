import { ApplicationAddonArgs } from "./applicationAddonArgs";

export interface IngressNginxArgs extends ApplicationAddonArgs {
  className: string;
  whitelist?: string[];
  public?: boolean;
}

export const defaultArgs = {
  className: "",
  whitelist: [],
  public: true,
};

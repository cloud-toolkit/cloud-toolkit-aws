import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  roots: ["./"],
  verbose: true,
  testPathIgnorePatterns: [
    "/node_modules/",
    "/bin/",
    "fixtures"
  ],
  modulePathIgnorePatterns: ["/bin/"],
};

export default config;

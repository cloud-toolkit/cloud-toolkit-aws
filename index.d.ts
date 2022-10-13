export { ExampleArgs } from "./example";
export declare type Example = import("./example").Example;
export declare const Example: typeof import("./example").Example;
export { ProviderArgs } from "./provider";
export declare type Provider = import("./provider").Provider;
export declare const Provider: typeof import("./provider").Provider;
import * as databases from "./databases";
import * as email from "./email";
import * as kubernetes from "./kubernetes";
import * as landingzone from "./landingzone";
import * as serverless from "./serverless";
import * as storage from "./storage";
import * as types from "./types";
export { databases, email, kubernetes, landingzone, serverless, storage, types, };
import "@pulumi/aws";
import "@pulumi/kubernetes";
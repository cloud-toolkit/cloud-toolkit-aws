import * as pulumi from "@pulumi/pulumi";
import { readFileSync } from "fs";
import { Provider } from "./provider";
import { parse } from 'yaml';

function main(args: string[]) {
    const file = readFileSync(require.resolve('./schema.yaml'), 'utf8');
    const schema = JSON.stringify(parse(file));
    let version: string = require("./package.json").version;
    if (version.startsWith("v")) {
        version = version.slice(1);
    }
    const provider = new Provider(version, schema);
    return pulumi.provider.main(provider, args);
}

main(process.argv.slice(2));

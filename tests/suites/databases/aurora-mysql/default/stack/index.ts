import * as pulumi from "@pulumi/pulumi";
import * as ct from "@cloudtoolkit/aws";

const name = pulumi.getStack();
const component = new ct.databases.AuroraMysql(name);
export const password = component.password.apply(password => password.result);

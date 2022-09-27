import * as pulumi from "@pulumi/pulumi";
import * as queue from "./serverless/queue";

import { Example, ExampleArgs } from "./example";

export class Provider implements pulumi.provider.Provider {
  constructor(readonly version: string, readonly schema: string) {}

  async construct(
    name: string,
    type: string,
    inputs: pulumi.Inputs,
    options: pulumi.ComponentResourceOptions
  ): Promise<pulumi.provider.ConstructResult> {
    switch (type) {
      case "cloud-toolkit-aws:index:Example":
        return await constructExample(name, inputs, options);
      case "cloud-toolkit-aws:serverless:Queue":
        return await constructQueue(name, inputs, options);
      default:
        throw new Error(`unknown resource type ${type}`);
    }
  }
}

async function constructExample(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const example = new Example(name, inputs as ExampleArgs, options);

  return {
    urn: example.urn,
    state: {
      bucket: example.bucket,
    },
  };
}

async function constructQueue(
  name: string,
  inputs: pulumi.Inputs,
  options: pulumi.ComponentResourceOptions
): Promise<pulumi.provider.ConstructResult> {
  const q = new queue.Queue(name, inputs as queue.QueueArgs, options);

  return {
    urn: q.sqsQueue.urn,
    state: {
      sqsQueue: q.sqsQueue,
      deadLetterQueue: q.deadLetterQueue
    },
  };
}

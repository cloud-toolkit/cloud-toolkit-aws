import * as pulumi from "@pulumi/pulumi";
import { QueueArgs } from "../queueArgs";
import defaultQueueConfig from "./fixtures/default-queue";
import customQueueConfig from "./fixtures/custom-queue";
import baseStandardQueueConfigDL from "./fixtures/base-standard-queue-with-permissive-dl";

function GetValue<T>(output: pulumi.Output<T>) {
  return new Promise<T>((resolve, reject) => {
    output.apply((value) => {
      resolve(value);
    });
  });
}

pulumi.runtime.setMocks({
  newResource: function (args: pulumi.runtime.MockResourceArgs): {
    id: string;
    state: any;
  } {
    return {
      id: args.inputs.name + "_id",
      state: args.inputs,
    };
  },
  call: function (args: pulumi.runtime.MockCallArgs) {
    return args.inputs;
  },
});

describe("Queue factory.", function () {
  let component: typeof import("../index");

  function createSQSQueueFromFactory(qName: string, qConfig: QueueArgs) {
    return new component.Queue(qName, qConfig, {});
  }

  beforeAll(async function () {
    component = await import("../index");
  });

  test("It should create a queue", async function () {
    const instance = createSQSQueueFromFactory("test", defaultQueueConfig);
    expect(instance).toBeDefined();
  });

  test("It should create standard queues with the provided name and correct suffix.", async function () {
    const instance = createSQSQueueFromFactory("test", defaultQueueConfig);
    expect(instance.name).toBe("test-standard");
  });

  test("It should utilize the default configuration", async function () {
    const instance = createSQSQueueFromFactory("test", defaultQueueConfig);
    expect(await GetValue(instance.sqsQueue.fifoQueue)).toBe(false);
    expect(await GetValue(instance.sqsQueue.redrivePolicy)).toBeDefined();
    expect(await GetValue(instance.sqsQueue.redriveAllowPolicy)).toBeUndefined();
    expect(await GetValue(instance.sqsQueue.maxMessageSize)).toBe(262144);
    expect(await GetValue(instance.sqsQueue.messageRetentionSeconds)).toBe(345600);
  });

  test("It should update the redrive policy", async function () {
    const instance = createSQSQueueFromFactory(
      "test",
      baseStandardQueueConfigDL
    );
    expect(await GetValue(instance.sqsQueue.redrivePolicy)).toBeDefined();
  });

  test("It should create FIFO queues with the provided name and correct suffix.", async function () {
    const instance = createSQSQueueFromFactory("test", customQueueConfig);
    expect(await GetValue(instance.sqsQueue.fifoQueue)).toBe(true);
    expect(instance.name).toBe("test.fifo");
  });

  test("It should set the maximum message size", async function () {
    const instance = createSQSQueueFromFactory("test", customQueueConfig);
    expect(await GetValue(instance.sqsQueue.maxMessageSize)).toBe(2048);
  });

  test("It should set the message retention time", async function () {
    const instance = createSQSQueueFromFactory("test", customQueueConfig);
    expect(await GetValue(instance.sqsQueue.messageRetentionSeconds)).toBe(500);
  });
});

describe("Dead letter queue.", function () {
  let component: typeof import("../index");

  beforeAll(async function () {
    component = await import("../index");
  });

  test("It should create a dead letter queue with the correct name", async function () {
    const dl = new component.Queue("test", {}).createDeadLetterQueue(
      "test",
      {},
      {}
    );
    expect(await GetValue(dl.name)).toBe("test-deadletter");
  });

  test("It should create a dead letter queue with redrive permissions", async function () {
    const dl = new component.Queue("test", {}).createDeadLetterQueue(
      "test",
      {},
      {}
    );
  });

  test("It should follow the queue type from the arguments", async function () {
    const dl = new component.Queue("test", {}).createDeadLetterQueue(
      "test",
      { fifoQueue: true },
      {}
    );
    expect(await GetValue(dl.fifoQueue)).toBe(true);
  });
});

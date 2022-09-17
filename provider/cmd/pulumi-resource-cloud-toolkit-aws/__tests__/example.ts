import * as pulumi from "@pulumi/pulumi";

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
},
  "project",
  "stack",
  false
);

describe("Minimal configuration", function () {
  let component: typeof import("../example");

  beforeAll(async function () {
    component = await import("../example");
  });

  test("It should create the Bucket component", async function () {
    const componentName = "test";
    const instance = new component.Example(
      componentName,
      {
        name: "test"
      },
      {}
    );
    expect(instance.bucket).toBeDefined();
  });
});

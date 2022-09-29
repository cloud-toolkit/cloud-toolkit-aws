import * as pulumi from "@pulumi/pulumi";
import { EmailSender } from "../sender";
import emailIdentityEMConfig from "./fixtures/email-identity-es";
import emailIdentityEmptyBounceQueuesEMConfig from "./fixtures/email-identity-es-empty-bounce-queues";
import emailIdentityWithoutSNSEMConfig from "./fixtures/email-identity-es-no-sns";
import identityNoAddressEMConfig from "./fixtures/identity-no-address-es";
import domainIdentityEMConfig from "./fixtures/domain-identity-es";
import { DomainIdentity, EmailIdentity } from "@pulumi/aws/ses";

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

describe("Email sender", function () {
  let component: typeof import("../index");

  beforeAll(async function () {
    component = await import("../index");
  });

  test("It should fail when there is no identity provided.", async function () {
    expect(() => {
      new EmailSender("test", identityNoAddressEMConfig, {});
    }).toThrowError("Identity address is not provided.");
  });

  test("It should fail when the identity provided is not valid.", async function () {
    expect(() => {
      new EmailSender(
        "test",
        { ...identityNoAddressEMConfig, identity: "supertest" },
        {}
      );
    }).toThrowError("Invalid identity address: supertest.");
  });

  test("It should create 1 Resource Groups.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.resourceGroups).toHaveLength(1);
    expect(await GetValue(instance.resourceGroups[0].name)).toBe(
      "EmailSender-test"
    );
  });

  test("It should set the needed SNS topics.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.bounceTopic).toBeDefined();
    expect(instance.complaintTopic).toBeDefined();
    expect(instance.deliveryTopic).toBeUndefined();
  });

  test("It should set the needed IdentityNotification topics.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.bounceIdentityNotificationTopic).toBeDefined();
    expect(instance.complaintIdentityNotificationTopic).toBeDefined();
    expect(instance.deliveryIdentityNotificationTopic).toBeUndefined();
  });

  test("It should set the needed identity notification queues.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.bounceQueues).toHaveLength(1);
    expect(instance.complaintQueues).toHaveLength(1);
    expect(instance.deliveryQueues).toHaveLength(0);
  });

  test("It should set the needed identity notification subscriptions.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.bounceTopicSubscriptions).toHaveLength(1);
    expect(instance.complaintTopicSubscriptions).toHaveLength(1);
    expect(instance.deliveryTopicSubscriptions).toHaveLength(0);
  });

  test("It should set the needed policy document.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.senderPolicy).toBeDefined();
    expect(instance.notificationsPolicy).toBeDefined();
  });

  test("It should not set any identity notification if they are disabled.", async function () {
    const instance = new EmailSender(
      "test",
      emailIdentityWithoutSNSEMConfig,
      {}
    );
    expect(instance.bounceIdentityNotificationTopic).toBeUndefined();
    expect(instance.complaintIdentityNotificationTopic).toBeUndefined();
    expect(instance.deliveryIdentityNotificationTopic).toBeUndefined();
  });

  test("It should use the default queues number if the parameter is missing.", async function () {
    const instance = new EmailSender(
      "test",
      emailIdentityEmptyBounceQueuesEMConfig,
      {}
    );
    expect(instance.bounceQueues).toHaveLength(1);
  });

  test("It should use the default queues parameter if it missing.", async function () {
    const instance = new EmailSender(
      "test",
      { ...emailIdentityEmptyBounceQueuesEMConfig, bounce: { enabled: true } },
      {}
    );
    expect(instance.bounceQueues).toHaveLength(1);
  });
});

describe("Email Identity.", function () {
  let component: typeof import("../index");

  beforeAll(async function () {
    component = await import("../index");
  });

  test("It should create an email sender.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance).toBeDefined();
  });

  test("It should have an email identity with the expected email.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    if (instance.emailIdentity) {
      expect(await GetValue(instance.emailIdentity.email)).toBe(
        "example@astrokube.com"
      );
    } else {
      throw new Error("Instance is not a Email Identity");
    }
  });

  test("It should throw a warning when trying to configure the DNS.", async function () {
    const logSpy = jest.spyOn(console, "warn");
    const instance = new EmailSender(
      "test",
      { ...emailIdentityEMConfig, configureDNS: true },
      {}
    );
    expect(logSpy).toHaveBeenCalledWith(
      "Email Identities do not need DNS configuration. Did you want to set a Domain Identity?"
    );
    if (instance.emailIdentity) {
      expect(await GetValue(instance.emailIdentity.email)).toBe(
        "example@astrokube.com"
      );
    } else {
      throw new Error("Instance is not a Email Identity");
    }
  });

  test("It should not set a domain DKIM key.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.domainDKIM).toBeUndefined();
  });

  test("It should not set any DNS DKIM records.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.dnsDkimRecords).toHaveLength(0);
  });

  test("It should not set a DNS zone ID.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.domainDKIM).toBeUndefined();
  });

  test("It should not set any DNS records.", async function () {
    const instance = new EmailSender("test", emailIdentityEMConfig, {});
    expect(instance.dnsRecords).toHaveLength(0);
  });
});

describe("Domain Identity.", function () {
  let component: typeof import("../index");

  beforeAll(async function () {
    component = await import("../index");
  });

  test("It should create an email sender.", async function () {
    const instance = new EmailSender("test", domainIdentityEMConfig, {});
    expect(instance).toBeDefined();
  });

  test("It should have an domain identity with the expected domain.", async function () {
    const instance = new EmailSender("test", domainIdentityEMConfig, {});
    if (instance.domainIdentity) {
      expect(await GetValue(instance.domainIdentity.domain)).toBe("astrokube.com");
    } else {
      throw new Error("Instance is not a Domain Identity");
    }
  });

  describe("With dnsConfigure set to true - Default case.", function () {
    test("It should set a domain DKIM key.", async function () {
      const instance = new EmailSender("test", domainIdentityEMConfig, {});
      expect(instance.domainDKIM).toBeDefined();
    });

    test("It should set 3 DNS DKIM records.", async function () {
      const instance = new EmailSender("test", domainIdentityEMConfig, {});
      expect(instance.dnsDkimRecords).toHaveLength(3);
    });

    test("It should set a DNS zone ID.", async function () {
      const instance = new EmailSender("test", domainIdentityEMConfig, {});
      expect(instance.domainDKIM).toBeDefined();
    });

    test("It should set 3 DNS records.", async function () {
      const instance = new EmailSender("test", domainIdentityEMConfig, {});
      expect(instance.dnsRecords).toHaveLength(3);
    });
  });

  describe("With dnsConfigure set to false.", function () {
    test("It should set a domain DKIM key.", async function () {
      const instance = new EmailSender(
        "test",
        { ...domainIdentityEMConfig, configureDNS: false },
        {}
      );
      expect(instance.domainDKIM).toBeDefined();
    });

    test("It should set 3 DNS DKIM records.", async function () {
      const instance = new EmailSender(
        "test",
        { ...domainIdentityEMConfig, configureDNS: false },
        {}
      );
      expect(instance.dnsDkimRecords).toHaveLength(3);
    });

    test("It should set a DNS zone ID.", async function () {
      const instance = new EmailSender(
        "test",
        { ...domainIdentityEMConfig, configureDNS: false },
        {}
      );
      expect(instance.domainDKIM).toBeDefined();
    });

    test("It should not set any DNS records.", async function () {
      const instance = new EmailSender(
        "test",
        { ...domainIdentityEMConfig, configureDNS: false },
        {}
      );
      expect(instance.dnsRecords).toHaveLength(0);
    });
  });
});

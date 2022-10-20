import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import defaultsDeep from "lodash.defaultsdeep";
import {
  CertificateArgs,
  certificateDefaultArgs,
} from "./certificateArgs";

export { CertificateArgs };

/**
 * Certificate is a component that manages the Lubernetes addons to setup a production-ready cluster.
 */
export class Certificate extends pulumi.ComponentResource {
  private args: CertificateArgs;
  private name: string;

  /**
   * The ACM Certificates used for TLS encryption.
   */
  public readonly certificate: aws.acm.Certificate;

  /**
   * The DNS Records.
   */
  public readonly dnsRecords: aws.route53.Record[];

  /**
   * The Pulumi Provider to create the Certificate.
   */
  public readonly provider: aws.Provider;

  constructor(
    name: string,
    args: CertificateArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super("cloud-toolkit-aws:kubernetes:Certificate", name, args, opts);
    this.name = name;
    this.args = this.validateArgs(args);

    const resourceOpts = pulumi.mergeOptions(opts, {
      parent: this,
    });
    this.provider = this.setupProvider(resourceOpts);
    this.certificate = this.setupCertificate(resourceOpts);
    this.dnsRecords = this.setupRecords(resourceOpts);

    this.registerOutputs({
      provider: this.provider,
      certificate: this.certificate,
      dnsRecords: this.dnsRecords,
    });
  }

  private validateArgs(a: CertificateArgs): CertificateArgs {
    const args = defaultsDeep({ ...a }, certificateDefaultArgs);

    return args;
  }

  private setupCertificate(opts: pulumi.ResourceOptions): aws.acm.Certificate {
    return new aws.acm.Certificate(this.name, {
      domainName: this.args.domain,
      validationMethod: "DNS",
      subjectAlternativeNames: this.args.additionalDomains,
    }, opts);
  }

  private setupProvider(opts: pulumi.ResourceOptions): aws.Provider {
    return new aws.Provider(
      `${this.name}-provider`,
      {
        profile: aws.config.profile,
      },
      { parent: this }
    );
  }

  /**
   * Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
   * See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
   */
  private setupRecords(opts: pulumi.ResourceOptions): aws.route53.Record[] {
    if (this.certificate.domainValidationOptions === undefined) {
      throw new Error("domain validation options must be defined");
    }

    const list: aws.route53.Record[] = [];

    list.push(new aws.route53.Record(
      `${this.name}-validation`,
      {
        name: this.certificate.domainValidationOptions[0].resourceRecordName,
        zoneId: this.args.zoneId,
        type: this.certificate.domainValidationOptions[0].resourceRecordType,
        records: [this.certificate.domainValidationOptions[0].resourceRecordValue],
        ttl: 60,
      },
      { parent: this }
    ));

    if (this.args.additionalDomains !== undefined) {
      for (let i=0; i<this.args.additionalDomains.length; i++) {
        list.push(new aws.route53.Record(
          `${this.name}-${this.args.domain}-validation`,
          {
            name: this.certificate.domainValidationOptions[i].resourceRecordName,
            zoneId: this.args.zoneId,
            type: this.certificate.domainValidationOptions[i].resourceRecordType,
            records: [this.certificate.domainValidationOptions[i].resourceRecordValue],
            ttl: 60,
          },
          { parent: this }
        ));
      }
    }

    return list;
  }

  createCertificateValidation(opts: pulumi.ResourceOptions): aws.acm.CertificateValidation {
    if (this.certificate === undefined) {
      pulumi.log.error("certificate must be defined");
    }

    // if config.includeWWW include the validation record for the www subdomain
    const validationRecordFqdns: pulumi.Output<string>[] = [];
    for(const record of this.dnsRecords) {
      validationRecordFqdns.push(record.fqdn);
    }

    return new aws.acm.CertificateValidation(
      `${this.name}-certificateValidation`,
      {
        certificateArn: this.certificate.arn,
        validationRecordFqdns: validationRecordFqdns,
      },
      {
        parent: this,
        provider: this.provider,
      }
    );
  }
}

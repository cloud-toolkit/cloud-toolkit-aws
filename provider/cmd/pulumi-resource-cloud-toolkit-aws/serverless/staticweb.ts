import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import defaultsDeep from "lodash.defaultsdeep";
import { StaticWebArgs, DNSRecordsArgs, defaultArgs } from "./staticwebArgs";
import { Bucket, BucketArgs } from "../storage";

export { StaticWebArgs, DNSRecordsArgs };

export const TYPENAME_STATICWEB = "cloud-toolkit-aws:serverless:StaticWeb";

function getDomainAndSubdomain(domain: string): {
  subdomain: string;
  parentDomain: string;
} {
  const parts = domain.split(".");
  if (parts.length < 2) {
    throw new Error(`No TLD found on ${domain}`);
  }
  if (parts.length === 2) {
    return { subdomain: "", parentDomain: domain };
  }

  const subdomain = parts[0];
  parts.shift();
  return {
    subdomain,
    parentDomain: parts.join(".") + ".",
  };
}

export class StaticWeb extends pulumi.ComponentResource {
  public readonly name: string;

  public readonly eastRegion: aws.Provider;

  public readonly contentBucket: Bucket;

  public readonly logsBucket: aws.s3.Bucket;

  public readonly contentBucketPolicy: aws.s3.BucketPolicy;

  public readonly originAccessIdentity: aws.cloudfront.OriginAccessIdentity;

  public readonly distribution: aws.cloudfront.Distribution;

  public readonly certificate?: aws.acm.Certificate;

  public readonly domainValidationOptions?: pulumi.Output<
    aws.types.output.acm.CertificateDomainValidationOption[]
  >;

  public readonly certificateValidation?: aws.acm.CertificateValidation;

  public readonly DNSRecords?: DNSRecordsArgs;

  public readonly DNSRecordsForValidation?: DNSRecordsArgs;

  constructor(name: string, args: StaticWebArgs, opts?: pulumi.ResourceOptions) {
    super(TYPENAME_STATICWEB, name, args, opts);
    this.name = name;

    this.eastRegion = new aws.Provider(
      `${this.name}-provider-us-east-1`,
      {
        profile: aws.config.profile,
        region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
      },
      { parent: this }
    );

    const validatedArgs = this.validateArgs(args);

    this.contentBucket = this.createContentBucket(validatedArgs);
    this.logsBucket = this.createLogsBucket(validatedArgs);
    this.originAccessIdentity = this.createCloudFrontOriginAccessIdentity();
    this.contentBucketPolicy = this.createBucketPolicy();

    if (validatedArgs.configureDNS) {
      this.certificate = this.createCertificate(validatedArgs);
      this.domainValidationOptions = this.certificate.domainValidationOptions;
      this.DNSRecordsForValidation =
        this.createDNSRecordsForValidation(validatedArgs);
      this.certificateValidation =
        this.createCertificateValidation(validatedArgs);
    }

    this.distribution = this.createCloudFrontDistribution(validatedArgs);

    if (validatedArgs.configureDNS) {
      this.DNSRecords = this.createDNSRecords(validatedArgs);
    }

    this.registerOutputs({
      contentBucket: pulumi.output(this.contentBucket),
      logsBucket: this.logsBucket,
      contentBucketPolicy: this.contentBucketPolicy,
      originAccessIdentity: this.originAccessIdentity,
      distribution: this.distribution,
      certificate: this.certificate,
      domainValidationOptions: this.domainValidationOptions,
      certificateValidation: this.certificateValidation,
      DNSRecords: this.DNSRecords,
      DNSRecordsForValidation: this.DNSRecordsForValidation,
    });
  }

  validateArgs(args: StaticWebArgs): StaticWebArgs {
    const config = defaultsDeep({ ...args }, defaultArgs);

    if (config.domain != null && !config.configureDNS) {
      throw new Error(
        `It's not possible to config the domain ${args.domain} without configuring a DNS`
      );
    }

    return config;
  }

  createContentBucket({ domain }: StaticWebArgs): Bucket {
    const bucketConfig = <BucketArgs>{
      public: false,
      website: { indexDocument: "index.html", errorDocument: "404.html" },
    };
    return new Bucket(`${this.name}-content-bucket`, bucketConfig, {
      parent: this,
    });
  }

  createLogsBucket({ domain }: StaticWebArgs): aws.s3.Bucket {
    return new aws.s3.Bucket(
      `${this.name}-request-logs`,
      {
        acl: "private",
      },
      { parent: this }
    );
  }

  createCloudFrontOriginAccessIdentity(): aws.cloudfront.OriginAccessIdentity {
    // Generate Origin Access Identity to access the private s3 bucket.
    return new aws.cloudfront.OriginAccessIdentity(
      `${this.name}-originAccessIdentity`,
      {
        comment: "this is needed to setup s3 polices and make s3 not public.",
      },
      { parent: this }
    );
  }

  createBucketPolicy(): aws.s3.BucketPolicy {
    return new aws.s3.BucketPolicy(
      `${this.name}-bucketPolicy`,
      {
        bucket: this.contentBucket.bucket.id, // refer to the bucket created earlier
        policy: pulumi
          .all([
            this.originAccessIdentity.iamArn,
            this.contentBucket.bucket.arn,
          ])
          .apply(([oaiArn, bucketArn]) =>
            JSON.stringify({
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Principal: {
                    AWS: oaiArn,
                  }, // Only allow Cloudfront read access.
                  Action: ["s3:GetObject"],
                  Resource: [`${bucketArn}/*`], // Give Cloudfront access to the entire bucket.
                },
              ],
            })
          ),
      },
      { parent: this.contentBucket.bucket }
    );
  }

  createCertificate({ domain, includeWWW }: StaticWebArgs): aws.acm.Certificate {
    const certificateConfig: aws.acm.CertificateArgs = {
      domainName: domain,
      validationMethod: "DNS",
      subjectAlternativeNames: includeWWW ? [`www.${domain}`] : [],
    };

    return new aws.acm.Certificate(
      `${this.name}-certificate`,
      certificateConfig,
      {
        parent: this,
        provider: this.eastRegion,
      }
    );
  }

  /**
   * Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
   * See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
   */
  createDNSRecordsForValidation(args: StaticWebArgs): DNSRecordsArgs {
    const { domain, includeWWW, dns } = args;

    if (domain === undefined) {
      throw new Error("Domain field must be defined");
    }

    if (this.domainValidationOptions === undefined) {
      throw new Error("Domain validation options must be defined");
    }

    const domainParts = getDomainAndSubdomain(domain);

    const hostedZoneId = aws.route53
      .getZone({ name: domainParts.parentDomain }, { async: true })
      .then((zone) => zone.zoneId);
    const DNSRecordsForValidation: DNSRecordsArgs = {
      domainRecord: new aws.route53.Record(
        `${this.name}-${domain}-validation`,
        {
          name: this.domainValidationOptions[0].resourceRecordName,
          zoneId: hostedZoneId,
          type: this.domainValidationOptions[0].resourceRecordType,
          records: [this.domainValidationOptions[0].resourceRecordValue],
          ttl: dns?.ttl,
        },
        { parent: this }
      ),
    };

    // if config.includeWWW ensure we validate the www subdomain as well
    if (includeWWW) {
      DNSRecordsForValidation.wwwDomainRecord = new aws.route53.Record(
        `${this.name}-${domain}-validationwww`,
        {
          name: this.domainValidationOptions[1].resourceRecordName,
          zoneId: hostedZoneId,
          type: this.domainValidationOptions[1].resourceRecordType,
          records: [this.domainValidationOptions[1].resourceRecordValue],
          ttl: dns?.ttl,
        },
        { parent: this }
      );
    }

    return DNSRecordsForValidation;
  }

  createCertificateValidation({ configureDNS }: StaticWebArgs) {
    if (configureDNS === false || this.DNSRecordsForValidation === undefined) {
      throw new Error(
        "DNSRecordsForValidation does not exist because configureDNS === 'false'"
      );
    }

    if (this.certificate === undefined) {
      throw new Error("Certificate must be defined");
    }

    // if config.includeWWW include the validation record for the www subdomain
    const validationRecordFqdns =
      this.DNSRecordsForValidation.wwwDomainRecord === undefined
        ? [this.DNSRecordsForValidation.domainRecord.fqdn]
        : [
            this.DNSRecordsForValidation.domainRecord.fqdn,
            this.DNSRecordsForValidation.wwwDomainRecord.fqdn,
          ];

    return new aws.acm.CertificateValidation(
      `${this.name}-certificateValidation`,
      {
        certificateArn: this.certificate.arn,
        validationRecordFqdns: validationRecordFqdns,
      },
      {
        parent: this,
        provider: this.eastRegion,
      }
    );
  }

  createDNSRecords(args: StaticWebArgs): DNSRecordsArgs {
    const { domain, includeWWW } = args;

    if (domain === undefined) {
      throw new Error("Domain field must be defined");
    }

    const domainParts = getDomainAndSubdomain(domain);
    const hostedZoneId = aws.route53
      .getZone({ name: domainParts.parentDomain }, { async: true })
      .then((zone) => zone.zoneId);
    const DNSRecords: DNSRecordsArgs = {
      domainRecord: new aws.route53.Record(
        `${this.name}-${domain}`,
        {
          name: domainParts.subdomain,
          zoneId: hostedZoneId,
          type: "A",
          aliases: [
            {
              name: this.distribution.domainName,
              zoneId: this.distribution.hostedZoneId,
              evaluateTargetHealth: true,
            },
          ],
        },
        { parent: this }
      ),
    };
    if (includeWWW) {
      DNSRecords.wwwDomainRecord = new aws.route53.Record(
        `${this.name}-${domain}-www-alias`,
        {
          name: `www.${domain}`,
          zoneId: hostedZoneId,
          type: "A",
          aliases: [
            {
              name: this.distribution.domainName,
              zoneId: this.distribution.hostedZoneId,
              evaluateTargetHealth: true,
            },
          ],
        },
        { parent: this }
      );
    }

    return DNSRecords;
  }

  createCloudFrontDistribution({
    domain,
    includeWWW,
    cache,
    priceClass,
    configureDNS,
  }: StaticWebArgs): aws.cloudfront.Distribution {
    const viewerCertificate = configureDNS
      ? {
          acmCertificateArn: this.certificateValidation?.certificateArn,
          sslSupportMethod: "sni-only",
        }
      : {
          cloudfrontDefaultCertificate: true,
          sslSupportMethod: "sni-only",
        };

    let distributionAliases: string[] = [];

    if (configureDNS && domain) {
      distributionAliases = includeWWW ? [domain, `www.${domain}`] : [domain];
    }

    // distributionArgs configures the CloudFront distribution. Relevant documentation:
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html
    // https://www.terraform.io/docs/providers/aws/r/cloudfront_distribution.html
    const distributionArgs: aws.cloudfront.DistributionArgs = {
      enabled: true,
      // Alternate aliases the CloudFront distribution can be reached at, in addition to https://xxxx.cloudfront.net.
      // Required if you want to access the distribution via config.domain as well.
      aliases: distributionAliases,

      // We only specify one origin for this distribution, the S3 content bucket.
      origins: [
        {
          originId: this.contentBucket.bucket.arn,
          domainName: this.contentBucket.bucket.bucketRegionalDomainName,
          s3OriginConfig: {
            originAccessIdentity:
              this.originAccessIdentity.cloudfrontAccessIdentityPath,
          },
        },
      ],

      defaultRootObject: "index.html",

      // A CloudFront distribution can configure different cache behaviors based on the request path.
      // Here we just specify a single, default cache behavior which is just read-only requests to S3.
      defaultCacheBehavior: {
        targetOriginId: this.contentBucket.bucket.arn,

        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD", "OPTIONS"],

        forwardedValues: {
          cookies: { forward: "none" },
          queryString: false,
        },

        minTtl: 0,
        defaultTtl: cache?.ttl,
        maxTtl: cache?.ttl,
      },

      // "All" is the most broad distribution, and also the most expensive.
      // "100" is the least broad, and also the least expensive.
      priceClass: priceClass,

      // You can customize error responses. When CloudFront receives an error from the origin (e.g. S3 or some other
      // web service) it can return a different error code, and return the response for a different resource.
      customErrorResponses: [
        { errorCode: 404, responseCode: 404, responsePagePath: "/404.html" },
      ],

      restrictions: {
        geoRestriction: {
          restrictionType: "none",
        },
      },

      viewerCertificate,

      loggingConfig: {
        bucket: this.logsBucket.bucketDomainName,
        includeCookies: false,
        prefix: `${domain}/`,
      },
    };

    return new aws.cloudfront.Distribution(
      `${this.name}-cdn`,
      distributionArgs,
      { parent: this }
    );
  }

  public get contentBucketWritePolicy(): aws.iam.Policy {
    return this.contentBucket.writeBucketPolicy;
  }

  public get contentBucketReadPolicy(): aws.iam.Policy {
    return this.contentBucket.readOnlyBucketPolicy;
  }
}

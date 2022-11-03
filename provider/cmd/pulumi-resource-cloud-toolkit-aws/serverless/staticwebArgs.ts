import * as aws from "@pulumi/aws";

export interface StaticWebArgs {
  domain?: string;
  includeWWW?: boolean;
  configureDNS?: boolean;
  cache?: CdnCacheArgs;
  dns?: CdnDnsArgs;
  priceClass?: string;
}

export interface CdnCacheArgs {
  ttl: number;
}

export interface CdnDnsArgs {
  ttl: number;
}

export interface DNSRecordsArgs {
  domainRecord: aws.route53.Record;
  wwwDomainRecord?: aws.route53.Record;
}

export const defaultIncludeWWW = false;
export const defaultCache = {
  ttl: 10,
};
export const defaultDns = {
  ttl: 60,
};
export const defaultPriceClass = "PriceClass_100";

export const defaultArgs = {
  includeWWW: defaultIncludeWWW,
  cache: defaultCache,
  dns: defaultDns,
  priceClass: defaultPriceClass,
  configureDNS: true,
};

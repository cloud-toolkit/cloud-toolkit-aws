import * as aws from "@pulumi/aws";

/**
 * Arguments to create a Cloud Toolkit Staticweb component.
 */
export interface StaticWebArgs {
  /**
   * Set to true to add an alias to wwww.<domain>
   */
  domain?: string;
  /**
   * Set to true to add an alias to wwww.<domain>
   */
  includeWWW?: boolean;
  /**
   * Set to true to configure DNS
   */
  configureDNS?: boolean;
  /**
   * Cloud Front distribution cache
   */
  cache?: CdnCacheArgs;
  /**
   * DNS configuration
   */
  dns?: CdnDnsArgs;
  /**
   * Cloud Front distribution priceClass 
   */
  priceClass?: string;
}

/**
 * Arguments to configure the Cloud Front distribution cache 
 */
export interface CdnCacheArgs {
  /**
   * Cloud Front distribution cache time to live
   */
  ttl: number;
}

/**
 * Arguments to configure the DNS
 */
export interface CdnDnsArgs {
  /**
   * DNS time to live
   */
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

import * as aws from "@pulumi/aws";

/**
 * Arguments to create a Cloud Toolkit Staticweb component.
 */
export interface StaticWebArgs {
  /**
   * Domain that will point to the Cloud Front distribution. The hosted zone is automatically extracted by removing the first subdomain.
   * e.g. my.nice.website.com -> my - subdomain | nice.website.com - hosted zone.
   * The subdomain is used as the name of the DNS Record that points to the Cloud Front distribution.
   * configureDNS should be set to true.
   */
  domain?: string;
  /**
   * Subdomain and parent domain of the DNS Record. The parent domain is used to determine the hosted zone that will hold the DNS Record.
   * The subdomain is used as the name of the DNS Record that points to the Cloud Front distribution.
   * Used alongside domain. configureDNS should be set to true.
   */
  domainParts?: DomainPartsArgs
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
 * Arguments to manually configure the domain of the DNS Record that points to the CloudFront distribution
 */
export interface DomainPartsArgs {
  /**
   * Subdomain part that will be the name of the DNS Record
   */
  subdomain: string;
  /**
   * Domain used to extract the hosted zone id for the DNS Record
   */
  parentDomain: string;
}

/**
 * Arguments to configure the DNS
 */
export interface CdnDnsArgs {
  /**
   * DNS time to live
   */
  ttl: number;
  /**
   * Hosted zone ID to store the DNS records
   */
  hostedZoneId: string;
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

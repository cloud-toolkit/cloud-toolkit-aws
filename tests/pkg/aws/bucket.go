package aws

import (
	"context"

	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

func GetBucketRegion(name string) (string, error) {
	sess := GetSession()
	return s3manager.GetBucketRegion(context.TODO(), sess, name, "us-west-2")
}

func IsPublicBucket(name string) (bool, error) {
	sess := GetSession()
	svc := s3.New(sess)

	input := &s3.GetPublicAccessBlockInput{}
	input.SetBucket(name)
	output, err := svc.GetPublicAccessBlock(input)

	if err != nil {
		return false, err
	}

	if *output.PublicAccessBlockConfiguration.BlockPublicAcls == false &&
		*output.PublicAccessBlockConfiguration.BlockPublicPolicy == false &&
		*output.PublicAccessBlockConfiguration.IgnorePublicAcls == false {
		return true, nil
	}

	return false, nil
}

func GetBucketVersioning(name string) (*string, error) {
	sess := GetSession()
	svc := s3.New(sess)

	input := &s3.GetBucketVersioningInput{}
	input.SetBucket(name)
	output, err := svc.GetBucketVersioning(input)

	return output.Status, err
}

func IsBucketVersioningEnabled(name string) (bool, error) {
	versioning, err := GetBucketVersioning(name)
	if err != nil {
		return false, err
	}

	if versioning == nil {
		return false, nil
	}

	return *versioning == s3.BucketVersioningStatusEnabled, nil
}

func IsBucketVersioningSuspended(name string) (bool, error) {
	versioning, err := GetBucketVersioning(name)
	if err != nil {
		return false, err
	}

	if versioning == nil {
		return false, nil
	}

	return *versioning == s3.BucketVersioningStatusSuspended, nil
}

func IsBucketVersioningDisabled(name string) (bool, error) {
	versioning, err := GetBucketVersioning(name)
	if err != nil {
		return false, err
	}

	return versioning == nil, nil
}

func GetBucketEncryption(name string) (*s3.ServerSideEncryptionConfiguration, error) {
	sess := GetSession()
	svc := s3.New(sess)

	input := &s3.GetBucketEncryptionInput{}
	input.SetBucket(name)
	output, err := svc.GetBucketEncryption(input)

	return output.ServerSideEncryptionConfiguration, err
}

func IsBucketEncryptedWithServerSideEncryption(name string) (bool, error) {
	_, err := GetBucketEncryption(name)
	if err != nil {
		if awsErr, ok := err.(awserr.Error); ok {
			if awsErr.Code() == "ServerSideEncryptionConfigurationNotFoundError" {
				return false, nil
			}
		}
		return false, err
	}

	return true, nil
}

package main

import (
	"testing"

	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/aws"
	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/stack"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var s stack.Stack

func Test(t *testing.T) {
	RegisterFailHandler(Fail)

	s = stack.NewStack(t)
	RunSpecs(t, "Storage - Bucket - Default configuration")
}

var _ = Describe("Using default configuration,", func() {
	Describe("the stack", s.Setup())

	Describe("the AWS bucket", func() {
		It("should be created in Ireland", func() {
			bucketName := s.GetOutput("bucketName")
			region, err := aws.GetBucketRegion(bucketName)
			Expect(err).To(BeNil())
			Expect(region).To(Equal("eu-west-1"))
		})

		It("should be private", func() {
			bucketName := s.GetOutput("bucketName")
			isPublic, err := aws.IsPublicBucket(bucketName)

			Expect(err).To(BeNil())
			Expect(isPublic).To(BeFalse())
		})

		It("should have versioning disabled", func() {
			bucketName := s.GetOutput("bucketName")
			isDisabled, err := aws.IsBucketVersioningDisabled(bucketName)
			Expect(err).To(BeNil())
			Expect(isDisabled).To(BeTrue())
		})

		It("should have encryption disabled", func() {
			bucketName := s.GetOutput("bucketName")
			isEncrypted, err := aws.IsBucketEncryptedWithServerSideEncryption(bucketName)
			Expect(err).To(BeNil())
			Expect(isEncrypted).To(BeFalse())
		})
	})

	Describe("the stack", s.Destroy())
})

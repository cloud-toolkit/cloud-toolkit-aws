package main

import (
	"testing"

	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/aws"
	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/stack"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/pulumi/pulumi/pkg/v3/testing/integration"
)

var program *integration.ProgramTester

func Test(t *testing.T) {
	RegisterFailHandler(Fail)

	opts := stack.GetProgramOpts()
	program = integration.ProgramTestManualLifeCycle(t, &opts)
	RunSpecs(t, "Storage - Bucket - Default configuration")
}

var _ = Describe("Using default configuration,", func() {
	Describe("the stack", stack.SetupStack(program))

	Describe("the AWS bucket", func() {
		It("should be created in Ireland", func() {
			bucketName := stack.GetStackOutput(program, "bucketName")
			region, err := aws.GetBucketRegion(bucketName)
			Expect(err).To(BeNil())
			Expect(region).To(Equal("eu-west-1"))
		})

		It("should be private", func() {
			bucketName := stack.GetStackOutput(program, "bucketName")
			isPublic, err := aws.IsPublicBucket(bucketName)

			Expect(err).To(BeNil())
			Expect(isPublic).To(BeFalse())
		})

		It("should have versioning disabled", func() {
			bucketName := stack.GetStackOutput(program, "bucketName")
			isDisabled, err := aws.IsBucketVersioningDisabled(bucketName)
			Expect(err).To(BeNil())
			Expect(isDisabled).To(BeTrue())
		})

		It("should have encryption disabled", func() {
			bucketName := stack.GetStackOutput(program, "bucketName")
			isEncrypted, err := aws.IsBucketEncryptedWithServerSideEncryption(bucketName)
			Expect(err).To(BeNil())
			Expect(isEncrypted).To(BeFalse())
		})
	})

	Describe("the stack", func() {
		It("should be destroyed", func() {
			err := program.TestLifeCycleDestroy()
			Expect(err).To(BeNil())
		})
	})
})

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
	RunSpecs(t, "Storage - Bucket - Encrypted")
}

var _ = Describe("Using encrypted configuration,", func() {
	Describe("the stack", stack.SetupStack(program))

	Describe("the AWS bucket", func() {
		It("should have encryption enabled", func() {
			bucketName := stack.GetStackOutput(program, "bucketName")
			isEncrypted, err := aws.IsBucketEncryptedWithServerSideEncryption(bucketName)
			Expect(err).To(BeNil())
			Expect(isEncrypted).To(BeTrue())
		})
	})

	Describe("the stack", func() {
		It("should be destroyed", func() {
			err := program.TestLifeCycleDestroy()
			Expect(err).To(BeNil())
		})
	})
})

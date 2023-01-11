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
	RunSpecs(t, "Storage - Bucket - Public")
}

var _ = Describe("Using public configuration,", func() {
	Describe("the stack", stack.SetupStack(program))

	Describe("the AWS bucket", func() {
		It("should be public", func() {
			bucketName := stack.GetStackOutput(program, "bucketName")
			isPublic, err := aws.IsPublicBucket(bucketName)

			Expect(err).To(BeNil())
			Expect(isPublic).To(BeTrue())
		})
	})

	Describe("the stack", func() {
		It("should be destroyed", func() {
			err := program.TestLifeCycleDestroy()
			Expect(err).To(BeNil())
		})
	})
})

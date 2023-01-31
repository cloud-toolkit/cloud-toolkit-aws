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
	RunSpecs(t, "Storage - Bucket - Encrypted")
}

var _ = Describe("Using encrypted configuration,", func() {
	Describe("the stack", s.Setup())

	Describe("the AWS bucket", func() {
		It("should have encryption enabled", func() {
			bucketName := s.GetOutput("bucketName")
			isEncrypted, err := aws.IsBucketEncryptedWithServerSideEncryption(bucketName)
			Expect(err).To(BeNil())
			Expect(isEncrypted).To(BeTrue())
		})
	})

	Describe("the stack", s.Destroy())
})

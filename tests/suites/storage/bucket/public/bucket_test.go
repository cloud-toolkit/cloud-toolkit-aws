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
	RunSpecs(t, "Storage - Bucket - Public")
}

var _ = Describe("Using public configuration,", func() {
	Describe("the stack", s.Setup())

	Describe("the AWS bucket", func() {
		It("should be public", func() {
			bucketName := s.GetOutput("bucketName")
			isPublic, err := aws.IsPublicBucket(bucketName)

			Expect(err).To(BeNil())
			Expect(isPublic).To(BeTrue())
		})
	})

	Describe("the stack", s.Destroy())
})

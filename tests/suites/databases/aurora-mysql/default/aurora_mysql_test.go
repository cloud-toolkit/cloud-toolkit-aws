package main

import (
	"testing"

	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/stack"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var s stack.Stack

func Test(t *testing.T) {
	RegisterFailHandler(Fail)

	s = stack.NewStack(t)
	RunSpecs(t, "Databases - AuroraMysql - Default configuration")
}

var _ = Describe("Using default configuration,", func() {
	Describe("the stack", s.Setup())

	Describe("the password", func() {
		It("should be composed of 14 chars", func() {
			password := s.GetSecret("password")
			Expect(len(password)).To(Equal(14))
		})
	})

	Describe("the cluster", func() {
		It("should have 2 instances", func() {
			resource := s.GetResourceByName("AuroraMysql", s.GetStackName())
			rawInstances, ok := resource.Outputs["instances"]
			if !ok {
				Fail("Property 'instances' not found")
			}

			instances, ok := rawInstances.([]interface{})
			if !ok {
				Fail("Can't convert 'instances' property to array")
			}
			Expect(len(instances)).To(Equal(2))
		})
	})

	Describe("the security group", func() {
		It("should have 0.0.0.0/0 as allowed CIDR", func() {
			resource := s.GetResourceByName("SecurityGroupRule", s.GetStackName())
			rawCidrBlocks, ok := resource.Outputs["cidrBlocks"]
			if !ok {
				Fail("Property 'cidrBlocks' not found")
			}

			cidrBlocks, ok := rawCidrBlocks.([]interface{})
			if !ok {
				Fail("Can't convert 'cidrBlocks' property to array")
			}
			Expect(len(cidrBlocks)).To(Equal(1))

			cidrBlock, ok := cidrBlocks[0].(string)
			if !ok {
				Fail("Can't convert 'cidrBlock' to string")
			}
			Expect(cidrBlock).To(Equal("0.0.0.0/0"))
		})
	})

	Describe("the stack", s.Destroy())
})

package serverless

import (
	"testing"

	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/aws"
	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/stack"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/pulumi/pulumi/pkg/v3/testing/integration"
)

const msg = "This is a message"

var program *integration.ProgramTester

func Test(t *testing.T) {
	RegisterFailHandler(Fail)

	opts := stack.GetProgramOpts()
	program = integration.ProgramTestManualLifeCycle(t, &opts)
	RunSpecs(t, "Serverless - Queue - Default")
}

var _ = Describe("Queue", func() {

	Describe("the stack", stack.SetupStack(program))

	Describe("the feature", func() {

		It("send a message should work", func() {
			qUrl := stack.GetStackOutput(program, "queueURL")

			c := aws.CreateSQSClient()
			_, err := aws.SendSQSMessage(c, msg, qUrl)
			Expect(err).NotTo(HaveOccurred())
		})

		It("read the message previously sent should work", func() {
			qUrl := stack.GetStackOutput(program, "queueURL")

			c := aws.CreateSQSClient()
			rs, err := aws.SendSQSMessage(c, msg, qUrl)
			Expect(err).NotTo(HaveOccurred())
			rc, err := aws.ReceiveSQSMessage(c, qUrl)
			Expect(err).NotTo(HaveOccurred())
			Expect(len(rc.Messages)).To(Equal(1))
			Expect(*rc.Messages[0].Body).To(Equal(msg))
			Expect(*rc.Messages[0].MessageId).To(Equal(*rs.MessageId))
		})
	})

	Describe("the stack", func() {
		It("should be destroyed", func() {
			err := program.TestLifeCycleDestroy()
			Expect(err).To(BeNil())
		})
	})
})

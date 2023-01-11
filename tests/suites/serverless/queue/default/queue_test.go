package serverless

import (
	"testing"

	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/aws"
	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/stack"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/pulumi/pulumi/pkg/v3/testing/integration"
)

var program *integration.ProgramTester
var stackInfo *integration.RuntimeValidationStackInfo = &integration.RuntimeValidationStackInfo{}

func Test(t *testing.T) {
	RegisterFailHandler(Fail)

	opts := stack.NewProgramOpts(stackInfo)
	program = integration.ProgramTestManualLifeCycle(t, &opts)
	RunSpecs(t, "Serverless - Queue - Default")
}

const msg = "This is a message"

var sendMessageOutput *sqs.SendMessageOutput

var _ = Describe("Using default configuration,", func() {
	Describe("the stack", stack.SetupStack(program))

	Describe("the feature", func() {

		It("send a message should work", func() {
			qUrl := stack.GetStackOutput(stackInfo, "queueURL")

			c := aws.CreateSQSClient()
			rs, err := aws.SendSQSMessage(c, msg, qUrl)
			Expect(err).NotTo(HaveOccurred())
			sendMessageOutput = rs
		})

		It("read the message previously sent should work", func() {
			qUrl := stack.GetStackOutput(stackInfo, "queueURL")

			c := aws.CreateSQSClient()
			rc, err := aws.ReceiveSQSMessage(c, qUrl)
			Expect(err).NotTo(HaveOccurred())
			Expect(len(rc.Messages)).To(Equal(1))
			Expect(*rc.Messages[0].Body).To(Equal(msg))
			Expect(*rc.Messages[0].MessageId).To(Equal(*sendMessageOutput.MessageId))
		})
	})

	Describe("the stack", func() {
		It("should be destroyed", func() {
			err := program.TestLifeCycleDestroy()
			Expect(err).To(BeNil())
		})
	})
})

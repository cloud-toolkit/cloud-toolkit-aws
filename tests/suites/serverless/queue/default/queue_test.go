package serverless

import (
	"testing"

	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/aws"
	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/stack"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var s stack.Stack

func Test(t *testing.T) {
	RegisterFailHandler(Fail)

	s = stack.NewStack(t)
	RunSpecs(t, "Serverless - Queue - Default")
}

const msg = "This is a message"

var sendMessageOutput *sqs.SendMessageOutput

var _ = Describe("Using default configuration,", func() {
	Describe("the stack", s.Setup())

	Describe("the feature", func() {

		It("send a message should work", func() {
			qUrl := s.GetOutput("queueURL")

			c := aws.CreateSQSClient()
			rs, err := aws.SendSQSMessage(c, msg, qUrl)
			Expect(err).NotTo(HaveOccurred())
			sendMessageOutput = rs
		})

		It("read the message previously sent should work", func() {
			qUrl := s.GetOutput("queueURL")

			c := aws.CreateSQSClient()
			rc, err := aws.ReceiveSQSMessage(c, qUrl)
			Expect(err).NotTo(HaveOccurred())
			Expect(len(rc.Messages)).To(Equal(1))
			Expect(*rc.Messages[0].Body).To(Equal(msg))
			Expect(*rc.Messages[0].MessageId).To(Equal(*sendMessageOutput.MessageId))
		})
	})

	Describe("the stack", s.Destroy())
})

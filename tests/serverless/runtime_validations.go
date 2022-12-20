package serverless

import (
	"fmt"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/pulumi/pulumi/pkg/v2/testing/integration"
)

func createSQSClient() *sqs.SQS {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	svc := sqs.New(sess)
	return svc
}

func sendSQSMessage(svc *sqs.SQS, messageBody string, queueURL string) (*sqs.SendMessageOutput, error) {
	result, err := svc.SendMessage(&sqs.SendMessageInput{
		MessageBody: aws.String(messageBody),
		QueueUrl:    &queueURL,
	})

	if err != nil {
		return nil, err
	}

	return result, nil

}

func receiveSQSMessage(svc *sqs.SQS, queueURL string) (*sqs.ReceiveMessageOutput, error) {
	result, err := svc.ReceiveMessage(&sqs.ReceiveMessageInput{
		QueueUrl:            &queueURL,
		MaxNumberOfMessages: aws.Int64(1),
		WaitTimeSeconds:     aws.Int64(10),
	})

	if err != nil {
		return nil, err
	}

	return result, nil
}

func cleanQueue(svc *sqs.SQS, queueURL string) error {
	_, err := svc.PurgeQueue(&sqs.PurgeQueueInput{
		QueueUrl: aws.String(queueURL),
	})

	if err != nil {
		return err
	}

	return nil
}

func getQueueURl(stack integration.RuntimeValidationStackInfo) string {
	return fmt.Sprintf("%v", stack.Outputs["queueURL"])
}

var c *sqs.SQS
var qUrl string

func testQueueBehaviour(t *testing.T, stack integration.RuntimeValidationStackInfo) {
	RegisterFailHandler(Fail)
	qUrl = getQueueURl(stack)
	RunSpecs(t, "Queue Suite")
}

const msg = "This is a message"

var _ = BeforeSuite(func() {
	c = createSQSClient()
})

var _ = Describe("Queue", func() {

	BeforeEach(func() {
		cleanQueue(c, qUrl)
	})

	Describe("Basic functionality", func() {
		Context("Sending messages", func() {
			It("A message should be sent", func() {
				rs, err := sendSQSMessage(c, msg, qUrl)
				Expect(err).NotTo(HaveOccurred())
				rc, err := receiveSQSMessage(c, qUrl)
				Expect(err).NotTo(HaveOccurred())
				Expect(len(rc.Messages)).To(Equal(1))
				Expect(*rc.Messages[0].Body).To(Equal(msg))
				Expect(*rc.Messages[0].MessageId).To(Equal(*rs.MessageId))
			})
		})
	})
})

package aws

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
)

func CreateSQSClient() *sqs.SQS {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	svc := sqs.New(sess)
	return svc
}

func SendSQSMessage(svc *sqs.SQS, messageBody string, queueURL string) (*sqs.SendMessageOutput, error) {
	result, err := svc.SendMessage(&sqs.SendMessageInput{
		MessageBody: aws.String(messageBody),
		QueueUrl:    &queueURL,
	})

	if err != nil {
		return nil, err
	}

	return result, nil

}

func ReceiveSQSMessage(svc *sqs.SQS, queueURL string) (*sqs.ReceiveMessageOutput, error) {
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

func CleanQueue(svc *sqs.SQS, queueURL string) error {
	_, err := svc.PurgeQueue(&sqs.PurgeQueueInput{
		QueueUrl: aws.String(queueURL),
	})

	if err != nil {
		return err
	}

	return nil
}

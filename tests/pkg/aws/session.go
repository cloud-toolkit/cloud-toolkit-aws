package aws

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
)

func GetSession() *session.Session {
	awsConfig := &aws.Config{
		Region: aws.String("eu-west-1"),
	}
	return session.Must(session.NewSession(awsConfig))
}

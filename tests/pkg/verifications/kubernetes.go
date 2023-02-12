package verifications

import (
	"context"
	"time"

	. "github.com/onsi/gomega"
	appsv1 "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func VerifyKubernetesDeployment(clientset *kubernetes.Clientset, namespace, name string, replicas int) {
	var deployment *appsv1.Deployment
	var err error
	for i := 0; i <= 60; i++ {
		deployment, err = clientset.AppsV1().Deployments(namespace).Get(context.TODO(), name, metav1.GetOptions{})
		if err == nil && deployment.Status.ReadyReplicas == int32(replicas) {
			break
		}
		time.Sleep(time.Second * 10)
	}
	Expect(err).To(BeNil())
	Expect(deployment.Status.ReadyReplicas).To(Equal(int32(replicas)))
	Expect(deployment.Status.ReadyReplicas).To(Equal(deployment.Status.Replicas))
}

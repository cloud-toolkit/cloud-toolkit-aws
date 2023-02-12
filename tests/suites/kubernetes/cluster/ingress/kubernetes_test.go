package kubernetes

import (
	"context"
	"testing"

	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/stack"
	"github.com/cloud-toolkit/cloud-toolkit-aws/tests/pkg/verifications"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"k8s.io/apimachinery/pkg/api/meta"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/restmapper"
	"k8s.io/client-go/tools/clientcmd"
)

var s stack.Stack

func Test(t *testing.T) {
	RegisterFailHandler(Fail)

	s = stack.NewStack(t)
	RunSpecs(t, "Kubernetes - Cluster - Ingress enabled")
}

var clientset *kubernetes.Clientset
var discoveryClient *discovery.DiscoveryClient
var discoveryMapper meta.RESTMapper

var _ = Describe("Using default configuration,", func() {

	Describe("the stack", s.Setup())

	Describe("from the stack", func() {
		It("should be created the client", func() {
			kubeconfig := s.GetOutput("kubeconfig")
			clientConfig, err := clientcmd.NewClientConfigFromBytes([]byte(kubeconfig))
			Expect(err).To(BeNil())

			config, err := clientConfig.ClientConfig()
			Expect(err).To(BeNil())

			// create the clientset
			c, err := kubernetes.NewForConfig(config)
			Expect(err).To(BeNil())
			clientset = c

			// create the discovery client
			discoveryC := discovery.NewDiscoveryClientForConfigOrDie(config)
			discoveryClient = discoveryC
			groupResources, err := restmapper.GetAPIGroupResources(discoveryClient)
			Expect(err).To(BeNil())
			discoveryMapper = restmapper.NewDiscoveryRESTMapper(groupResources)
		})
	})

	Describe("the client", func() {
		DescribeTable("inspecting the ArgoCD CRDs", func(groupKind, version string) {
			mapping, err := discoveryMapper.RESTMapping(schema.ParseGroupKind(groupKind))
			Expect(err).To(BeNil())
			Expect(mapping.GroupVersionKind.Version).To(Equal(version))
		},
			Entry("should find application.argoproj.io/v1alpha1", "application.argoproj.io", "v1alpha1"),
			Entry("should find applicationset.argoproj.io/v1alpha1", "applicationset.argoproj.io", "v1alpha1"),
			Entry("should find appproject.argoproj.io/v1alpha1", "appproject.argoproj.io", "v1alpha1"),
			Entry("should find argocdextension.argoproj.io/v1alpha1", "argocdextension.argoproj.io", "v1alpha1"),
		)

		DescribeTable("inspecting the CertMananger CRDs", func(groupKind, version string) {
			mapping, err := discoveryMapper.RESTMapping(schema.ParseGroupKind(groupKind))
			Expect(err).To(BeNil())
			Expect(mapping.GroupVersionKind.Version).To(Equal(version))
		},
			Entry("should find challenge.acme.cert-manager.io/v1", "challenge.acme.cert-manager.io", "v1"),
			Entry("should find order.acme.cert-manager.io/v1", "order.acme.cert-manager.io", "v1"),
			Entry("should find certificaterequest.cert-manager.io/v1", "certificaterequest.cert-manager.io", "v1"),
			Entry("should find certificate.cert-manager.io/v1", "certificate.cert-manager.io", "v1"),
			Entry("should find clusterissuer.cert-manager.io/v1", "clusterissuer.cert-manager.io", "v1"),
			Entry("should find issuer.cert-manager.io/v1", "issuer.cert-manager.io", "v1"),
		)
	})

	Describe("the kube-system namespace", func() {
		DescribeTable("in the Deployments list", func(namespace, name string, replicas int) {
			deployment, err := clientset.AppsV1().Deployments(namespace).Get(context.TODO(), name, metav1.GetOptions{})
			Expect(err).To(BeNil())
			Expect(deployment.Status.ReadyReplicas).To(Equal(int32(replicas)))
			Expect(deployment.Status.ReadyReplicas).To(Equal(deployment.Status.Replicas))
		},
			Entry("should have coredns", "kube-system", "coredns", 2),
		)

		DescribeTable("in the DaemonSet list", func(namespace, name string, replicas int) {
			daemonset, err := clientset.AppsV1().DaemonSets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
			Expect(err).To(BeNil())
			Expect(daemonset.Status.CurrentNumberScheduled).To(Equal(int32(replicas)))
			Expect(daemonset.Status.CurrentNumberScheduled).To(Equal(daemonset.Status.DesiredNumberScheduled))
		},
			Entry("should have aws-node", "kube-system", "aws-node", 2),
			Entry("should have kube-proxy", "kube-system", "kube-proxy", 2),
		)
	})

	Describe("the argocd installation", func() {
		DescribeTable("in the Deployments list", func(namespace, label string, replicas int) {
			list, err := clientset.AppsV1().Deployments(namespace).List(context.TODO(), metav1.ListOptions{LabelSelector: label})
			Expect(err).To(BeNil())
			Expect(len(list.Items)).To(Equal(1))

			deployment := list.Items[0]
			Expect(deployment.Status.ReadyReplicas).To(Equal(int32(replicas)))
			Expect(deployment.Status.ReadyReplicas).To(Equal(deployment.Status.Replicas))
		},
			Entry("should have argocd-server", "system-argocd", "app.kubernetes.io/name=argocd-server", 1),
			Entry("should have argocd-repo-server", "system-argocd", "app.kubernetes.io/name=argocd-repo-server", 1),
			Entry("should have argocd-dex-server", "system-argocd", "app.kubernetes.io/name=argocd-dex-server", 1),
			Entry("should have argocd-applicationset-controller", "system-argocd", "app.kubernetes.io/name=argocd-applicationset-controller", 1),
			Entry("should have argocd-notifications-controller", "system-argocd", "app.kubernetes.io/name=argocd-notifications-controller", 1),
			Entry("should have argocd-redis", "system-argocd", "app.kubernetes.io/name=argocd-redis", 1),
		)
	})

	Describe("the cert-manager installation", func() {
		DescribeTable("in the Deployments list", func(namespace, name string, replicas int) {
			verifications.VerifyKubernetesDeployment(clientset, namespace, name, replicas)
		},
			Entry("should have cert-manager", "system-cert-manager", "cert-manager", 1),
			Entry("should have cert-manager-cainjector", "system-cert-manager", "cert-manager-cainjector", 1),
			Entry("should have cert-manager-webhook", "system-cert-manager", "cert-manager-webhook", 1),
		)
	})

	Describe("the dashboard installation", func() {
		DescribeTable("in the Deployments list", func(namespace, name string, replicas int) {
			verifications.VerifyKubernetesDeployment(clientset, namespace, name, replicas)
		},
			Entry("should have dashboard-kubernetes-dashboard", "system-dashboard", "dashboard-kubernetes-dashboard", 1),
		)
	})

	Describe("the ExternalDNS installation", func() {
		DescribeTable("in the Deployments list", func(namespace, name string, replicas int) {
			verifications.VerifyKubernetesDeployment(clientset, namespace, name, replicas)
		},
			Entry("should have external-dns", "system-external-dns", "external-dns", 1),
		)
	})

	Describe("the IngressNginx admin installation", FlakeAttempts(10), func() {
		DescribeTable("in the Deployments list", func(namespace, name string, replicas int) {
			verifications.VerifyKubernetesDeployment(clientset, namespace, name, replicas)
		},
			Entry("should have ingress-admin-ingress-nginx-controller", "system-ingress-admin", "ingress-admin-ingress-nginx-controller", 2),
		)
	})

	Describe("the IngressNginx default installation", FlakeAttempts(10), func() {
		DescribeTable("in the Deployments list", func(namespace, name string, replicas int) {
			verifications.VerifyKubernetesDeployment(clientset, namespace, name, replicas)
		},
			Entry("should have ingress-default-ingress-nginx-controller", "system-ingress-default", "ingress-default-ingress-nginx-controller", 2),
		)
	})

	Describe("the stack", FlakeAttempts(3), s.Destroy())
})

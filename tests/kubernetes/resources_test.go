package resources

import (
	"os"
	"os/exec"
	"path"
	"testing"

	"github.com/pulumi/pulumi/pkg/v2/testing/integration"
)

func TestKubernetesResources(t *testing.T) {
	cwd, _ := os.Getwd()
	opts := &integration.ProgramTestOptions{
		Quick:                  true,
		SkipRefresh:            true,
		Dir:                    path.Join(cwd, "resources"),
		Config:                 map[string]string{},
		Dependencies:           []string{"@cloud-toolkit/cloud-toolkit-aws"},
		ExtraRuntimeValidation: CallbackKubernetesResources,
	}
	integration.ProgramTest(t, opts)
}

func TestSomething(t *testing.T) {
	app := "echo"

	arg0 := "-e"
	arg1 := "Hello world"
	arg2 := "\n\tfrom"
	arg3 := "golang"

	cmd := exec.Command(app, arg0, arg1, arg2, arg3)
	stdout, _ := cmd.Output()

	t.Log(string(stdout))
}

func CallbackKubernetesResources(t *testing.T, stack integration.RuntimeValidationStackInfo) {

	TestSomething(t)
	// var kubeconfig *string
	//
	// if home := homedir.HomeDir(); home != "" {
	// 	kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	// } else {
	// 	kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	// }
	//
	// t.Log(kubeconfig)
}

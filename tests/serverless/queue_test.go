package serverless

import (
	"os"
	"path"
	"testing"

	"github.com/pulumi/pulumi/pkg/v2/testing/integration"
)

func TestQueue(t *testing.T) {
	cwd, _ := os.Getwd()
	opts := &integration.ProgramTestOptions{
		Quick:        true,
		SkipRefresh:  true,
		Dir:          path.Join(cwd, "queue"),
		Config:       map[string]string{},
		Dependencies: []string{"@cloudtoolkit/aws"},
		ExtraRuntimeValidation: func(t *testing.T, stack integration.RuntimeValidationStackInfo) {
			testQueueBehaviour(t, stack)
		},
	}
	integration.ProgramTest(t, opts)
}

func TestQueueType(t *testing.T) {
	cwd, _ := os.Getwd()
	opts := &integration.ProgramTestOptions{
		Quick:       true,
		SkipRefresh: true,
		Dir:         path.Join(cwd, "queue"),
		Config: map[string]string{
			"retention": "60",
		},
		Dependencies: []string{"@cloudtoolkit/aws"},
	}
	integration.ProgramTest(t, opts)
}

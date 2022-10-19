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
		Dependencies: []string{"@cloud-toolkit/cloud-toolkit-aws"},
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
		Dependencies: []string{"@cloud-toolkit/cloud-toolkit-aws"},
	}
	integration.ProgramTest(t, opts)
}

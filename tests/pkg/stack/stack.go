package stack

import (
	"os"
	"path"
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/pulumi/pulumi/pkg/v3/testing/integration"
)

func SetupStack(program *integration.ProgramTester) func() {
	return func() {
		It("should be prepared", func() {
			err := program.TestLifeCyclePrepare()
			Expect(err).To(BeNil())
		})
		It("should be initalized", func() {
			err := program.TestLifeCycleInitialize()
			Expect(err).To(BeNil())
		})
		It("should be previewed, updated and edit", func() {
			err := program.TestPreviewUpdateAndEdits()
			Expect(err).To(BeNil())
		})
	}
}

func GetStackOutputMap(program *integration.ProgramTester) map[string]interface{} {
	Expect(program).To(Not(BeNil()))
	Expect(program.StackInfo).To(Not(BeNil()))
	Expect(program.StackInfo.Outputs).To(Not(BeNil()))
	return program.StackInfo.Outputs
}

func GetStackOutput(program *integration.ProgramTester, name string) string {
	outputMap := GetStackOutputMap(program)
	return outputMap[name].(string)
}

func GetProgramOpts() integration.ProgramTestOptions {
	cwd, _ := os.Getwd()
	return integration.ProgramTestOptions{
		NoParallel:             true,
		Quick:                  true,
		SkipRefresh:            true,
		SkipPreview:            true,
		Dir:                    path.Join(cwd, "stack"),
		ExtraRuntimeValidation: func(t *testing.T, stack integration.RuntimeValidationStackInfo) {},
	}
}

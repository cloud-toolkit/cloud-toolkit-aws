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

func GetStackOutput(stackInfo *integration.RuntimeValidationStackInfo, name string) string {
	outputMap := stackInfo.Outputs
	Expect(outputMap).To(Not(BeNil()))

	output, ok := outputMap[name].(string)
	Expect(ok).To(BeTrue())

	return output
}

func NewProgramOpts(stackInfo *integration.RuntimeValidationStackInfo) integration.ProgramTestOptions {
	cwd, _ := os.Getwd()
	return integration.ProgramTestOptions{
		NoParallel:  true,
		Quick:       true,
		SkipRefresh: true,
		SkipPreview: true,
		Dir:         path.Join(cwd, "stack"),
		ExtraRuntimeValidation: func(t *testing.T, stack integration.RuntimeValidationStackInfo) {
			stackInfo.Deployment = stack.Deployment
			stackInfo.Events = stack.Events
			stackInfo.Outputs = stack.Outputs
			stackInfo.RootResource = stack.RootResource
			stackInfo.StackName = stack.StackName
		},
	}
}

package stack

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"strings"
	"testing"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"github.com/pulumi/pulumi/pkg/v3/testing/integration"
	"github.com/pulumi/pulumi/sdk/v3/go/common/apitype"
	"github.com/pulumi/pulumi/sdk/v3/go/common/resource"
	"github.com/pulumi/pulumi/sdk/v3/go/common/util/contract"
)

var stackDir string

func init() {
	flag.StringVar(&stackDir, "stackDir", "", "Existing stack dir to use")
	rand.Seed(time.Now().UnixNano())
}

type Stack interface {
	Setup() func()
	Destroy() func()
	GetSecret(name string) string
	GetOutput(name string) string
	GetResourceByName(componentType, name string) *apitype.ResourceV3
	GetStackName() string
}

func NewStack(t *testing.T) Stack {
	s := &stack{
		StackDir: stackDir,
	}

	s.Initialize(t)
	return s
}

type stack struct {
	Program   *integration.ProgramTester
	StackDir  string
	StackInfo *integration.RuntimeValidationStackInfo
}

func (s *stack) GetStackName() string {
	return s.StackInfo.StackName.String()
}

func (s *stack) Initialize(t *testing.T) {
	s.StackInfo = &integration.RuntimeValidationStackInfo{}
	opts := s.NewProgramOpts()
	s.Program = integration.ProgramTestManualLifeCycle(t, &opts)
}

func (s *stack) NewProgramOpts() integration.ProgramTestOptions {
	cwd, _ := os.Getwd()
	dependencies := []string{}
	if os.Getenv("CT_DEV") == "true" {
		dependencies = append(dependencies, "@cloudtoolkit/aws")
	}
	stackName := fmt.Sprintf("ct-%v", RandomString(10))
	return integration.ProgramTestOptions{
		NoParallel:  true,
		Quick:       true,
		SkipRefresh: true,
		SkipPreview: true,
		Dir:         path.Join(cwd, "stack"),
		Dependencies: []string{
			"@cloudtoolkit/aws",
		},
		DecryptSecretsInOutput: true,
		ExtraRuntimeValidation: func(t *testing.T, stack integration.RuntimeValidationStackInfo) {
			s.StackInfo.Deployment = stack.Deployment
			s.StackInfo.Events = stack.Events
			s.StackInfo.Outputs = stack.Outputs
			s.StackInfo.RootResource = stack.RootResource
			s.StackInfo.StackName = stack.StackName
		},
		StackName:        stackName,
		SkipStackRemoval: false,
		Verbose:          true,
	}
}

func (s *stack) Setup() func() {
	return func() {

		It("should be loaded", func() {
			if s.StackDir == "" {
				Skip("Using existing stack")
			} else {
				stack, err := GetStackInfo(s.StackDir)
				Expect(err).To(BeNil())
				s.StackInfo.Deployment = stack.Deployment
				s.StackInfo.Events = stack.Events
				s.StackInfo.Outputs = stack.Outputs
				s.StackInfo.RootResource = stack.RootResource
				s.StackInfo.StackName = stack.StackName
			}
		})

		It("should be prepared", func() {
			if s.StackDir != "" {
				Skip("Using existing stack")
			}
			err := s.Program.TestLifeCyclePrepare()
			Expect(err).To(BeNil())
		})

		It("should be initalized", func() {
			if s.StackDir != "" {
				Skip("Using existing stack")
			}
			err := s.Program.TestLifeCycleInitialize()
			Expect(err).To(BeNil())
		})

		It("should be previewed, updated and edit", func() {
			if s.StackDir != "" {
				Skip("Using existing stack")
			}
			err := s.Program.TestPreviewUpdateAndEdits()
			Expect(err).To(BeNil())
		})
	}

}

func (s *stack) Destroy() func() {
	return func() {
		It("should be destroyed", func() {
			if s.StackDir != "" {
				Skip("Using existing stack")
			}
			err := s.Program.TestLifeCycleDestroy()
			Expect(err).To(BeNil())
		})
	}
}

func (s *stack) GetSecret(name string) string {
	outputMap := s.StackInfo.Outputs
	Expect(outputMap).To(Not(BeNil()))

	secret, ok := outputMap[name].(map[string]interface{})
	if !ok {
		Fail(fmt.Sprintf("output '%v' not found", name))
	}
	Expect(ok).To(BeTrue())

	output, ok := secret["plaintext"].(string)
	if !ok {
		Fail(fmt.Sprintf("can't get plaintext value for secret %v'", name))
	}

	return string(output[1 : len(output)-1])
}

func (s *stack) GetOutput(name string) string {
	outputMap := s.StackInfo.Outputs
	Expect(outputMap).To(Not(BeNil()))

	output, ok := outputMap[name].(string)
	if !ok {
		Fail(fmt.Sprintf("Can't find output '%v'", name))
	}

	return output
}

func (s *stack) GetResourceByName(componentType, name string) *apitype.ResourceV3 {
	suffix := fmt.Sprintf(":%v::%v", componentType, name)
	for _, resource := range s.StackInfo.Deployment.Resources {
		if strings.HasSuffix(string(resource.URN), suffix) {
			return &resource
		}
	}

	Fail(fmt.Sprintf("Resource not found with URN endings with '%v'", suffix))
	return nil
}

const charset = "abcdefghijklmnopqrstuvwxyz0123456789"

func StringWithCharset(length int, charset string) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

func RandomString(length int) string {
	return StringWithCharset(length, charset)
}

const maxRetries = 3

func RunCommand(dir string, args []string) error {
	cmd := exec.Command("/opt/homebrew/bin/pulumi")
	cmd.Dir = dir
	cmd.Args = args

	var runerr error
	_, runerr = cmd.CombinedOutput()

	return runerr
}

func GetStackInfo(dir string) (*integration.RuntimeValidationStackInfo, error) {
	// Create a temporary file name for the stack export
	tempDir, err := ioutil.TempDir("", dir)
	if err != nil {
		return nil, err
	}
	fileName := filepath.Join(tempDir, "stack.json")

	// Invoke `pulumi stack export`
	// There are situations where we want to get access to the secrets in the validation
	// this will allow us to get access to them as part of running ExtraRuntimeValidation
	pulumiCommand := []string{"pulumi", "stack", "export", "--show-secrets", "--file", fileName}
	if err := RunCommand(dir, pulumiCommand); err != nil {
		return nil, fmt.Errorf("expected to export stack to file: %s: %w", fileName, err)
	}

	// Open the exported JSON file
	f, err := os.Open(fileName)
	if err != nil {
		return nil, fmt.Errorf("expected to be able to open file with stack exports: %s: %w", fileName, err)
	}
	defer func() {
		contract.IgnoreClose(f)
		contract.IgnoreError(os.RemoveAll(tempDir))
	}()

	// Unmarshal the Deployment
	var untypedDeployment apitype.UntypedDeployment
	if err = json.NewDecoder(f).Decode(&untypedDeployment); err != nil {
		return nil, err
	}
	var deployment apitype.DeploymentV3
	if err = json.Unmarshal(untypedDeployment.Deployment, &deployment); err != nil {
		return nil, err
	}

	// Get the root resource and outputs from the deployment
	var rootResource apitype.ResourceV3
	var outputs map[string]interface{}
	for _, res := range deployment.Resources {
		if res.Type == resource.RootStackType {
			rootResource = res
			outputs = res.Outputs
		}
	}

	// Populate stack info object with all of this data to pass to the validation function
	stackInfo := &integration.RuntimeValidationStackInfo{
		//StackName:    tokens.IntoQName(stackName),
		Deployment:   &deployment,
		RootResource: rootResource,
		Outputs:      outputs,
	}

	return stackInfo, nil
}

VERSION         := $(shell pulumictl get version)

PACK            := cloud-toolkit-aws
PROJECT         := github.com/cloud-toolkit/pulumi-${PACK}

PROVIDER        := pulumi-resource-${PACK}
CODEGEN         := pulumi-gen-${PACK}

WORKING_DIR     := $(shell pwd)
SCHEMA_PATH     := ${WORKING_DIR}/schema.yaml

generate:: gen_nodejs_sdk

build:: build_provider build_nodejs_sdk

install:: install_provider

build_provider::
	cd provider/cmd/${PROVIDER}/ && \
		npm ci && \
		npx tsc && \
		cp package.json ../../../schema.yaml ./bin && \
		sed -i .back -e "s/\$${VERSION}/$(VERSION)/g" bin/package.json

install_provider:: PKG_ARGS := --no-bytecode --public-packages "*" --public
install_provider:: build_provider
	rm -rf bin && \
	    cd provider/cmd/${PROVIDER}/ && \
        yarn run pkg . ${PKG_ARGS} --target node16 --output ../../../bin/${PROVIDER}

gen_nodejs_sdk::
	rm -rf sdk/nodejs
	cd provider/cmd/${CODEGEN} && go run . nodejs ../../../sdk/nodejs ${SCHEMA_PATH}

build_nodejs_sdk:: VERSION := $(shell pulumictl get version --language javascript)
build_nodejs_sdk:: gen_nodejs_sdk
	cd sdk/nodejs/ && \
		echo "module fake_nodejs_module // Exclude this directory from Go tools\n\ngo 1.17" > go.mod && \
		npm install && \
		npm run build && \
		cp -R scripts bin/ && \
		cp ../../README.md ../../LICENSE package.json package-lock.json ./bin/ && \
		sed -i.bak -e "s/\$${VERSION}/$(VERSION)/g" ./bin/package.json && \
		rm ./bin/package.json.bak

VERSION         := $(shell pulumictl get version)

PACK            := cloud-toolkit-aws
PROJECT         := github.com/cloud-toolkit/pulumi-${PACK}

PROVIDER        := pulumi-resource-${PACK}

WORKING_DIR     := $(shell pwd)
SCHEMA_PATH     := ${WORKING_DIR}/schema.yaml

build:: build_provider

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

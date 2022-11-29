FROM alpine:3.17.0

ADD requirements.txt /tmp/

RUN apk update && apk add --no-cache bash

# Python and Robot requirements
RUN apk add --no-cache python3-dev && \
    apk add --no-cache py3-pip && \
    pip3 install --upgrade --force-reinstall pip==20.1.1 && \
    pip3 install  -r /tmp/requirements.txt --ignore-installed

# Node and NPM

RUN apk add --no-cache nodejs npm

# Pulumi install

# Passing --build-arg PULUMI_VERSION=vX.Y.Z will use that version
# of the SDK. Otherwise, we use whatever get.pulumi.com thinks is
# the latest
# Based on: https://github.com/pulumi/pulumi/issues/1986#issuecomment-544866074
ARG PULUMI_VERSION=3.46.1

ENV PATH=$PATH:/root/.pulumi/bin

RUN apk update && \
    apk add --no-cache curl libc6-compat && \
    if [ "$PULUMI_VERSION" = "latest" ]; then \
      curl -fsSL https://get.pulumi.com/ | sh; \
    else \
      curl -fsSL https://get.pulumi.com/ | sh -s -- --version $(echo $PULUMI_VERSION | cut -c 2-); \
    fi

ADD run-acceptance-tests.sh /opt

ENTRYPOINT ["/opt/run-acceptance-tests.sh"]
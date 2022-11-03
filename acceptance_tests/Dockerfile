FROM alpine:3.12.0

ADD requirements.txt /tmp/

RUN apk update && apk add --no-cache bash

RUN apk add --no-cache python3-dev && \
    apk add --no-cache py3-pip && \
    pip3 install --upgrade --force-reinstall pip==20.1.1 && \
    pip3 install  -r /tmp/requirements.txt --ignore-installed

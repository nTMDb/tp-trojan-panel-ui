FROM alpine:3.15
LABEL maintainer="jonsosnyan <https://jonssonyan.com>"
RUN mkdir -p /tpdata/trojan-panel-ui/app/
WORKDIR /tpdata/trojan-panel-ui/app/
COPY dist/ .
RUN apk add bash ca-certificates && \
    rm -rf /var/cache/apk/*
ENTRYPOINT nginx -g daemon off;
EXPOSE 80
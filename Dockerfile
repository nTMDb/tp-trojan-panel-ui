FROM nginx:stable-alpine
LABEL maintainer="jonsosnyan <https://jonssonyan.com>"
RUN mkdir -p /tpdata/trojan-panel-ui/app/
WORKDIR /tpdata/trojan-panel-ui/app/
COPY dist/ .
ENTRYPOINT nginx -g daemon off;
EXPOSE 80
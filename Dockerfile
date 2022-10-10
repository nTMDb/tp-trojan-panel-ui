FROM nginx:1.20-alpine
LABEL maintainer="jonsosnyan <https://jonssonyan.com>"
RUN mkdir -p /tpdata/trojan-panel-ui/
WORKDIR /tpdata/trojan-panel-ui/
COPY dist/ .
ENTRYPOINT nginx -g 'daemon off;'
EXPOSE 8888
FROM nginx:latest

WORKDIR /tpdata/trojan-panel-ui

COPY . /usr/share/nginx/html/

EXPOSE 80
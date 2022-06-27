#!/usr/bin/env bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

init_var() {
  ECHO_TYPE="echo -e"

  trojan_panel_ui_version=latest

  arch_arr=('amd64' 'arm64')

  touch Dockerfile
}

echo_content() {
  case $1 in
  "red")
    ${ECHO_TYPE} "\033[31m$2\033[0m"
    ;;
  "green")
    ${ECHO_TYPE} "\033[32m$2\033[0m"
    ;;
  "yellow")
    ${ECHO_TYPE} "\033[33m$2\033[0m"
    ;;
  "blue")
    ${ECHO_TYPE} "\033[34m$2\033[0m"
    ;;
  "purple")
    ${ECHO_TYPE} "\033[35m$2\033[0m"
    ;;
  "skyBlue")
    ${ECHO_TYPE} "\033[36m$2\033[0m"
    ;;
  "white")
    ${ECHO_TYPE} "\033[37m$2\033[0m"
    ;;
  esac
}

main() {
  for get_arch in ${arch_arr[*]}; do
    echo_content skyBlue "开始构建trojan-panel-ui-linux-${get_arch}"

    cat >Dockerfile <<EOF
FROM nginx:1.20-alpine
LABEL maintainer="jonsosnyan <https://jonssonyan.com>"
RUN mkdir -p /tpdata/trojan-panel-ui/
WORKDIR /tpdata/trojan-panel-ui/
COPY dist/ .
ENTRYPOINT nginx -g 'daemon off;'
EXPOSE 80
EOF

    docker buildx build -t jonssonyan/trojan-panel-ui-linux-"${get_arch}" --platform linux/"${get_arch}" --load .
    if [[ "$?" == "0" ]]; then
      echo_content green "trojan-panel-ui-linux-${get_arch}构建成功"
      echo_content skyBlue "开始推送trojan-panel-ui-linux-${get_arch}"
      docker image tag jonssonyan/trojan-panel-ui-linux-"${get_arch}":latest jonssonyan/trojan-panel-ui:latest && \
      docker image push jonssonyan/trojan-panel-ui:latest && \
      docker rmi -f jonssonyan/trojan-panel-ui:latest
      if [[ "$?" == "0" ]]; then
        echo_content green "镜像名称：jonssonyan/trojan-panel-ui:latest 架构：${get_arch}推送成功"
      else
        echo_content red "镜像名称：jonssonyan/trojan-panel-ui:latest 架构：${get_arch}推送失败"
      fi

      if [[ ${trojan_panel_ui_version} != "latest" ]]; then
        docker image tag jonssonyan/trojan-panel-ui-linux-"${get_arch}":latest jonssonyan/trojan-panel-ui:${trojan_panel_ui_version} && \
        docker image push jonssonyan/trojan-panel-ui:${trojan_panel_ui_version} && \
        docker rmi -f jonssonyan/trojan-panel-ui:${trojan_panel_ui_version}
        if [[ "$?" == "0" ]]; then
          echo_content green "镜像名称：jonssonyan/trojan-panel-ui:${trojan_panel_ui_version} 架构：${get_arch}推送成功"
        else
          echo_content green "镜像名称：jonssonyan/trojan-panel-ui:${trojan_panel_ui_version} 架构：${get_arch}推送成功"
        fi
      fi
    else
      echo_content red "trojan-panel-ui-linux-${get_arch}构建失败"
    fi
  done
}

init_var
main

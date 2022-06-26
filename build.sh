#!/usr/bin/env bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

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

init_var() {
  arch_arr=('amd64' 'arm64')

  touch Dockerfile
}

main() {
  for get_arch in ${arch_arr[*]}; do
    echo_content blue "开始构建Trojan Panel UI ${get_arch}"

    cat >Dockerfile <<EOF
FROM nginx:1.20-alpine
LABEL maintainer="jonsosnyan <https://jonssonyan.com>"
RUN mkdir -p /tpdata/trojan-panel-ui/
WORKDIR /tpdata/trojan-panel-ui/
COPY dist/ .
ENTRYPOINT nginx -g 'daemon off;'
EXPOSE 80
EOF

    docker buildx build --platform linux/"${get_arch}" -t jonssonyan/trojan-panel-ui-"${get_arch}" .
    if [[ "$?" == "0" ]]; then
      echo_content green "Trojan Panel UI ${get_arch}构建成功"
    else
      echo_content red "Trojan Panel UI ${get_arch}构建失败"
    fi
  done
}

init_var
main
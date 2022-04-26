# build stage
FROM node:lts-alpine as build-stage
WORKDIR /tpdata/trojan-panel-ui
COPY . .
RUN npm i -g yarn --registry=https://registry.npm.taobao.org
RUN yarn --registry=https://registry.npm.taobao.org && yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /tpdata/trojan-panel-ui/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
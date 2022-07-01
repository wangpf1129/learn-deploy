# 单页应用的静态资源

单页应用对于部署，分为两个阶段：构建 + 部署

因为我们的单应用使用了外部依赖，需要先打包成纯静态文件，才能进行部署。

所以需要在 node 环境下进行构建，选择 node 基础镜像。

而打包完成后我们不在需要 node 环境，所以我们可以选择更轻量的 nginx 镜像进行部署。

## 第一阶段：构建

```bash
# 选择node基础镜像
FROM node:14-alpine as builder
# 设置工作目录
WORKDIR /code

# 分离package.json，是未来安装依赖可最大限度利用缓存
ADD package.json yarn.lock /code/
# 此时yarn可以利用缓存，如果yarn.lock没有更新，则不会重新依赖安装
RUN yarn

# 将当前目录下的所有文件都拷贝到/code目录下，进行项目构建
ADD . /code
RUN yarn build
```

## 第二阶段：部署

```bash
# 选择nginx镜像
FROM nginx:alpine
# /usr/share/nginx/html是nginx的默认静态文件目录
# 将builder中构建好的dist目录中的内容拷贝到/usr/share/nginx/html目录下即可
COPY --from=builder code/dist /usr/share/nginx/html
```

```bash
# docker-compose配置文件
version: "3"
services:
  single-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - 4000:80
```

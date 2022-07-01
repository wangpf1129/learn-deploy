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


FROM nginx:alpine
# /usr/share/nginx/html是nginx的默认静态文件目录
# 将builder中构建好的dist目录中的内容拷贝到/usr/share/nginx/html目录下即可
COPY --from=builder /code/dist /usr/share/nginx/html
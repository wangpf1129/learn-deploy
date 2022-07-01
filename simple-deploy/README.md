# 简单服务器部署

### 本地部署

- 使用serve包，可以在本地运行服务器
```bash
// 安装serve
pnpm i serve
// 在当前目录下运行服务器
npx serve .
```
- 编写server.js，使用http来创建服务器，在终端使用node运行

```js
const http = require('node:http')
const fs = require('node:fs')
const fsp = require('node:fs/promises')

// 如果文件比较大就很慢，可以使用流方式
// const html = fs.readFileSync('index.html');

const server = http.createServer(async (req, res) => {
  // 使用流的方式读取文件并返回
  // 需要手动处理一下Content-Length
  const stat = await fsp.stat('./index.html')
  res.setHeader('content-length', stat.size)
  fs.createReadStream('./index.html').pipe(res)
})
server.listen(3000, () => {
  console.log('listening 3000 ...')
})

```

```bash
node ./server.js
```

### 使用Docker部署

> 为什么使用Docker
> 隔离环境，可单独提供某种语言的运行环境，并同时与宿主机隔离起来。
> 对于前端而言，此时你可以通过由自己在项目中单独维护 nginx.conf 进行一些 nginx 的配置，大大提升前端的自由性和灵活度，而无需通过运维或者后端来进行。

> 先安装docker

#### 方式一: 使用docker

```bash
# 构建镜像
# -t xxx 指定镜像名称
# . 表示从当前目录下构建镜像
# -f xxx 指定镜像配置文件
# --progress plain 查看输出结果
docker build -t simple-app . -f node.Dockerfile
# 启动容器
# --rm 容器停止运行时自动删除
# -p xxx:xxx 指定端口映射，前者为宿主端口，后者为容器端口
docker run --rm -p 3000:3000 simple-app

# 查看全部docker镜像
docker images
```

> 我们的基础镜像 tag 总是携带 `alpine`，它是什么？
> alpine 操作系统是一个面向安全的轻型 Linux 发行。相比于其他镜像体积更小，运行时占用的资源更小。

> 构建镜像 RUN 输出查看
> 在使用 docker build 进行构建时，通过 RUN 指令可以通过打印一些关键信息进行调试，
> 但是，在我们进行 docker build 时，无法查看其输出结果。
> 此时可以通过 --progress plain 来查看其输出结果。

#### 方式二：使用docker-compose

编写docker-compose.yaml

```bash
# --build: 每次启动容器前构建镜像
docker-compose up --build
```

### 使用nginx部署

> 为什么使用Nginx
> 通过 nginx 进行路由转发至不同的服务，这也就是反向代理，另外 TLS、GZIP、HTTP2 等诸多功能，也需要使用 nginx 进行配置。

#### 基于nginx镜像构建容器

先了解一下nginx配置文件

```
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

可以看到监听`80`端口，为 `/usr/share/nginx/html` 目录做静态资源服务。

那么我们可以把我们的静态文件写入到 `/usr/share/nginx/html` 目录下，就能正确部署了。

编写`nginx.Dockerfile`

```
FROM nginx:alpine

ADD index.html /usr/share/nginx/html/
```

修改`docker-compose.yaml`，使用`docker-compose up --build`构建并启动镜像。

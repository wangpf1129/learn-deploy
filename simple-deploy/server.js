// 继续完善静态服务器，使其作为一个命令行工具，
// 支持指定端口号、读取目录、404、stream，甚至 trailingSlash、cleanUrls、rewrite、redirect 等。
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

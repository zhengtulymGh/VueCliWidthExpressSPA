# 安装sass（编译机器上安装一次即可）
参考如下文章
http://sass-lang.com/install

http://www.w3cplus.com/sassguide/install.html

http://blog.csdn.net/jimmyhandy/article/details/50723174

# 安装cnpm（编译机器上安装一次即可）
是npm的中国版本，安装node-sass这个包需要，在编译机器上全局安装一次即可

npm install -g cnpm --registry=https://registry.npm.taobao.org

# 配置文件
在client的同级目录下新增conf/config.ini
```javascript
; 注释请单行写，负责会解析错误
; nodejs服务监听端口
port=9016

; 后台api服务地址
server=http://192.168.1.155:9000

; redis配置
[redis]
address=127.0.0.1
port=6379
pass=123456
```

# 编译前端代码
进入client目录

1.用cnpm单独下载node-sass

cnpm install --save-dev node-sass@4.5.2

2.下载其他npm包

npm i --registry=https://registry.npm.taobao.org

3.编译前端代码到server目录

``npm run build``

# 启动后端服务
进入server目录

1.下载npm包

npm i --registry=https://registry.npm.taobao.org

2.启动服务
```NODE_ENV=test pm2 start startup.yml```(test为测试环境，production为生产环境)
"use strict";
var express = require('express'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  redis = require('redis'),
  bluebird = require('bluebird'),
  redisStore = require('connect-redis')(session),
  Utils = require('./utils/utils'),
  path = require('path'),
  log4js = require('log4js');

var app = express();

// 得到环境配置
var server = require('./config/env'),
  nodeEnv = server.env,
  port = nodeEnv.port;

var isDev = 'development' === app.get('env') ? true : false;
global.__base = __dirname + '/';
console.log('当前NODE环境：' + app.get('env'));

/** 中间件 **/
// 这个方法返回一个仅仅用来解析json格式的中间件。
// 这个中间件能接受任何body中任何Unicode编码的字符。支持自动的解析gzip和 zlib。
app.use(bodyParser.json());

// 这个方法也返回一个中间件，这个中间件用来解析body中的urlencoded字符，
// 只支持utf-8的编码的字符。同样也支持自动的解析gzip和 zlib。
app.use(bodyParser.urlencoded({ extended: false }));

// 解析Cookies的头通过req.cookies得到cookies
app.use(cookieParser());

// 生产缓存静态资源1月，其他为3分钟
let _maxAge = nodeEnv === 'production' ? 2592000*1000 : 180*1000;
app.use(express.static(path.join(__dirname, 'dist'), {maxAge: _maxAge}));

// session
var redisConf = nodeEnv.redis;
var sessionConf = server.session;
var options = {
  prefix: sessionConf.prefix,
  ttl: sessionConf.expire,
  host: redisConf.address,
  port: redisConf.port,
  db: 0
};

var sess = {
  store: new redisStore(options),
  secret: sessionConf.secret,
  resave: true, // 强制保存session即使它并没有变化 （默认： true）
  rolling: true, // 在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: sessionConf.expire * 1000
  },
  saveUninitialized: false // 强制“未初始化”的会话保存到存储。
};
app.use(session(sess));

// 日志
var appLog = log4js.getLogger('app'), // 程序日志
  httpLog = log4js.getLogger('http'); // 访问日志
global.appLog = appLog; // 挂载到全局
Utils.mkdirsSync('../logs/node');
Utils.mkdirsSync('../logs/c2node');
Utils.mkdirsSync('../logs/node2s');
log4js.configure('./log4js.json');
app.use(log4js.connectLogger(httpLog, { level: 'auto' }));

// redisClient
bluebird.promisifyAll(redis.RedisClient.prototype);
var _options = {
  prefix: sessionConf.prefix,
}
if (redisConf.pass) _options.password = redisConf.pass;
global.redisClient = redis.createClient(
  redisConf.port,
  redisConf.address,
  _options
);

// // 获取camera模块的token
app.use(Utils.getCameraToken);

/** 中间件结束 **/

// 路由配置
require('./config/routes')(app);

// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// api错误处理
app.use('/api', function (err, req, res, next) {
  global.appLog.error('Api error :' + err && err.stack || err);
  res.json(err);
});

// 启动服务
app.listen(port, err => {
  console.log(err || '监听端口：' + port);
});
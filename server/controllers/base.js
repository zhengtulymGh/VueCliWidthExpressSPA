const request = require('request');
const fs = require('fs');
const crypto = require('crypto');
const ajax = require(__base + './utils/ajax');
const utils = require(__base + './utils/utils');
const env = require(__base + './config/env').env;
const wsInfo = require(__base + './config/env').wsInfo;

const WebSocket = require('ws')

exports.getUrl = (req, res, next) => {
  // 根据url得到模块，url是形如"/api/member/account/verify"
  // console.log(req.originalUrl.split('/'))
  // console.log('env', env.host)
  const module = req.originalUrl.split('/')[2];
  // console.log('module', module)
  // 得到模块后面的路径，该路径为api的真正路径
  const url = req.originalUrl.split(module)[1];
  // 拼凑完整路径
  // if (url.split('?')[1].indexOf('token') >= 0) {
  //   req.api = env.host[module] + url.split('?')[0] + '?token=' + req.session.token;
  // } else {
  //   req.api = env.host[module] + url;
  // }
  req.api = env.host[module] + url;
  // 挂载到req上
  // req.h5FullPath = fullPath;
  // module也挂载
  req.module = module;
  // console.log('getUrl')
  next();
}

// post方法时，强制把access_token放到url上面
exports.addAccessTokenToUrl = (req, res, next) => {
  req.proxyFullPath += '?access_token=' + req.query.access_token
  next()
}

// 摄像头设置相关的api需要带上access-token，黄老板的接口跟h5的那个有点不一样
exports.getCameraToken = (req, res, next) => {
  req.originalUrl = utils.addParamToUrl(req.originalUrl, 'access-token', req.cameraToken)
  next()
}

exports.addToken = (req, res, next) => {
  const encodedToken = encodeURIComponent(req.session.token)
  req.query.token = encodedToken
  // if (req.originalUrl.indexOf('need_token') >= 0) {
  req.originalUrl = utils.addParamToUrl(req.originalUrl, 'token', encodedToken)
  // }
  // if (req.method.toLowerCase() === 'get') {
  //   req.originalUrl = utils.addParamToUrl(req.originalUrl, 'token', encodedToken)
  // } else {
  //   req.body.token = req.session.token;
  // }
  next();
};

exports.render = (req, res, next) => {
  fs.readFile(__base + '/dist/index.html', "utf8", (err, file) => {
    if (err) {
      next()
    } else {
      res.status(200).send(file);
    }
  });
}

// 流
exports.stream = (req, res, next) => {
  const requestObj = request[req.method.toLowerCase()]({
    url: req.api
  });
  req.pipe(requestObj);
  requestObj.pipe(res);
};

// exports.proxy_form = (req, res, next) => {
//   console.log(req.method.toLowerCase())
//   let contentLength = req.body.length
//   ajax[req.method.toLowerCase()](req.api, {
//     headers: {
//       'Content-Length': contentLength,
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: req.body,
//     json: true
//   }).then(ret => {
//     res.json(ret.body);
//   }).catch((err) => {
//     next(err);
//   });
// }

exports.proxy = (req, res, next) => {
  // console.log('proxy res.body')
  // console.log(res)
  // console.log('req.session.token')
  // console.log(req.session.token)
  // console.log(req.api)
  // console.log(req.method.toLowerCase())
  // req.body.access_token = global.token.access_token
  // const url = env.server + req.originalUrl
  // const url = env.host[module] + req.realUrl
  ajax[req.method.toLowerCase()](req.api, {
    body: req.body,
    json: true
  })
    .then(ret => {
      res.json(ret.body);
    })
    .catch((err) => {
      next(err);
    });
}

exports.ws = (req, res, next) => {
  console.log('ws')
  const ws = new WebSocket.Server(req.api);
  ws.on('open', function open() {
    console.log('received: %s', 'message');
    ws.send(array);
  });
}

exports.getWsSign = (req, res, next) => {
  let timeStamp = Date.parse(new Date()) / 1000
  let signMd5 = crypto.createHash('md5').update(wsInfo.app_key + timeStamp).digest('hex');
  res.json({msg: 'ok', data: {
    appId: wsInfo.appId,
    sign: crypto.createHash('sha1').update(signMd5).digest('hex').substr(5, 10),
    timeStamp
  }});
}

exports.streamProxy = (req, res, next) => {
  const url = env.server + req.originalUrl
  const requestObj = request[req.method.toLowerCase()]({
    url: url
  });
  req.pipe(requestObj);
  requestObj.pipe(res);
}

exports.redirect = (req, res, next) => {
  const url = env.server + req.originalUrl.split('/redirect')[1]
  res.redirect(url)
}
var ajax = require(__base + 'utils/ajax')
var env = require(__base + './config/env').env
var _ = require('lodash')

exports.checkLogin = (req, res, next) => {
  // 已登录
  if (req.session.token) {
    let user = req.session.user;
    res.json({msg: 'ok', data: {username: user}});
  } else {
    global.appLog.error('checkLogin error: ' + req.cookies.sessionid);
    res.json({error: {msg: '用户未登录'}});
  }
}

exports.signin = (req, res, next) => {
  // const url = env.server + req.originalUrl
  console.log('signin')
  console.log(req.body)
  ajax[req.method.toLowerCase()](
    req.api,
    {
      body: req.body,
      json: true
    }
  ).then(ret => {
    console.log('\n')
    console.log('ret')
    console.log(ret.body)
    const data = ret.body;
    // 登录成功
    if (data.token) {
      // 保存session
      req.session.regenerate(function (err) {
        if (err) {
          next('登录出错');
        } else {
          req.session.token = data.token
          req.session.user = req.body.username
          let retData = _.cloneDeep(data)
          retData.user = req.body.username
          delete retData.token // 嗯哼，在浏览器里看不到token值了，以保密
          // delete retData.data.group
          res.json(retData);
        }
      });
    } else {
      res.json(data);
    }
  }).catch(err => {
    next(err)
  })
}

exports.signout = (req, res, next) => {
  req.session.destroy(function(err) {
    if (!err) {
      res.json({msg: 'ok', data: {}});
    } else {
      res.json({error: {msg: '登出失败'}});
    }
  });
}

var _path = __base + 'controllers/';

// var Test = require(_path + 'test');
var Base = require(_path + 'base');
var Uploader = require(_path + 'uploader');
var Account = require(_path + 'account');
// var Camera = require(_path + 'camera');
module.exports = (app) => {
  // 不缓存
  // app.use((req, res, next) => {
  //   res.setHeader('Cache-Control','no-cache');
  //   next();
  // });

  // 判断是否需要加入token
  // app.use((req, res, next) => {
  //   const token = req.query.token
  //   console.log('req.query.token')
  //   console.log(token)
  //   if (token) {
  //     req.body.token = req.session.user.token
  //   }
  //   next()
  // })


  // 账户
  // 登录
  app.post('/api/node/user/login', Base.getUrl, Account.signin);
  // 检测登录
  app.get('/api/node/user/info', Account.checkLogin);
  // 登出
  app.get('/api/node/user/logout', Account.signout);

  // app.post('/api/epower/admin/add-face-photo', Base.addToken, Base.getUrl, Base.stream);
  // app.post('/api/epower/admin/plan-update', Base.addToken, Base.getUrl, Base.stream);
  // app.post('/api/epower/admin/plan-create', Base.addToken, Base.getUrl, Base.stream);
  app.get('/api/camera_api/config-relations/:id', Base.getCameraToken, Base.getUrl, Base.proxy)

  // camera_api和paas_s模块不要getToken但是需要cameraToken
  app.use('/api/camera_api', Base.getCameraToken, Base.getUrl, Base.proxy)
  app.use('/api/paas_s', Base.getCameraToken, Base.getUrl, Base.proxy)
  // 跳转页面
  // app.use('/redirect', Base.redirect)
  // 默认api路由由base处理
  app.use('/api/', Base.getUrl, Base.proxy);
  // 页面渲染路由
  app.use('*', Base.render);
};
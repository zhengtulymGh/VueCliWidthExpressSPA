var readIni = require('../utils/readIni').readIni;
var conf = readIni('../conf/config.ini');
// 返回当前环境的配置信息
exports.env = (() => {
  return conf
})();

/*========================SESSION================================*/
exports.session = (() => {
  return  {
    prefix: conf.session.prefix,
    secret: conf.session.secret,
    expire: conf.session.expire
  };
})()

/*=========================camera模块api对应的设置===============================*/
exports.cameraTokenConf = (() => {
  return {
    key: conf.camera_token.key,
    appId: conf.camera_token.app_id,
    appKey: conf.camera_token.app_key,
    expire: conf.camera_token.expire,
  }
})()


/*==========================用户名和密码========================*/
exports.user = (() => {
  return {
    username: conf.user.username,
    password: conf.user.password
  }
})()

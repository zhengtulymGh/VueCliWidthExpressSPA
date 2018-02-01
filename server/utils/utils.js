/**
 * 工具类
 * Created by ayou on 2017/4/14.
 */
var path = require('path'),
  qs = require('query-string'),
  env = require('../config/env').env,
  crypto = require('crypto'),
  cameraTokenConf = require('../config/env').cameraTokenConf,
  ajax = require('./ajax'),
  fs = require('fs');
console.log('cameraTokenConf', cameraTokenConf)
// 获取camera模块所需的token
/**
 * 随机数[min,max]
 * @params min {int} 最小值
 * @params max {int} 最大值
 */
function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * 根据appId和appKey签名
 * @returns {{appid: string, sign: *, nonce: number, time: number}}
 */
function signature() {
  let appId = cameraTokenConf.appId;
  let appKey = cameraTokenConf.appKey;
  let timestamp = Date.parse(new Date()) / 1000; //new Date().getTime();//精确到秒
  let nonce = random(1000000, 9999999);
  let tempStr = [appKey, timestamp, nonce].sort().join('');
  let sign = (nonce % 2 === 1) ?
      crypto.createHash('sha1').update(crypto.createHash('md5').update(tempStr).digest('hex')).digest('hex')
      : crypto.createHash('sha1').update(tempStr).digest('hex');
  return { appid: appId, sign: sign, nonce: nonce, time: timestamp };
}

async function _getCameraToken () {
  let url = env.host.camera_api + '/tokens';
  const params = signature();
  url = url + '?' + qs.stringify(params);
  try {
    const ret = await ajax.get(url)
    const body = ret.body;
    if (body.message === 'success') {
      return body.data
    }
    return false
  } catch (err) {
    throw new Error('获取cameratoken：' + err)
  }
}

class Utils {
  static getClientIp() {
    var addressIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var reg = /(\d{1,3}\.){3}\d{1,3}/;
    addressIp = (addressIp === '::1' ? '127.0.0.1' : addressIp);
    if(addressIp.match(reg)){
      return addressIp.match(reg)[0];
    }
    return '';
  }

  static mkdirsSync(dirname, mode) {
    function mkdirsSync(dirname, mode) {
      if (fs.existsSync(dirname)) {
        return true;
      } else {
        if (mkdirsSync(path.dirname(dirname), mode)) {
          fs.mkdirSync(dirname, mode);
          return true;
        }
      }
    }
    mkdirsSync(dirname, mode);
  }

  static addParamToUrl(url, key, value) {
    const decodedUrl = decodeURIComponent(url);
    const pos = decodedUrl.indexOf('?');
    const len = decodedUrl.length;

    if (pos > -1) {
      if (pos === len - 1) {
        url += `${key}=`;
      } else {
        url += `&${key}=`;
      }
    } else {
      url += `?${key}=`;
    }
    url += value;
    return url;
  }

  static async getCameraToken (req, res, next) {
    try {
      const ret = await global.redisClient.getAsync(cameraTokenConf.key)
      console.log('getCameraToken ret', ret)
      if (ret) {
        req.cameraToken = ret
      } else {
        const token = await _getCameraToken()
        if (token) {
          // 获取成功，挂载到req上，保存到redis中
          req.cameraToken = token;
          global.redisClient.set(cameraTokenConf.key, token);
          global.redisClient.expire(cameraTokenConf.key, cameraTokenConf.expire);
        }
      }
      next()
    } catch (err) {
      // 记录异常
      if (err) {
        console.log(err)
        global.appLog.error('getCameraToken:' + err);
      }
      next()
    }
  }
}

module.exports = Utils;
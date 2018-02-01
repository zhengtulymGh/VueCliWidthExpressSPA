/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2017-12-25 16:05:54
 * @version $Id$
 */
import login from './login'
import table from './table'
import camera from './camera'
import stream from './stream'
import serial from './serial'
import monitor from './monitor'

export default (function() {
  return function install(Vue, options) {
    Vue.prototype.$api = {
      ...login,
      ...table,
      ...camera,
      ...stream,
      ...serial,
      ...monitor
    }
  }
})()

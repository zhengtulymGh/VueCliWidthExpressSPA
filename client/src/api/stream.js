/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2017-12-28 11:44:30
 * @version $Id$
 */

import request from '@/utils/request'

export default {
  async getStreamList(query) {
    return await request({
      url: '/api/paas_s/stream/list',
      method: 'get',
      params: query
    })
  },
  async getStream(cid) {
    return await request({
      url: '/api/paas_s/stream/detail',
      method: 'get',
      params: cid
    })
  },
  async getVideoSettingList(query) {
    return await request({
      url: '/api/paas_s/videosetting/list',
      method: 'get',
      params: query
    })
  },
  async getVideoSetting(cid) {
    return await request({
      url: '/api/paas_s/videosetting/detail',
      method: 'get',
      params: cid
    })
  }
}


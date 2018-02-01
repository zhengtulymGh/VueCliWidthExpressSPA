/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2018-01-04 16:35:39
 * @version $Id$
 */

import request from '@/utils/request'

export default {
  async getMonitorStreamList(query) {
    return await request({
      url: '/api/paas_s/monitorstream/list',
      method: 'get',
      params: query
    })
  }
}

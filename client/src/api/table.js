import request from '@/utils/request'

export default {
  async getList(params) {
    return await request({
      url: '/api/paas_s/article/list',
      method: 'get',
      params
    })
  }
}
export function getList(params) {
  return request({
    url: '/api/paas_s/article/list',
    method: 'get',
    params
  })
}

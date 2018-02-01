import request from '@/utils/request'

export default {
  async getCameraList({ page, per_page }) {
    return await request({
      url: '/api/paas_s/camera',
      method: 'get',
      params: {
        page,
        per_page
      }
    })
  }
}

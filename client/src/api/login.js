import request from '@/utils/request'

export default {
  async login(username, password) {
    return await request({
      url: '/api/node/user/login',
      method: 'post',
      data: {
        username,
        password
      }
    })
  },
  async getInfo(token) {
    return await request({
      url: '/api/node/user/info',
      method: 'get',
      params: { token }
    })
  },
  async logout() {
    return await request({
      url: '/api/node/user/logout',
      method: 'post'
    })
  }
}

// export function login(username, password) {
//   return request({
//     url: '/api/paas_s/user/login',
//     method: 'post',
//     data: {
//       username,
//       password
//     }
//   })
// }

// export function getInfo(token) {
//   console.log(token)
//   return request({
//     url: '/api/paas_s/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/api/paas_s/user/logout',
//     method: 'post'
//   })
// }

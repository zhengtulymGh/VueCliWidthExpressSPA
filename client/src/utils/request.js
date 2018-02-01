import axios from 'axios'
import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth'

// // 创建axios实例
// const service = axios.create({
//   baseURL: process.env.BASE_API, // api的base_url
//   timeout: 5000 // 请求超时时间
// })

// // request拦截器
// service.interceptors.request.use(config => {
//   if (store.getters.token) {
//     config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
//   }
//   return config
// }, error => {
//   // Do something with request error
//   console.log(error) // for debug
//   Promise.reject(error)
// })

// // respone拦截器
// service.interceptors.response.use(
//   // response => {
//   // /**
//   // * code为非20000是抛错 可结合自己业务进行修改
//   // */
//   //   const res = response.data
//   //   if (res.code !== 20000) {
//   //     Message({
//   //       message: res.data,
//   //       type: 'error',
//   //       duration: 5 * 1000
//   //     })

//   //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//   //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//   //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//   //         confirmButtonText: '重新登录',
//   //         cancelButtonText: '取消',
//   //         type: 'warning'
//   //       }).then(() => {
//   //         store.dispatch('FedLogOut').then(() => {
//   //           location.reload()// 为了重新实例化vue-router对象 避免bug
//   //         })
//   //       })
//   //     }
//   //     return Promise.reject('error')
//   //   } else {
//   //     return response.data
//   //   }
//   // },
//   response => response,
//   error => {
//     console.log('err' + error)// for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export service

const request = function(options, hasBinaryData) {
  const module = options.url.split('/')[2]
  return axios({
    method: options.method,
    url: options.url,
    params: options.params,
    data: options.data,
    transformRequest: [(data) => {
      // 对 data 进行任意转换处理
      if (hasBinaryData) {
        const formData = new window.FormData()
        for (const key in data) {
          formData.append(key, data[key])
        }
        return formData
      }
      return JSON.stringify(data)
    }],
    headers: {
      // 'Content-Type': hasBinaryData ? 'multipart/form-data' : 'application/json'
      'Content-Type': 'application/json; charset=utf-8'
    }
  }).then((response) => {
    console.log('response', response)
    const body = response.data
    switch (module) {
      case 'paas_s':
        if (body.status === 200) {
          return Promise.resolve(body)
        } else {
          Message({
            type: 'error',
            message: body.data.message || '请求失败',
            duration: 5 * 1000
          })
          // if (body.error.message.indexOf('token') >= 0) {
          //   window.location.href = '/login'
          // }
        }
        break
      default :
        if (options.noStatus) {
          if (response) {
            return Promise.resolve(response)
          } else {
            Message({
              type: 'error',
              message: response.message || '请求失败',
              duration: 5 * 1000
            })
          }
        } else {
          if (response.status === 200) {
            return Promise.resolve(body)
          } else {
            Message({
              type: 'error',
              message: body.data.message || '请求失败',
              duration: 5 * 1000
            })
            // if (body.error.message.indexOf('token') >= 0) {
            //   window.location.href = '/login'
            // }
          }
        }
        break
    }
  }).catch((error) => {
    if (options.noNotify) return
    Message({
      type: 'error',
      message: JSON.stringify(error)
    })
  })
}

export default request

// export function upload(obj) {
//   const formData = new window.FormData()
//   for (let key in obj.params) {
//     formData.append(key, obj.params[key])
//   }
//   return axios.post(obj.url, formData)
//     .then((response) => {
//       const body = response.data
//       if (body.code) {
//         // console.log(JSON.stringify((body.desc)))
//         // showToast('warning', JSON.stringify((body.desc) || '请求失败'))
//         Message({
//           message: error.message,
//           type: 'error',
//           duration: 5 * 1000
//         })
//       } else {
//         return Promise.resolve(body)
//       }
//     })
//     .catch((error) => {
//       Message({
//         message: error.message,
//         type: 'error',
//         duration: 5 * 1000
//       })
//       // showToast('warning', JSON.stringify(error))
//       // return Promise.reject(error)
//     })
// }

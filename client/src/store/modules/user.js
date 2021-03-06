import loginApi from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

console.log('loginApi', loginApi)
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const token = 'token'
      setToken(token)
      commit('SET_TOKEN', token)
      commit('SET_NAME', username)
      // return new Promise((resolve, reject) => {
      //   loginApi.login(username, userInfo.password).then(response => {
      //     console.log(response)
      //     const data = response.data
      //     setToken(data.token)
      //     commit('SET_TOKEN', data.token)
      //     console.log('getToken()', getToken())
      //     resolve()
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      commit('SET_ROLES', 'admin')
      // return new Promise((resolve, reject) => {
      //   loginApi.getInfo(state.token).then(response => {
      //     console.log(response)
      //     if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
      //       reject('error')
      //     }
      //     const data = response.data
      //     commit('SET_ROLES', data.role)
      //     commit('SET_NAME', data.name)
      //     commit('SET_AVATAR', data.avatar)
      //     resolve(response)
      //   }).catch(error => {
      //     console.log(error)
      //     reject(error)
      //   })
      // })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        loginApi.logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

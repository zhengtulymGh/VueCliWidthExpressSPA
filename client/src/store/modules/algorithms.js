import Vue from 'vue'
import cameraApi from '@/api/camera'

const algorithms = {
  state: {
    configRelations: {
      data: [],
      algos: []
    },
    calibRelations: {},
    cameraAlgos: {}
  },

  mutations: {
    SET_CONFIGRELATIONS: (state, data) => {
      state.configRelations.data = data.map((list) => {
        list.cfgu_require = JSON.parse(list.cfgu_require)
        return list
      })
      state.configRelations.algos = []
      data.forEach((list) => {
        if (list.pid === 0) {
          state.configRelations.algos.push({
            text: list.name,
            value: list.type,
            child: [{
              text: list.name,
              value: list.type
            }]
          })
        }
      })
      data.forEach((list) => {
        state.configRelations.algos = state.configRelations.algos.map((algo) => {
          if (algo.value === list.pid) {
            algo.child.push({
              text: list.name,
              value: list.type
            })
          }
          return algo
        })
      })
    },
    SET_CALIBRELATIONS: (state, params) => {
      Vue.set(state.calibRelations, params.type, params.data)
    },
    SET_CAMERAALGOS: (state, params) => {
      const cameraAlgo = {
        data: params.data,
        firstAlgos: []
      }
      params.data.forEach((list) => {
        cameraAlgo.firstAlgos.push(Number(list.arith_types.split('|')[0]))
      })
      Vue.set(state.cameraAlgos, params.cid, cameraAlgo)
    }
  },

  actions: {
    async GetConfigRelations(context) {
      const res = await cameraApi.getCameraConfigRelations()
      if (res) {
        context.commit('SET_CONFIGRELATIONS', res)
        return res
      }
    },
    async GetCalibRelations({ commit }, type) {
      const data = await cameraApi.getCameraCalibRelations({ type })
      if (data) {
        commit('SET_CALIBRELATIONS', { type, data })
        return data
      }
    },
    async GetCameraAlgos({ commit }, cid) {
      const res = await cameraApi.getCameraAlgoList({ cid })
      if (res.data) {
        commit('SET_CAMERAALGOS', { cid, data: res.data })
        return res.data
      }
    }
  }
}

export default algorithms

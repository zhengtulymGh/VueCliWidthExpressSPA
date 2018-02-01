import serialApi from '@/api/serial'

const options = {
  state: {
    manufacturers: [],
    cameraTypes: [
      {
        text: '普通摄像头',
        value: 1
      }, {
        text: '热点摄像头',
        value: 2
      }
    ]
  },

  mutations: {
    SET_MANUFACTURERS: (state, list) => {
      state.manufacturers = list
    },
    SET_CAMERATYPES: (state, list) => {
      state.cameraTypes = list
    }
  },

  actions: {
    async GetManufacturerList(context) {
      const res = await serialApi.getManufacturerList()
      if (res) {
        const manufacturers = []
        res.data.forEach((list) => {
          manufacturers.push({
            text: list.name,
            value: list.gid
          })
        })
        context.commit('SET_MANUFACTURERS', manufacturers)
        return manufacturers
      }
    }
  }
}

export default options

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
  },
  async getCameraAlgoList({ cid }) {
    return await request({
      url: '/api/paas_s/camera-config/all-algo-detail',
      method: 'get',
      params: {
        cid
      }
    })
  },
  async getCameraAlgoAreaInfo({ cid, type_id }) {
    return await request({
      url: '/api/camera_api/calib-groups',
      method: 'get',
      params: {
        cid,
        type_id
      }
    })
  },
  // 获取所有算法的type
  async getCameraConfigRelations(per_page = 999) {
    return await request({
      url: '/api/camera_api/config-relations',
      method: 'get',
      params: {
        'per-page': per_page
      }
    })
  },
  // 获取单个算法的配置说明
  async getCameraConfigRelation({ type }) {
    return await request({
      url: `/api/camera_api/config-relations/${type}`,
      method: 'get'
    })
  },
  // 获取单个算法的标线说明
  async getCameraCalibRelations({ type }) {
    return await request({
      url: `/api/camera_api/calib-relations/${type}`,
      method: 'get'
    })
  },
  // 参数配置或新增算法
  async updateCameraAlgo({
    cid,
    arith_types,
    analysis_time = 'real_time',
    module_begin_time = '09:00:00',
    module_end_time = '21:00:00',
    loitering_threshold = 60,
    detection_min_size = '{ "x": 20, "y": 20 }',
    detection_max_size = '{ "x": 60, "y": 60 }',
    source = 'pc',
    buy_months = 0,
    addon_key1 = '',
    addon_key2 = '',
    addon_key3 = '',
    addon_key4 = '',
    addon_key5 = '',
    addon_val1 = '',
    addon_val2 = '',
    addon_val3 = '',
    addon_val4 = '',
    addon_val5 = ''
  }) {
    return await request({
      url: '/api/paas_s/camera-config/add-edit',
      method: 'post',
      data: {
        cid, // 必填，摄像头ID
        arith_types, // 必填，(需要开通的算法，必须要包含一种一级算法，算法包，一级算法在‘|'左边，算法包在'|'后边，算法包包含1级算法，并且用','分隔),
        analysis_time, // 分析时间 ('real_time'或者'closing_time'),
        module_begin_time, // (如：09:00),
        module_end_time, // (默认21:00),
        loitering_threshold, // (阀值报警：默认60),
        detection_min_size, // (最小的头部检测大小,默认：{ "x": 20,  "y": 20}),
        detection_max_size, // (最大的头部检测大小，默认：{  "x": 60, "y": 60})
        source, // 必填，来源，member填‘pc’即可
        buy_months, // 选填,如果填写将会改变算法有效期，但是不能小于已经设置的算法有效期
        addon_key1, // (附加属性名，非必传，如果对应算法有附加属性，则从1开始添加，支持最多不超过5个)
        addon_key2,
        addon_key3,
        addon_key4,
        addon_key5,
        addon_val1,
        addon_val2,
        addon_val3,
        addon_val4,
        addon_val5 // (附加属性值，非必传，如果对应算法有附加属性，则从1开始添加，支持最多不超过5个)
      }
    })
  },
  // 删除算法
  async deleCameraAlgo({ cid, type }) {
    return await request({
      url: '/api/paas_s/camera-config/del-algo',
      method: 'delete',
      params: {
        cid,
        type
      }
    })
  },
  // 根据cid获取摄像头图片
  async getCameraPicture({ cid, fields = 'pic_path' }) {
    return await request({
      url: `/api/camera_api/cameras/${cid}`,
      method: 'get',
      params: {
        fields
      },
      noStatus: true
    })
  },
  // 添加或修改区域设置
  async updateCameraAlgoAreaConf({ cid, config_type, group_id, group_name, source = 'pc', detail }) {
    return await request({
      url: '/api/paas_s/camera-group/add-edit',
      method: 'post',
      data: {
        cid, // 必填，摄像头ID
        config_type, // :必填，一级算法类型，如1000000
        group_id, // :必填，组id，如果是新建的组，值为-1
        group_name, // :客户设置的组名
        source, // 必填，来源，member填‘pc’即可
        detail // :必填，标线详情，第一级为各标线的类型，第二层为类型下的各组标线（除路径之外，其它类型只有一条），第三层每条标线详情，第四层为每条标线包含的点
      }
    })
  },
  // 得到区域设置
  async getCameraAlgoAreaConf({ cid, type_id }) {
    return await request({
      url: '/api/camera_api/calib-groups',
      method: 'get',
      params: {
        cid, // 必填，摄像头ID
        type_id
      }
    })
  }
}

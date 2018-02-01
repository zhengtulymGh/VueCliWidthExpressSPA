/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2018-01-03 15:13:32
 * @version $Id$
 */

import request from '@/utils/request'

export default {
  async getManufacturerList() {
    return await request({
      url: '/api/paas_s/serial-group/list',
      method: 'get'
    })
  },
  async getManufacturerSerialList({ page, per_page }) { // 对象的解构赋值
    return await request({
      url: '/api/paas_s/serial-factorys/list',
      method: 'get',
      params: {
        page,
        per_page
      }
    })
  },
  async createManufacturerSerials({ key, gid, camera_type, serials }) {
    return await request({
      url: '/api/paas_s/serial-factorys/batch-create',
      method: 'post',
      data: {
        key, // 秘钥(必填)
        gid, // 厂商编号(必填)
        camera_type, // 摄像头类型(必填，1：普通摄像头，2：热点摄像头)
        serials // 序列号，多个使用英文逗号隔开(必填)
      }
    })
  },
  async createManufacturerSerialsWidthCSV({ key, gid, camera_type, file }) {
    return await request({
      url: '/api/paas_s/serial-factorys/import-serial',
      method: 'post',
      data: {
        key, // 秘钥(必填)
        gid, // 厂商编号(必填)
        camera_type, // 摄像头类型(必填，1：普通摄像头，2：热点摄像头)
        file // 序列号，多个使用英文逗号隔开(必填)
      }
    }, true)
  },
  async getNVRSerialList(query) {
    return await request({
      url: '/api/paas_s/nvr/list',
      method: 'get',
      params: query
    })
  },
  async createNVRSerial({ serial, gid }) {
    return await request({
      url: '/api/paas_s/nvr/add',
      method: 'post',
      data: {
        serial,
        gid
      }
    })
  },
  async createNVRSerialWidthCSV({ key, gid, file }) {
    return await request({
      url: '/api/paas_s/nvr/add',
      method: 'post',
      data: {
        key,
        gid,
        file
      }
    }, true)
  },
  async updateNVRSerial({ id, serial, gid }) {
    return await request({
      url: '/api/paas_s/nvr/edit',
      method: 'post',
      data: {
        id, // nvr的ID(必填)
        serial, // nvr序列号(选填)
        gid // 厂商编号(选填)
      }
    })
  },
  async deleteNVRSerial({ id }) {
    return await request({
      url: '/api/paas_s/nvr/deletes',
      method: 'post',
      data: {
        id // nvr的ID(必填)
      }
    })
  }
}

/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2017-12-28 11:46:13
 * @version $Id$
 */

import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const count = 100

const manufacturerList = []
const count_manufacturer = 5

for (let i = 0; i < count_manufacturer; i++) {
  manufacturerList.push(Mock.mock({
    index: '@increment',
    id: '@integer(1, 100)',
    number: '@integer(1, 100)',
    name: '@ctitle(5, 10)',
    'type|1': [1, 2],
    serialCount: '@integer(10, 20)',
    activeCount: '@integer(1, 10)'
  }))
}

const manufacturerSerialList = []

for (let i = 0; i < count; i++) {
  manufacturerSerialList.push(Mock.mock({
    index: '@increment',
    id: '@integer(1, 100)',
    'serial|16': '@character()',
    number: '@integer(1, 100)',
    'activeStatus': '@boolean()'
  }))
}

const NVRSerialList = []

for (let i = 0; i < count; i++) {
  NVRSerialList.push(Mock.mock({
    index: '@increment',
    id: '@integer(1, 100)',
    'serial|16': '@character()',
    channelCount: '@integer(1, 10)',
    'manufacturer|1': [1, 2, 3, 4, 5],
    activeStatus: '@boolean()'
  }))
}

export default {
  getManufacturerList: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    const mockList = manufacturerList.filter(item => {
      // if (importance && item.importance !== +importance) return false
      // if (type && item.type !== type) return false
      // if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    console.log('mockList', mockList)
    // if (sort === '-id') {
    //   mockList = mockList.reverse()
    // }

    const pageList = manufacturerList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getManufacturer: config => {
    // const params = param2Obj(config.url)
    return Mock.mock({
      index: '@increment',
      id: '@integer(1, 100)',
      number: '@integer(1, 100)',
      name: '@ctitle(5, 10)',
      'type|1': [1, 2, 3],
      serialCount: '@integer(10, 20)',
      activeCount: '@integer(1, 10)'
    })
  },
  createManufacturer: () => ({
    data: 'success'
  }),
  updateManufacturer: () => ({
    data: 'success'
  }),
  getManufacturerSerialList: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    const mockList = manufacturerSerialList.filter(item => {
      // if (importance && item.importance !== +importance) return false
      // if (type && item.type !== type) return false
      // if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    console.log('mockList', mockList)
    // if (sort === '-id') {
    //   mockList = mockList.reverse()
    // }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getManufacturerSerial: config => {
    const params = param2Obj(config.url)
    return Mock.mock({
      id: '@integer(1, 100)',
      cid: params[0],
      area: '@integer(1, 4)',
      videoType: '@integer(1, 2)',
      liveUrlIn: '@url("http")',
      liveUrlOut: '@url("http")',
      replayUrlIn: '@url("http")',
      replayUrlOut: '@url("http")',
      status: '@boolean()',
      addTime: '@date("yyyy-MM-dd hh:mm:ss")'
    })
  },
  createManufacturerSerial: () => ({
    data: 'success'
  }),
  updateManufacturerSerial: () => ({
    data: 'success'
  }),
  getNVRSerialList: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    const mockList = NVRSerialList.filter(item => {
      // if (importance && item.importance !== +importance) return false
      // if (type && item.type !== type) return false
      // if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    console.log('mockList', mockList)
    // if (sort === '-id') {
    //   mockList = mockList.reverse()
    // }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getNVRSerial: config => {
    // const params = param2Obj(config.url)
    return Mock.mock({
      index: '@increment',
      id: '@integer(1, 100)',
      'serial|16': '@character()',
      channelCount: '@integer(1, 10)',
      'manufacturer|1': [1, 2, 3, 4, 5],
      activeStatus: '@boolean()'
    })
  },
  createNVRSerial: () => ({
    data: 'success'
  }),
  updateNVRSerial: () => ({
    data: 'success'
  })
}

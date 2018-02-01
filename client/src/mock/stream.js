/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2017-12-28 11:46:13
 * @version $Id$
 */

import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const streamList = []
const count = 100

for (let i = 0; i < count; i++) {
  streamList.push(Mock.mock({
    index: '@increment',
    id: '@integer(1, 100)',
    cid: '@integer(100, 100000)',
    area: '@integer(1, 4)',
    videoType: '@integer(1, 2)',
    liveUrlIn: '@url("http")',
    liveUrlOut: '@url("http")',
    replayUrlIn: '@url("http")',
    replayUrlOut: '@url("http")',
    status: '@boolean()',
    addTime: '@date("yyyy-MM-dd hh:mm:ss")'
  }))
}

const videoSettingList = []

for (let i = 0; i < count; i++) {
  videoSettingList.push(Mock.mock({
    index: '@increment',
    id: '@integer(1, 100)',
    cid: '@integer(100, 100000)',
    videoTimes: [new Date(2018, 1, 1, 9, 0), new Date(2018, 1, 1, 21, 0)],
    uploadTimes: [new Date(2018, 1, 1, 22, 0), new Date(2018, 1, 2, 8, 0)],
    videoStartTime: '@date("hh:mm:ss")',
    videoEndTime: '@date("hh:mm:ss")',
    uploadStartTime: '@date("hh:mm:ss")',
    uploadEndTime: '@date("hh:mm:ss")',
    'period|1': ['week', 'day'],
    weekDays: [1, 2, 5],
    status: '@boolean()',
    updatedTime: '@date("yyyy-MM-dd hh:mm:ss")'
  }))
}

export default {
  getStreamList: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    const mockList = streamList.filter(item => {
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
  getStream: config => {
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
  createStream: () => ({
    data: 'success'
  }),
  updateStream: () => ({
    data: 'success'
  }),
  getVideoSettingList: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    const mockList = videoSettingList.filter(item => {
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
  getVideoSetting: config => {
    const params = param2Obj(config.url)
    return Mock.mock({
      index: '@increment',
      id: '@integer(1, 100)',
      cid: params[0],
      videoTimes: [new Date(2018, 1, 1, 9, 0), new Date(2018, 1, 1, 21, 0)],
      uploadTimes: [new Date(2018, 1, 1, 22, 0), new Date(2018, 1, 2, 8, 0)],
      videoStartTime: '@date("hh:mm:ss")',
      videoEndTime: '@date("hh:mm:ss")',
      uploadStartTime: '@date("hh:mm:ss")',
      uploadEndTime: '@date("hh:mm:ss")',
      'period|1': ['week', 'day'],
      weekDays: [1, 2, 5],
      status: '@boolean()',
      updatedTime: '@date("yyyy-MM-dd hh:mm:ss")'
    })
  },
  createVideoSetting: () => ({
    data: 'success'
  }),
  updateVideoSetting: () => ({
    data: 'success'
  })
}

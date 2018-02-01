/**
 *
 * @authors LIyImIn (yiminli@extremevision.com.cn)
 * @date    2017-12-29 15:44:37
 * @version $Id$
 */

import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
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

export default {
  getList: config => {
    const { page = 1, limit = 20} = param2Obj(config.url)
    const mockList = List.filter(item => {
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
  getReplay: config => {
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
  createReplay: () => ({
    data: 'success'
  }),
  updateReplay: () => ({
    data: 'success'
  })
}



import Mock from 'mockjs'
import { param2Obj } from '@/utils'
const List = []
const count = 100
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    cid: '@integer(100, 100000)',
    groupId: '@integer(1, 100)',
    type: '@integer(1, 4)',
    'mac|6': ':@string("lower", 2)',
    'serial|8': '@character()',
    userDefinedName: '@ctitle(5, 10)',
    transfered: '@boolean()',
    changed: '@boolean()',
    bound: '@boolean()',
    'boundAndTransed|1': ['trans', 'bound'],
    capturePath: '@url("http")',
    debug: '@boolean()',
    addTime: '@date("yyyy-MM-dd hh:mm:ss")'
  }))
}
export default {
  getList: config => {
    const { page = 1, limit = 20 } = param2Obj(config.url)
    const mockList = List.filter(item => {
      // if (importance && item.importance !== +importance) return false
      // if (type && item.type !== type) return false
      // if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    // if (sort === '-id') {
    //   mockList = mockList.reverse()
    // }
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  },
  getPv: () => ({
    pvData: [{
      key: 'PC网站',
      pv: 1024
    }, {
      key: 'mobile网站',
      pv: 1024
    }, {
      key: 'ios',
      pv: 1024
    }, {
      key: 'android',
      pv: 1024
    }]
  }),
  getArticle: () => ({
    id: 120000000001,
    author: {
      key: 'mockPan'
    },
    source_name: '原创作者',
    category_item: [{
      key: 'global',
      name: '全球'
    }],
    comment_disabled: true,
    content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
    content_short: '我是测试数据',
    display_time: +new Date(),
    image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
    platforms: ['a-platform'],
    source_uri: 'https://github.com/PanJiaChen/vue-element-admin',
    status: 'published',
    tags: [],
    title: 'vue-element-admin'
  }),
  createArticle: () => ({
    data: 'success'
  }),
  updateArticle: () => ({
    data: 'success'
  })
}

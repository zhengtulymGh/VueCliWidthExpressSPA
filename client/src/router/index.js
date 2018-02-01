import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading
Vue.use(Router)
/* Layout */
import Layout from '../views/layout/Layout'
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: _import('login/index'),
    hidden: true
  }, {
    path: '/404',
    component: _import('404'),
    hidden: true
  }, {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  }, {
    path: '/camera',
    component: Layout,
    name: 'camera',
    redirect: '/camera/index',
    meta: {
      role: ['admin'],
      title: '摄像头'
    },
    children: [{
      path: 'index',
      component: _import('camera/index'),
      name: 'index',
      meta: {
        title: '摄像头',
        icon: 'table',
        role: ['admin']
      }
    }, {
      path: ':cid/algo-setting',
      component: _import('camera/algoSetting/index'),
      name: 'algoSetting',
      hidden: true,
      meta: {
        title: '配置',
        icon: 'table',
        role: ['admin']
      }
    }]
  },
  // {
  //   path: '/stream',
  //   component: Layout,
  //   meta: {
  //     title: '流管理',
  //     icon: 'table',
  //     role: ['admin']
  //   },
  //   children: [{
  //     path: 'stream',
  //     component: _import('stream/Stream'),
  //     name: 'stream',
  //     meta: {
  //       title: '流管理',
  //       icon: 'table',
  //       role: ['admin']
  //     }
  //   }, {
  //     path: 'videosetting',
  //     component: _import('stream/VideoSetting'),
  //     name: 'replay',
  //     meta: {
  //       title: '录播设置',
  //       icon: 'table',
  //       role: ['admin']
  //     }
  //   }]
  // },
  {
    path: '/serial',
    component: Layout,
    meta: {
      title: '序列号',
      icon: 'table',
      role: ['admin'],
      options: ['manufacturer']
    },
    children: [{
      path: 'manufacturerserial',
      component: _import('serial/ManufacturerSerial'),
      name: 'manufacturerSerial',
      meta: {
        title: '厂商序列号',
        icon: 'table',
        role: ['admin'],
        options: ['manufacturer']
      }
    }, {
      path: 'nvrserial',
      component: _import('serial/NVRSerial'),
      name: 'NVRSerial',
      meta: {
        title: 'NVR序列号',
        icon: 'table',
        role: ['admin'],
        options: ['manufacturer']
      }
    }, {
      path: 'manufacturermanage',
      component: _import('serial/ManufacturerManage'),
      name: 'manufacturerManage',
      meta: {
        title: '厂商管理',
        icon: 'table',
        role: ['admin'],
        options: ['manufacturer']
      }
    }]
  },
  // {
  //   path: '/monitor',
  //   component: Layout,
  //   meta: {
  //     title: '监控',
  //     icon: 'table',
  //     role: ['admin']
  //   },
  //   children: [{
  //     path: 'streamsetting',
  //     component: _import('monitor/StreamSetting'),
  //     name: 'streamSetting',
  //     meta: {
  //       title: '监控流设置',
  //       icon: 'table',
  //       role: ['admin']
  //     }
  //   }, {
  //     path: 'record',
  //     component: _import('monitor/Record'),
  //     name: 'record',
  //     meta: {
  //       title: '监控记录',
  //       icon: 'table',
  //       role: ['admin']
  //     }
  //   }]
  // },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

let [
  getManufacturerList
] = [null]

router.afterEach(async(to, from) => {
  if (!store.state.options.manufacturers.length && to.meta.options && to.meta.options.indexOf('manufacturer') >= 0) {
    getManufacturerList = store.dispatch('GetManufacturerList')
  }
  getManufacturerList && await getManufacturerList
})

export default router

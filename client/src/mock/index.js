import Mock from 'mockjs'
import loginAPI from './login'
import remoteSearchAPI from './remoteSearch'
// import transactionAPI from './transaction'
import cameraAPI from './camera'
import streamAPI from './stream'
import serialAPI from './serial'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/api\/node\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/api\/node\/user\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/api\/node\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 摄像头
Mock.mock(/\/api\/paas-s\/camera\/list/, 'get', cameraAPI.getList)

// 流
Mock.mock(/\/api\/paas-s\/stream\/list/, 'get', streamAPI.getStreamList)
Mock.mock(/\/api\/paas-s\/stream\/detail/, 'get', streamAPI.getStream)
Mock.mock(/\/api\/paas-s\/videosetting\/list/, 'get', streamAPI.getVideoSettingList)
Mock.mock(/\/api\/paas-s\/videosetting\/detail/, 'get', streamAPI.getVideoSetting)

// 序列号
Mock.mock(/\/api\/paas-s\/manufacturer\/list/, 'get', serialAPI.getManufacturerList)
Mock.mock(/\/api\/paas-s\/manufacturer\/detail/, 'get', serialAPI.getManufacturer)
Mock.mock(/\/api\/paas-s\/manufacturerserial\/list/, 'get', serialAPI.getManufacturerSerialList)
Mock.mock(/\/api\/paas-s\/manufacturerserial\/detail/, 'get', serialAPI.getManufacturerSerial)
Mock.mock(/\/api\/paas-s\/nvrserial\/list/, 'get', serialAPI.getNVRSerialList)
Mock.mock(/\/api\/paas-s\/nvrserial\/detail/, 'get', serialAPI.getNVRSerial)

// 搜索相关
Mock.mock(/\/api\/paas-s\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
// Mock.mock(/\/api\/paas-s\/transaction\/list/, 'get', transactionAPI.getList)

export default Mock

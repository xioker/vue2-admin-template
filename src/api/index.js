import request from '@/utils/request'

// 登录
export function login(params) {
  return request({
    url: '/sys-user/login',
    method: 'get',
    params
  })
}
// 验证码
export function verifyCode(params) {
  return request({
    url: '/sys-user/verify_code',
    method: 'get',
    responseType: 'arraybuffer',
    params
  })
}


// 首页相关接口
// 火爆榜
export function bookReadTimeReport(data) {
  return request({
    url: '/report/bookReadTimeReport',
    method: 'post',
    data
  })
}
// 分类榜
export function bookReadTypeTimeReport(data) {
  return request({
    url: '/report/bookReadTypeTimeReport',
    method: 'post',
    data
  })
}
// 全国用户分布图数据
export function custCityReport(data) {
  return request({
    url: '/report/custCityReport',
    method: 'post',
    data
  })
}
// 用户报表数据
export function customerReport(data) {
  return request({
    url: '/report/customerReport',
    method: 'post',
    data
  })
}
// 每日各小时阅读人数
export function todayReadCustReport(data) {
  return request({
    url: '/report/todayReadCustReport',
    method: 'post',
    data
  })
}
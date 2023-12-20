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

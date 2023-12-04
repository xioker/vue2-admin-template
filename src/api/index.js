import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys-user/login',
    method: 'post',
    data
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


export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

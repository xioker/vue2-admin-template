import request from '@/utils/request'

// 用户列表
export function userList(data) {
  return request({
    url: '/sys-user/page_list',
    method: 'post',
    data
  })
}
// 用户详情
export function userDetail(params) {
  return request({
    url: '/sys-user/user_detail',
    method: 'get',
    params
  })
}
// 用户保存
export function userSave(data) {
  return request({
    url: '/sys-user/user_save',
    method: 'post',
    data
  })
}
// 用户禁用 0停用 1启用
export function userOper(params) {
  return request({
    url: '/sys-user/user_oper',
    method: 'get',
    params
  })
}
// 修改密码
export function updatePass(data) {
  return request({
    url: '/sys-user/update_pass',
    method: 'post',
    data
  })
}

// 角色管理列表
export function roleList(data) {
  return request({
    url: '/sys-role/page_list',
    method: 'post',
    data
  })
}
// 角色保存
export function roleSave(data) {
  return request({
    url: '/sys-role/role_save',
    method: 'post',
    data
  })
}
// 角色详情
export function roleDetail(params) {
  return request({
    url: '/sys-role/role_detail',
    method: 'get',
    params
  })
}
// 角色禁用 0禁用 1启用
export function roleOper(params) {
  return request({
    url: '/sys-role/role_oper',
    method: 'get',
    params
  })
}


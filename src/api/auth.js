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

// 菜单管理列表
export function menuList(data) {
  return request({
    url: '/sys-menu/page_list',
    method: 'post',
    data
  })
}
// 菜单保存
export function menuSave(data) {
  return request({
    url: '/sys-menu/menu_save',
    method: 'post',
    data
  })
}
// 菜单详情
export function menuDetail(data) {
  return request({
    url: '/sys-menu/menu_detail',
    method: 'post',
    data
  })
}
// 菜单禁用
export function menuOper(data) {
  return request({
    url: '/sys-menu/menu_oper',
    method: 'post',
    data
  })
}
// 角色关联菜单
export function roleAddMenu(data) {
  return request({
    url: '/sys-menu/role_add_menu',
    method: 'post',
    data
  })
}
// 用户关联角色
export function userAddRole(params) {
  return request({
    url: '/sys-menu/user_add_role',
    method: 'get',
    params
  })
}
// 获取指定角色菜单
export function findRoleMenu(params) {
  return request({
    url: '/sys-menu/find_role_menu',
    method: 'get',
    params
  })
}
// 获取指定用户菜单
export function findUserMenu(params) {
  return request({
    url: '/sys-menu/find_user_menu',
    method: 'get',
    params
  })
}
// 获取指定用户角色
export function findUserRole(params) {
  return request({
    url: '/sys-menu/find_user_role',
    method: 'get',
    params
  })
}
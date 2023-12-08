import request from '@/utils/request'

// 会员等级列表
export function levelList(params) {
  return request({
    url: '/member-level/findMemberLevelList',
    method: 'get',
    params
  })
}
// 等级详情
export function levelDetail(params) {
  return request({
    url: '/member-level/level_detail',
    method: 'get',
    params
  })
}
// 等级保存
export function levelSave(data) {
  return request({
    url: '/member-level/level_save',
    method: 'post',
    data
  })
}
// 等级删除
export function levelDel(params) {
  return request({
    url: '/member-level/level_del',
    method: 'get',
    params
  })
}

// 反馈列表
export function updatePass(data) {
  return request({
    url: '/customer-provide/page_list',
    method: 'post',
    data
  })
}

// 反馈删除
export function roleList(data) {
  return request({
    url: '/customer-provide/provide_del',
    method: 'post',
    data
  })
}
// 反馈回复
export function roleSave(data) {
  return request({
    url: '/customer-provide/replyProvide',
    method: 'post',
    data
  })
}
// 会员费管理列表



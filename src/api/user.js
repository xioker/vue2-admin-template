import request from '@/utils/request'

// 会员管理列表
export function customer(data) {
  return request({
    url: '/customer/search',
    method: 'post',
    data
  })
}
// 会员操作
export function opCustomer(params) {
  return request({
    url: '/customer/opCustomer',
    method: 'post',
    params
  })
}


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
export function levelDel(data) {
  return request({
    url: '/member-level/level_del',
    method: 'post',
    params:data
  })
}

// 反馈列表
export function customerList(data) {
  return request({
    url: '/customer-provide/page_list',
    method: 'post',
    data
  })
}

// 反馈删除
export function customerDel(data) {
  return request({
    url: '/customer-provide/provide_del',
    method: 'post',
    data
  })
}
// 反馈回复
export function customerReply(data) {
  return request({
    url: '/customer-provide/replyProvide',
    method: 'post',
    data
  })
}
// 会员费管理列表
// 站内信管理列表
export function mailList(data) {
  return request({
    url: '/sys-mail/page_list',
    method: 'post',
    data
  })
}
// 发送站内信
export function mailSend(params) {
  return request({
    url: '/sys-mail/mail_send',
    method: 'post',
    params
  })
}
// 站内信保存
export function mailSave(data) {
  return request({
    url: '/sys-mail/mail_save',
    method: 'post',
    data
  })
}
// 站内信删除
export function mailDel(params) {
  return request({
    url: '/sys-mail/mail_del',
    method: 'post',
    params
  })
}

// 活动消息管理列表
export function eventList(data) {
  return request({
    url: '/event-notices/page_list',
    method: 'post',
    data
  })
}
// 活动消息保存
export function eventSave(data) {
  return request({
    url: '/event-notices/event_save',
    method: 'post',
    data
  })
}
// 活动消息删除
export function eventDel(params) {
  return request({
    url: '/event-notices/event_del',
    method: 'post',
    params
  })
}


import request from '@/utils/request'

// banner列表
export function bannerList(data) {
  return request({
    url: '/sys-banner/page_list',
    method: 'post',
    data
  })
}
// banner详情
export function bannerDetail(params) {
  return request({
    url: '/sys-banner/banner_detail',
    method: 'get',
    params
  })
}
// banner保存
export function bannerSave(data) {
  return request({
    url: '/sys-banner/banner_save',
    method: 'post',
    data
  })
}
// banner删除
export function bannerDel(data) {
  return request({
    url: '/sys-banner/banner_del',
    method: 'post',
    data
  })
}
// banner排序
export function bannerSort(data) {
  return request({
    url: '/sys-banner/banner_setSort',
    method: 'post',
    data
  })
}

// 主题设置列表
export function themeList(data) {
  return request({
    url: '/sys-theme/page_list',
    method: 'post',
    data
  })
}
// 主题设置保存
export function themeSave(data) {
  return request({
    url: '/sys-theme/theme_save',
    method: 'post',
    data
  })
}
// 主题设置删除
export function themeDel(data) {
  return request({
    url: '/sys-theme/theme_del',
    method: 'post',
    data
  })
}



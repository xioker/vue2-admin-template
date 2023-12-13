
import request from '@/utils/request'
// 文件上传
export function upload(data) {
  return request({
    url: '/upload/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 系统设置保存 获取
export function findSysConfig(data) {
  return request({
    url: '/sys-config/findSysConfig',
    method: 'post',
    data
  })
}
export function sysConfigSave(data) {
  return request({
    url: '/sys-config/sysConfigSave',
    method: 'post',
    data
  })
}
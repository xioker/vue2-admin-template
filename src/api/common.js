
import request from '@/utils/request'
// 文件上传
 function upload(data) {
  return request({
    url: '/upload/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
export function uploadFile(data) {
  return new Promise((resolve, reject) => {
    upload(data).then((res) => {
      resolve(res)
    }).catch((err) => reject(err))
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
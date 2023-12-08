import request from '@/utils/request'

// 小说分类列表
export function bookTypeList(data) {
  return request({
    url: '/book-type/page_list',
    method: 'post',
    data
  })
}
// 小说分类详情
export function bookTypeDetail(params) {
  return request({
    url: '/book-type/bookType_detail',
    method: 'get',
    params
  })
}
// 小说分类保存
export function bookTypeSave(data) {
  return request({
    url: '/book-type/bookType_save',
    method: 'post',
    data
  })
}
// 小说分类删除
export function bookTypeOper(params) {
  return request({
    url: '/book-type/bookType_delete',
    method: 'get',
    params
  })
}

// 小说章节列表
export function sectionList(data) {
  return request({
    url: '/book-section/page_list',
    method: 'post',
    data
  })
}
// 小说章节详情
export function sectionDetail(params) {
  return request({
    url: '/book-section/bookSection_detail',
    method: 'get',
    params
  })
}
// 小说章节保存
export function sectionSave(data) {
  return request({
    url: '/book-section/bookSection_save',
    method: 'post',
    data
  })
}
// 小说章节删除
export function sectionOper(params) {
  return request({
    url: '/book-section/bookSection_delete',
    method: 'get',
    params
  })
}

// 小说列表
// export function bookList(data) {
//   return request({
//     url: '/book-type/page_list',
//     method: 'post',
//     data
//   })
// }
// 小说详情
export function bookDetail(params) {
  return request({
    url: '/book/book_detail',
    method: 'get',
    params
  })
}
// 小说保存
export function bookSave(data) {
  return request({
    url: '/book/book_add',
    method: 'post',
    data
  })
}
// 小说修改
export function bookUpdate(data) {
  return request({
    url: '/book/book_update',
    method: 'post',
    data
  })
}



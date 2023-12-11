import request from '@/utils/request'

// 小说一级分类列表
export function bookBigTypeList(data) {
  return request({
    url: '/book-big-type/page_list',
    method: 'post',
    data
  })
}
// 小说一级分类详情
export function bookBigTypeDetail(params) {
  return request({
    url: '/book-big-type/bookBigType_detail',
    method: 'get',
    params
  })
}
// 小说一级分类保存
export function bookBigTypeSave(data) {
  return request({
    url: '/book-big-type/bookBigType_save',
    method: 'post',
    data
  })
}
// 小说一级分类删除
export function bookBigTypeDelete(params) {
  return request({
    url: '/book-big-type/bookBigType_delete',
    method: 'get',
    params
  })
}

// 小说二级分类列表
export function bookTypeList(data) {
  return request({
    url: '/book-type/page_list',
    method: 'post',
    data
  })
}
// 小说二级分类详情
export function bookTypeDetail(params) {
  return request({
    url: '/book-type/bookType_detail',
    method: 'get',
    params
  })
}
// 小说二级分类保存
export function bookTypeSave(data) {
  return request({
    url: '/book-type/bookType_save',
    method: 'post',
    data
  })
}
// 小说二级分类删除
export function bookTypeDelete(params) {
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
export function bookFind(data) {
  return request({
    url: '/book/book_find',
    method: 'post',
    data
  })
}
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
// 小说修改开启
export function bookUpdateOpen(data) {
  return request({
    url: '/book/book_update_open',
    method: 'post',
    data
  })
}
// 小说修改排序
export function bookUpdateSort(data) {
  return request({
    url: '/book/book_update_sort',
    method: 'post',
    data
  })
}
// 小说修改置顶
export function bookUpdateTop(data) {
  return request({
    url: '/book/book_update_top',
    method: 'post',
    data
  })
}

// 小说活动标签列表
export function labelList(data) {
  return request({
    url: '/book-label/page_list',
    method: 'post',
    data
  })
}
// 小说活动标签保存
export function labelSave(data) {
  return request({
    url: '/book-label/bookLabel_save',
    method: 'post',
    data
  })
}
// 小说活动标签删除
export function labelDelete(params) {
  return request({
    url: '/book-label/bookLabel_delete',
    method: 'get',
    params
  })
}



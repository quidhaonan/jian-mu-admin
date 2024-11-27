import request from '@/utils/request'

// 查询字典类型列表
export function listType(data) {
  return request({
    url: '/admin/system/dict/type/list',
    method: 'post',
    data: data
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/admin/system/dict/type/' + dictId,
    method: 'get'
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/admin/system/dict/type/add',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/admin/system/dict/type/edit',
    method: 'post',
    data: data
  })
}

// 删除字典类型
export function delType(data) {
  return request({
    url: '/admin/system/dict/type/remove',
    method: 'post',
    data: data
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: '/admin/system/dict/type/refreshCache',
    method: 'delete'
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/admin/system/dict/type/optionselect',
    method: 'get'
  })
}

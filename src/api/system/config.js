import request from '@/utils/request'

// 查询参数列表
export function listConfig(data) {
  return request({
    url: '/admin/system/config/list',
    method: 'post',
    data: data
  })
}

// 查询参数详细
export function getConfig(configId) {
  return request({
    url: '/admin/system/config/' + configId,
    method: 'get'
  })
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return request({
    url: '/admin/system/config/configKey/' + configKey,
    method: 'get'
  })
}

// 新增参数配置
export function addConfig(data) {
  return request({
    url: '/admin/system/config/add',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateConfig(data) {
  return request({
    url: '/admin/system/config/edit',
    method: 'post',
    data: data
  })
}

// 删除参数配置
export function delConfig(data) {
  return request({
    url: '/admin/system/config/remove',
    method: 'post',
    data: data
  })
}

// 刷新参数缓存
export function refreshCache() {
  return request({
    url: '/admin/system/config/refreshCache',
    method: 'delete'
  })
}

import request from '@/utils/request'

// 查询操作日志列表
export function list(data) {
  return request({
    url: '/monitor/operlog/list',
    method: 'post',
    data: data
  })
}

// 删除操作日志
export function delOperlog(data) {
  return request({
    url: '/monitor/operlog',
    method: 'post',
    data: data
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete'
  })
}

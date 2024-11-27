import request from '@/utils/request'

// 查询登录日志列表
export function list(data) {
  return request({
    url: '/admin/monitor/logininfo/list',
    method: 'post',
    data: data
  })
}

// 删除登录日志
export function delLogininfor(data) {
  return request({
    url: '/admin/monitor/logininfo/remove',
    method: 'post',
    data: data
  })
}

// 解锁用户登录状态
export function unlockLogininfor(userName) {
  return request({
    url: '/admin/monitor/logininfor/unlock/' + userName,
    method: 'get'
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/admin/monitor/logininfor/clean',
    method: 'delete'
  })
}

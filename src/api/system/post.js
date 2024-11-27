import request from '@/utils/request'

// 查询岗位列表
export function listPost(data) {
  return request({
    url: '/admin/system/post/list',
    method: 'post',
    data: data
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/admin/system/post/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/admin/system/post/add',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/admin/system/post/edit',
    method: 'post',
    data: data
  })
}

// 删除岗位
export function delPost(data) {
  return request({
    url: '/admin/system/post/remove',
    method: 'post',
    data: data
  })
}

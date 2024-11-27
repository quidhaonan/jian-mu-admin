// import request from '@/utils/TestRequest.js'
import request from '@/utils/request.js'

// const request = new TestRequest('127.0.0.1:9998/bi');

// 查询本地活码列表
export function listLiveCodeLocal(data) {

    // return request.post("/liveCode/local/list",{
    //     data:data
    // })
    return request({
        url: '/bi/liveCode/local/list',
        method: 'post',
        data: data
    })
}

// 新增本地活码
export function addLiveCodeLocal(data, headers) {
    return request({
        url: '/bi/liveCode/local/add',
        method: 'post',
        data,
        headers
    })
}

// 修改本地活码
export function updateLiveCodeLocal(data, headers) {
    return request({
        url: '/bi/liveCode/local/update',
        method: 'post',
        data,
        headers
    })
}

// 修改本地活码状态
export function changeLiveCodeLocalStatus(data) {
    return request({
        url: '/bi/liveCode/local/change/status',
        method: 'post',
        data
    })
}

// 修改本地活码状态
export function deleteLiveCodeLocal(data) {
    return request({
        url: '/bi/liveCode/local/remove',
        method: 'post',
        data
    })
}

// 获得本地活码信息
export function getLiveCodeLocal(data) {
    return request({
        url: '/bi/liveCode/local/info/' + data,
        method: 'get'
    })
}

// 获得本地活码图片
export function getLiveCodeLocalImg(data) {
    return request({
        url: '/bi/liveCode/local/' + data,
        method: 'get'
    })
}
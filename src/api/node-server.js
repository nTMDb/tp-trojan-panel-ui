import request from '@/utils/request'

/**
 * 根据id查询服务器
 * @param data
 * @returns
 */
export function selectNodeServerById(data) {
  return request({
    url: '/nodeServer/selectNodeServerById',
    method: 'get',
    params: data
  })
}

/**
 * 创建服务器
 * @param data
 * @returns
 */
export function createNodeServer(data) {
  return request({
    url: '/nodeServer/createNodeServer',
    method: 'post',
    data
  })
}

/**
 * 分页查询服务器
 * @param data
 * @returns
 */
export function selectNodeServerPage(data) {
  return request({
    url: '/nodeServer/selectNodeServerPage',
    method: 'get',
    params: data
  })
}

/**
 * 删除服务器
 * @param data
 * @returns
 */
export function deleteNodeServerById(data) {
  return request({
    url: '/nodeServer/deleteNodeServerById',
    method: 'post',
    data
  })
}

/**
 * 更新服务器
 * @param data
 * @returns
 */
export function updateNodeServerById(data) {
  return request({
    url: '/nodeServer/updateNodeServerById',
    method: 'post',
    data
  })
}

/**
 * 查询服务器列表
 * @param data
 * @returns
 */
export function updateNodeServerById(data) {
  return request({
    url: '/nodeServer/selectNodeServerList',
    method: 'get',
    params: data
  })
}

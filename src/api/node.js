import request from '@/utils/request'

/**
 * 根据id查询节点
 * @param data
 * @returns {AxiosPromise}
 */
export function selectNodeById(data) {
  return request({
    url: '/node/selectNodeById',
    method: 'get',
    params: data
  })
}

/**
 * 创建节点
 * @param data
 * @returns {AxiosPromise}
 */
export function createNode(data) {
  return request({
    url: '/node/createNode',
    method: 'post',
    data
  })
}

/**
 * 分页查询节点
 * @param data
 * @returns {AxiosPromise}
 */
export function selectNodePage(data) {
  return request({
    url: '/node/selectNodePage',
    method: 'get',
    params: data
  })
}

/**
 * 删除节点
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteNodeById(data) {
  return request({
    url: '/node/deleteNodeById',
    method: 'post',
    data
  })
}

/**
 * 更新节点
 * @param data
 * @returns {AxiosPromise}
 */
export function updateNodeById(data) {
  return request({
    url: '/node/updateNodeById',
    method: 'post',
    data
  })
}

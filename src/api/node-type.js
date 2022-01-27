import request from '@/utils/request'

/**
 * 查询节点类型列表
 * @param data
 * @returns {AxiosPromise}
 */
export function selectNodeTypeList(data) {
  return request({
    url: '/nodeType/selectNodeTypeList',
    method: 'get',
    params: data
  })
}

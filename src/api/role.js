import request from '@/utils/request'

/**
 * 查询角色列表
 * @param data
 * @returns {AxiosPromise}
 */
export function selectRoleList(data) {
  return request({
    url: '/role/selectRoleList',
    method: 'get',
    params: data
  })
}
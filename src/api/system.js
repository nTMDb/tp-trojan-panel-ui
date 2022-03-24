import request from '@/utils/request'

/**
 * 查询系统设置
 * @param data
 * @returns {AxiosPromise}
 */
export function selectSystemByName(data) {
  return request({
    url: '/system/selectSystemByName',
    method: 'get',
    params: data
  })
}

/**
 * 更新系统配置
 * @param data
 * @returns {AxiosPromise}
 */
export function updateSystemById(data) {
  return request({
    url: '/system/updateSystemById',
    method: 'post',
    data
  })
}
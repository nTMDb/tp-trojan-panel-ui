import request from '@/utils/request'

/**
 * 系统是否开放注册
 * @param data
 * @returns {AxiosPromise}
 */
export function setting(data) {
  return request({
    url: '/auth/setting',
    method: 'get',
    params: data
  })
}

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

/**
 * 上传静态网站文件
 * @param data
 * @returns {AxiosPromise}
 */
export function uploadWebFile(data) {
  return request({
    url: '/system/uploadWebFile',
    method: 'post',
    data
  })
}

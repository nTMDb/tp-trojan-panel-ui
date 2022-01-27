import request from '@/utils/request'

/**
 * 查看状态
 * @param data
 * @returns {AxiosPromise}
 */
export function status(data) {
  return request({
    url: '/trojan/status',
    method: 'get',
    params: data
  })
}

/**
 * 重启
 * @param data
 * @returns {AxiosPromise}
 */
export function restart(data) {
  return request({
    url: '/trojan/restart',
    method: 'post',
    data
  })
}

/**
 * 查看状态
 * @param data
 * @returns {AxiosPromise}
 */
export function stop(data) {
  return request({
    url: '/trojan/stop',
    method: 'post',
    data
  })
}

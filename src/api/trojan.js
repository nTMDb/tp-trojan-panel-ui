import request from '@/utils/request'

/**
 * 查看状态
 * @param data
 * @returns {AxiosPromise}
 */
export function trojanGFWStatus(data) {
  return request({
    url: '/trojan-gfw/status',
    method: 'get',
    params: data
  })
}

/**
 * 重启
 * @param data
 * @returns {AxiosPromise}
 */
export function trojanGFWRestart(data) {
  return request({
    url: '/trojan-gfw/restart',
    method: 'post',
    data
  })
}

/**
 * 查看状态
 * @param data
 * @returns {AxiosPromise}
 */
export function trojanGFWStop(data) {
  return request({
    url: '/trojan-gfw/stop',
    method: 'post',
    data
  })
}

/**
 * 查看状态
 * @param data
 * @returns {AxiosPromise}
 */
export function trojanGOStatus(data) {
  return request({
    url: '/trojan-go/status',
    method: 'get',
    params: data
  })
}

/**
 * 重启
 * @param data
 * @returns {AxiosPromise}
 */
export function trojanGORestart(data) {
  return request({
    url: '/trojan-go/restart',
    method: 'post',
    data
  })
}

/**
 * 查看状态
 * @param data
 * @returns {AxiosPromise}
 */
export function trojanGOStop(data) {
  return request({
    url: '/trojan-go/stop',
    method: 'post',
    data
  })
}

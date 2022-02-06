import request from '@/utils/request'

/**
 * 仪表板
 * @param data
 * @returns {AxiosPromise}
 */
export function panelGroup(data) {
  return request({
    url: '/dashboard/panelGroup',
    method: 'get',
    params: data
  })
}
import request from '@/utils/request'

/**
 * 仪表板
 * @param data
 * @returns
 */
export function panelGroup(data) {
  return request({
    url: '/dashboard/panelGroup',
    method: 'get',
    params: data
  })
}

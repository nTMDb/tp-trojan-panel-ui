import request from '@/utils/request'

/**
 * 分页查询黑名单
 * @param data
 * @returns
 */
export function selectBlackListPage(data) {
  return request({
    url: '/emailRecord/selectEmailRecordPage',
    method: 'get',
    params: data
  })
}

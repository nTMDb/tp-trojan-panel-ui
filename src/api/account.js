import request from '@/utils/request'

/**
 * 登录
 * @param data
 * @returns
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 注册账户
 * @param data
 * @returns
 */
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

/**
 * 注册账户
 * @param data
 * @returns
 */
export function logout(data) {
  return request({
    url: '/account/logout',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @returns
 */
export function getAccountInfo() {
  return request({
    url: '/account/getAccountInfo',
    method: 'get'
  })
}

/**
 * 分页查询账户
 * @param data
 * @returns
 */
export function selectAccountPage(data) {
  return request({
    url: '/account/selectAccountPage',
    method: 'get',
    params: data
  })
}

/**
 * 通过id删除账户
 * @param data
 * @returns
 */
export function deleteAccountById(data) {
  return request({
    url: '/account/deleteAccountById',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param data
 * @returns
 */
export function updateAccountProfile(data) {
  return request({
    url: '/account/updateAccountProfile',
    method: 'post',
    data
  })
}

/**
 * 查询单个账户
 * @param data
 * @returns
 */
export function selectAccountById(data) {
  return request({
    url: '/account/selectAccountById',
    method: 'get',
    params: data
  })
}

/**
 * 创建账户
 * @param data
 * @returns
 */
export function createAccount(data) {
  return request({
    url: '/account/createAccount',
    method: 'post',
    data
  })
}

/**
 * 修改账户
 * @param data
 * @returns
 */
export function updateAccountById(data) {
  return request({
    url: '/account/updateAccountById',
    method: 'post',
    data
  })
}

/**
 * 获取Clash订阅地址
 * @param data
 * @returns
 */
export function clashSubscribe() {
  return request({
    url: '/account/clashSubscribe/',
    method: 'get'
  })
}

/**
 * 重设下载和上传流量
 * @param data
 * @returns
 */
export function resetAccountDownloadAndUpload(data) {
  return request({
    url: '/account/resetAccountDownloadAndUpload',
    method: 'post',
    data
  })
}

/**
 * 导出用户
 * @param data
 * @returns {*}
 */
export function exportAccount(data) {
  return request({
    url: '/account/exportAccount',
    method: 'post',
    data
  })
}

/**
 * 导入用户
 * @param data
 * @returns {*}
 */
export function importAccount(data) {
  return request({
    url: '/account/importAccount',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

/**
 * 登录
 * @param data
 * @returns {AxiosPromise}
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
 * @returns {AxiosPromise}
 */
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @returns {AxiosPromise}
 */
export function getInfo() {
  return request({
    url: '/users/getUserInfo',
    method: 'get'
  })
}

/**
 * 分页查询账户
 * @param data
 * @returns {AxiosPromise}
 */
export function selectUserPage(data) {
  return request({
    url: '/users/selectUserPage',
    method: 'get',
    params: data
  })
}

/**
 * 通过id删除账户
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteUserById(data) {
  return request({
    url: '/users/deleteUserById',
    method: 'post',
    data
  })
}

/**
 * 修改密码
 * @param data
 * @returns {AxiosPromise}
 */
export function updateUserPassByUsername(data) {
  return request({
    url: '/users/updateUserPassByUsername',
    method: 'post',
    data
  })
}

/**
 * 查询单个账户
 * @param data
 * @returns {AxiosPromise}
 */
export function selectUserById(data) {
  return request({
    url: '/users/selectUserById',
    method: 'get',
    params: data
  })
}

/**
 * 创建账户
 * @param data
 * @returns {AxiosPromise}
 */
export function createUser(data) {
  return request({
    url: '/users/createUser',
    method: 'post',
    data
  })
}

/**
 * 修改账户
 * @param data
 * @returns {AxiosPromise}
 */
export function updateUserById(data) {
  return request({
    url: '/users/updateUserById',
    method: 'post',
    data
  })
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 验证用户名>=6个字符
 * @param str
 * @returns {boolean}
 */
export function validUsername(str) {
  return str.length >= 6
}

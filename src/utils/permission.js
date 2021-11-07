/**
 * 1/系统管理员
 * 2/管理员
 * @type {number[]}
 */
const admin = [1, 2]

export function isAdmin() {
  return admin.includes(this.$store.getters.role)
}

export function isSysAdmin() {
  return this.$store.getters.role === 1
}

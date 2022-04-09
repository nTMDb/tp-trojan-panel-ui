import store from '@/store'

export function checkSysadmin() {
  return store.getters.roleNames.includes('sysadmin')
}

export function checkAdmin() {
  return store.getters.roleNames.includes('admin')
}

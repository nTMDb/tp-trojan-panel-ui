import store from '@/store'

export function checkSysadmin() {
  return store.getters.roleNames.includes('sysadmin')
}

export function checkAdmin() {
  console.log(store.getters.roleNames)
  return store.getters.roleNames.includes('admin')
}

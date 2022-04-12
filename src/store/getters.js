const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.users.token,
  username: (state) => state.users.username,
  avatar: (state) => state.users.avatar,
  roleNames: (state) => state.users.roleNames,
  menuList: (state) => state.users.menuList,
  isSysadmin: (state) => state.users.roleNames.includes('sysadmin'),
  isAdmin: (state) => state.users.roleNames.includes('admin')
}
export default getters

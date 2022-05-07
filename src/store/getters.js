const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.users.token,
  username: (state) => state.users.username,
  avatar: (state) => state.users.avatar,
  roles: (state) => state.users.roles,
  menuList: (state) => state.users.menuList,
  routes: (state) => state.permission.routes,
  isSysadmin: (state) => state.users.roles.includes('sysadmin'),
  isAdmin: (state) => state.users.roles.includes('admin')
}
export default getters

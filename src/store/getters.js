const getters = {
  sidebar: (state) => state.app.sidebar,
  language: (state) => state.app.language,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.users.token,
  avatar: (state) => state.users.avatar,
  username: (state) => state.users.username,
  roles: (state) => state.users.roles,
  permission_routes: (state) => state.permission.routes,
  isSysadmin: (state) => state.users.roles.includes('sysadmin'),
  isAdmin: (state) => state.users.roles.includes('admin')
}
export default getters

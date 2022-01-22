const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.users.token,
  id: (state) => state.users.id,
  username: (state) => state.users.username,
  avatar: (state) => state.users.avatar,
  roleId: (state) => state.users.roleId,
  menu: (state) => state.users.menu
}
export default getters

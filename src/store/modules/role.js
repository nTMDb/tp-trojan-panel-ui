import { selectRoleList } from '@/api/role'

const getDefaultState = () => {
  return {
    roles: []
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  setRoles({ commit }) {
    return new Promise((resolve, reject) => {
      selectRoleList()
        .then((response) => {
          const { data } = response
          commit('SET_ROLES', data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

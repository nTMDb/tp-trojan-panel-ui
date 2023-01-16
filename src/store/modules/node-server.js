const getDefaultState = () => {
  return {
    id: undefined
  }
}

const state = getDefaultState()

const mutations = {
  SET_ID: (state, id) => {
    state.id = id
  }
}

const actions = {
  setNodeServer({ commit }, nodeServer) {
    const { id } = nodeServer
    commit('SET_ID', id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

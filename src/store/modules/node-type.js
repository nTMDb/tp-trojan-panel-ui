import { selectNodeTypeList } from '@/api/node-type'

const getDefaultState = () => {
  return {
    nodeTypes: []
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_NODE_TYPES: (state, nodeTypes) => {
    state.nodeTypes = nodeTypes
  }
}

const actions = {
  setNodeTypes({ commit }) {
    return new Promise((resolve, reject) => {
      selectNodeTypeList()
        .then((response) => {
          const { data } = response
          commit('SET_NODE_TYPES', data)
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

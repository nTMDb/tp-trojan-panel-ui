import { getInfo, login, register } from '@/api/users'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: undefined,
    username: '', // 用户名
    avatar: '', // 头像
    roleNames: [], // 角色,
    menuList: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = 'Bearer ' + token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ROLE_NAMES: (state, roleNames) => {
    state.roleNames = roleNames
  },
  SET_MENU_LIST: (state, menuList) => {
    state.menuList = menuList
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, pass } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), pass: pass })
        .then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken('Bearer ' + data.token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user register
  register({ commit }, userInfo) {
    const { username, pass } = userInfo
    return new Promise((resolve, reject) => {
      register({ username: username.trim(), pass: pass.trim() })
        .then((response) => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((response) => {
          const { data } = response

          if (!data) {
            return reject('认证失败，请重新登录！')
          }

          const { id, username, roleNames, menuList } = data

          commit('SET_ID', id)
          commit('SET_USERNAME', username)
          commit('SET_ROLE_NAMES', roleNames)
          commit('SET_MENU_LIST', menuList)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

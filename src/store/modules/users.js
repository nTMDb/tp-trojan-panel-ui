import { getUserInfo, login, register } from '@/api/users'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    avatar: '', // 头像
    username: '', // 用户名
    roles: [] // 角色
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
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
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
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then((response) => {
          const { data } = response

          if (!data) {
            return reject('认证失败，请重新登录！')
          }

          const { username, roles } = data

          commit('SET_USERNAME', username)
          commit('SET_ROLES', roles)
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

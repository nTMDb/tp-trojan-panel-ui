import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import users from './modules/users'
import nodeType from './modules/node-type'
import role from '@/store/modules/role'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    users,
    nodeType,
    role
  },
  getters
})

export default store

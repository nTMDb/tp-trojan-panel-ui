import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import settings from '@/store/modules/settings'
import app from '@/store/modules/app'
import account from '@/store/modules/account'
import permission from '@/store/modules/permission'
import tagsView from '@/store/modules/tagsView'
import nodeServer from "@/store/modules/node-server";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    tagsView,
    account,
    nodeServer,
    permission
  },
  getters
})

export default store

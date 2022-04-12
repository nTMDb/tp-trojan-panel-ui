import Vue from 'vue'
import Vuex from 'vuex'
import permission from "@/store/modules/permission";
import app from "@/store/modules/app";
import settings from "@/store/modules/settings";
import users from "@/store/modules/users";
import getters from "@/store/getters";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    users
  },
  getters
})

export default store

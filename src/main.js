import Vue from 'vue'

import VueClipboard from 'vue-clipboard2'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import '@/styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import App from './App'
import store from '@/store'
import router from '@/router'

import '@/icons'
import '@/permission'

Vue.use(VueClipboard)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import '@/styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import App from './App'
import store from '@/store'
import router from '@/router'
import Cookies from 'js-cookie'
import enLang from 'element-ui/lib/locale/lang/en' // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/icons'
import '@/permission'

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'small', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

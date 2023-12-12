import Vue from 'vue'

import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission'

import * as filters from './filters' // global filters
import MyTable from '@/components/MyTable/index.vue'
import Pagination from '@/components/Pagination/index.vue'
Vue.component('MyTable', MyTable)
Vue.component('Pagination', Pagination)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium',
  // locale: enLang // 如果使用中文，无需设置，请删除
})

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

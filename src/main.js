// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './app.vue'
import router from './router'
import store from './store'

import IScroll from 'iscroll'
window.IScroll = IScroll

Vue.config.productionTip = false

Vue.use(Vuex)
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

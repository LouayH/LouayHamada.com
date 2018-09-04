import Vue from 'vue'
import Router from 'vue-router'
import welcome from './components/welcome'
import contact from './components/contact-me'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: welcome
    },
    {
      path: '/contact-me',
      name: 'contact',
      component: contact
    }
  ]
})

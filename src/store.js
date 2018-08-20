import Vue from 'vue'
import Vuex from 'vuex'
import content from './assets/content.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    content: content
  },
  mutations: {
    content (state, payload) {
      state.content[payload.prop] = payload.data
    }
  },
  actions: {
    content ({commit}, payload) {
      commit('content', payload)
    }
  },
  getters: {
    content: state => {
      return state.content
    }
  }
})

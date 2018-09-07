import Vue from 'vue'
import Vuex from 'vuex'
import content from './assets/content.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    content: content,
    contactInfo: {
      name: null,
      email: null,
      subject: null,
      budget: null,
      deadline: null,
      text: null
    },
    fold: {}
  },
  mutations: {
    content (state, payload) {
      state.content[payload.prop] = payload.data
    },
    contactInfo (state, payload) {
      if (!payload.prop) {
        state.contactInfo = payload.data
      } else {
        state.contactInfo[payload.prop] = payload.data
      }
    },
    fold (state, payload) {
      Vue.set(state.fold, payload.prop, payload.data)
    }
  },
  actions: {
    content ({commit}, payload) {
      commit('content', payload)
    },
    contactInfo ({commit}, payload) {
      commit('contactInfo', payload)
    },
    fold ({commit}, payload) {
      commit('fold', payload)
    }
  },
  getters: {
    content: state => {
      return state.content
    },
    contactInfo: state => {
      return state.contactInfo
    },
    fold: state => {
      return state.fold
    }
  }
})

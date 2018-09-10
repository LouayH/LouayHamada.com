import Vue from 'vue'
import { directive as onClickaway } from 'vue-clickaway'

Vue.component('Handle', {
  props: ['title'],
  template: `
    <router-link :id="getTitle" :to="getTitle" exact>
      {{ title }}.json <i @click="close(getTitle, $event)"></i>
    </router-link>
  `,
  computed: {
    getTitle () { return this.title }
  },
  methods: {
    close (route, event) { event.preventDefault(); this.$parent.removeHandle(route) }
  }
})

let activeTab = (function () {
  let stateKey
  let eventKey
  let keys = {
    hidden: 'visibilitychange',
    webkitHidden: 'webkitvisibilitychange',
    mozHidden: 'mozvisibilitychange',
    msHidden: 'msvisibilitychange'
  }
  for (stateKey in keys) {
    if (stateKey in document) { eventKey = keys[stateKey]; break }
  }
  return function (c) {
    if (c) { document.addEventListener(eventKey, c) }
    return !document[stateKey]
  }
})()

export default {
  name: 'app',
  data () {
    return {
      MobileMenuButton: 0,
      activeTab: activeTab,
      handles: [],
      typed: 0
    }
  },
  directives: {
    onClickaway: onClickaway
  },
  methods: {
    showMobileMenu () {
      document.querySelector('aside').classList.add('mobile-menu')
      document.querySelector('article#content').classList.add('mobile-position')
      window.myScroll.disable()
      this.MobileMenuButton = 1
    },
    hideMobileMenu () {
      if (!this.MobileMenuButton && document.querySelector('aside.mobile-menu')) {
        document.querySelector('aside').classList.remove('mobile-menu')
        document.querySelector('article#content').classList.remove('mobile-position')
        window.myScroll.enable()
      }
      if (this.MobileMenuButton) { this.MobileMenuButton = 0 }
    },
    iScroll () {
      // eslint-disable-next-line
      window.myScroll = new IScroll('#wrapper', {
        click: true,
        scrollbars: 'custom',
        mouseWheel: true,
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        scrollX: true
      })
    },
    resetHeight () {
      if (document.querySelector('#typed')) {
        document.querySelector('.lines').style.height = `${document.querySelector('#typed').clientHeight}px`
      } else if (document.querySelector('#contact')) {
        document.querySelector('.lines').style.height = `${document.querySelector('#contact').clientHeight}px`
      }
      if (document.querySelector('.lines_number')) {
        document.querySelector('.lines_number').style.height = `${document.querySelector('.lines').clientHeight}px`
      }
      window.myScroll.refresh()
    },
    addHandle (router) {
      this.iScroll()
      if (this.handles.indexOf(router) === -1) { this.handles.push(router) }
      var scrollTo = this.handles.indexOf(router) * 210 // 210 width of handle
      document.querySelector('article#content header').animate({scrollLeft: scrollTo}, 100)
    },
    removeHandle (router) {
      if (router) {
        this.handles.splice(this.handles.indexOf(router), 1)
        if (this.handles.length === 0) { this.$router.replace('/') } else {
          if (this.$router.app.$route.path.substr(1) === router) {
            this.$router.replace('/' + this.handles[0])
          }
        }
      } else { this.handles = [] }
    },
    toggleExpand (currentTarget, component) {
      let button = currentTarget.querySelector('button')

      if (button.innerHTML === '+') {
        document.querySelectorAll('button.toggleExpand').forEach((element) => {
          element.innerHTML = '+'
        })
        button.innerHTML = '-'

        document.querySelectorAll('.fold').forEach((element) => {
          element.style.display = 'none'
        })

        currentTarget.nextElementSibling.style.display = 'block'

        document.querySelectorAll('.lines_number .line:not(.freeze)').forEach((element) => {
          element.style.display = 'none'
        })

        document.querySelectorAll('.lines_number .line.' + button.id).forEach((element) => {
          element.style.display = 'block'
        })

        this.$store.dispatch('fold', { prop: component, data: button.id })
      } else {
        button.innerHTML = '+'
        currentTarget.nextElementSibling.style.display = 'none'

        document.querySelectorAll('.lines_number .line.' + button.id).forEach((element, i) => {
          element.style.display = 'none'

          if (i === 0) {
            element.style.display = 'block'
          }
        })
        this.$store.dispatch('fold', { prop: component, data: '' })
      }

      window.myScroll.refresh()
    },
    expandNode (id) {
      let button = document.querySelector('#' + id)
      if (button.innerHTML === '+') {
        document.querySelectorAll('button.toggleExpand').forEach((element) => {
          element.innerHTML = '+'
        })
        button.innerHTML = '-'

        document.querySelectorAll('.fold').forEach((element) => {
          element.style.display = 'none'
        })

        button.parentElement.parentElement.nextElementSibling.style.display = 'block'

        this.$nextTick(() => {
          document.querySelectorAll('.lines_number .line:not(.freeze)').forEach((element) => {
            element.style.display = 'none'
          })

          document.querySelectorAll('.lines_number .line.' + button.id).forEach((element) => {
            element.style.display = 'block'
          })
          window.myScroll.refresh()
        })
      }
    }
  }
}

function isPassive () {
  var supportsPassiveOption = false
  try {
    addEventListener('test', null, Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassiveOption = true
      }
    }))
  } catch (e) {}
  return supportsPassiveOption
}

function touchTriggred (event) {
  let ignore = document.getElementById('handlers')
  var target = event.target
  if (target === ignore || ignore.contains(target)) { } else { event.preventDefault() }
}

(function () {
  document.addEventListener('touchmove', touchTriggred, isPassive() ? {
    capture: false,
    passive: false
  } : false)
})()

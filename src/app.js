import Vue from 'vue'
import { directive as onClickaway } from 'vue-clickaway'

Vue.component('Handle', {
  props: ['title'],
  template: `
    <router-link :id="getTitle" :to="getTitle" exact>
      {{ title }}.php <i @click="close(getTitle, $event)"></i>
    </router-link>
  `,
  computed: {
    getTitle () { return this.title }
  },
  methods: {
    close (route, event) { event.preventDefault(); this.$parent.removeHandle(route) }
  }
})

export default {
  name: 'app',
  data () {
    return {
      MobileMenuButton: 0,
      handles: []
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

var ignore = document.getElementById('handlers')
function touchTriggred (event) {
  var target = event.target
  if (target === ignore || ignore.contains(target)) { } else { event.preventDefault() }
}

(function () {
  document.addEventListener('touchmove', touchTriggred, isPassive() ? {
    capture: false,
    passive: false
  } : false)
})()

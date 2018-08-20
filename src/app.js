import { directive as onClickaway } from 'vue-clickaway'

export default {
  name: 'app',
  data () {
    return {
      MobileMenuButton: 0
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

(function () {
  document.addEventListener('touchmove', function (e) { e.preventDefault() }, isPassive() ? {
    capture: false,
    passive: false
  } : false)
})()

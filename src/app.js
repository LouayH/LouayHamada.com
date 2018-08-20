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
      this.MobileMenuButton = 1
    },
    hideMobileMenu () {
      if (!this.MobileMenuButton && document.querySelector('aside.mobile-menu')) {
        document.querySelector('aside').classList.remove('mobile-menu')
        document.querySelector('article#content').classList.remove('mobile-position')
      }
      if (this.MobileMenuButton) { this.MobileMenuButton = 0 }
    }
  }
}

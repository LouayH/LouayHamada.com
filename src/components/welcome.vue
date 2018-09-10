<template>
  <div id="wrapper" class="no-handler">
    <div id="scroller">
      <div class="lines_number auto-height">
        <div v-for="line in 99" :key="line" class="line">{{ line }}</div>
      </div>
      <div class="lines">
        <div id="typed" @click="checkRouter($event)">
          <span id="beforeTimer"></span>
          <span class="timer" v-if="startTimer"> {{ timer | toFixed }} </span>
          <span id="afterTimer"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Typed from 'typed.js'
  export default {
    data () {
      return {
        startTimer: 0,
        timer: 31
      }
    },
    computed: {
      content () {
        return this.$store.getters.content.welcome
      }
    },
    mounted () {
      let route = this
      let parent = this.$parent
      parent.iScroll()
      parent.removeHandle()

      let timer = setInterval(function () {
        parent.resetHeight()
        if (parent.activeTab() && route.startTimer && route.timer > 0.02) {
          route.timer = route.timer - 0.01
        }
        if (parent.typed) { clearInterval(timer) }
      }, 10)

      if (parent.typed === 0) {
        let timerStrings = this.content.split('###')
        let afterTimer = new Typed('#afterTimer', {
          strings: [timerStrings[1]],
          typeSpeed: 10,
          onComplete: function () {
            if (document.querySelector('#beforeTimer')) {
              document.querySelector('#beforeTimer > .timer').replaceWith('...')
              document.querySelector('#typed > .timer').remove()
              document.querySelector('#afterTimer > .timer').remove()
              route.$store.dispatch('content', { prop: 'welcome', data: document.querySelector('#typed').innerHTML })
              parent.typed = 1
              route.startTimer = 0
              parent.resetHeight()
            }
          }
        })
        document.querySelector('#afterTimer + .typed-cursor').style.visibility = 'hidden'
        afterTimer.stop()

        // eslint-disable-next-line
        let beforeTimer = new Typed('#beforeTimer', {
          strings: [timerStrings[0]],
          startDelay: 2000,
          typeSpeed: 10,
          onComplete: function () {
            route.startTimer = 1
            if (document.querySelector('#beforeTimer + .typed-cursor')) {
              document.querySelector('#beforeTimer + .typed-cursor').remove()
            }
            if (document.querySelector('#afterTimer + .typed-cursor')) {
              document.querySelector('#afterTimer + .typed-cursor').style.visibility = 'visible'
            }
            afterTimer.start()
          }
        })
      } else {
        document.querySelector('#typed').innerHTML = this.content
        parent.resetHeight()
      }

      window.addEventListener('resize', function () {
        setTimeout(function () { parent.resetHeight() }, 100)
      })
    },
    filters: {
      toFixed (timer) {
        return timer.toFixed(0)
      }
    },
    methods: {
      checkRouter (e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('router-link')) {
          e.preventDefault()
          this.$router.push(e.target.getAttribute('router-link'))
        }
      }
    }
  }
</script>

<template>
  <div id="wrapper">
    <div id="scroller">
      <div class="lines_number">
        <div v-for="(line, i) in lines" :key="i" class="line" :class="[line]">{{ i + 1 }}</div>
      </div>
      <div class="lines">
        <span class="line"><span class="selector">{</span><span class="comment"> // Who am I?</span></span>
        <span class="line tab" v-for="(section, key, i) in content" :key="i" v-if="typeof section === 'string'">{{ key }}: <span class="selector">"</span><span class="value">{{ section }}</span><span class="selector">"</span><span class="selector" v-if="i < Object.keys(content).length - 1">,</span></span>
        <div v-else>
          <span class="line tab" @click="$parent.toggleExpand($event.currentTarget, 'about')" v-if="Array.isArray(section)">{{ key }}: <span class="selector">[<span v-if="fold.about !== key.toLowerCase()">...<span class="selector">]</span><span class="selector" v-if="i < Object.keys(content).length - 1">,</span></span><span v-else><span class="comment"> // How can I help you?</span></span><button :id="key.toLowerCase()" class="toggleExpand">+</button></span></span>
          <span class="line tab" @click="$parent.toggleExpand($event.currentTarget, 'about')" v-else>{{ key }}: <span class="selector">{<span v-if="fold.about !== key.toLowerCase()">...<span class="selector">}</span><span class="selector" v-if="i < Object.keys(content).length - 1">,</span></span><span v-else><span class="comment"> // What techniques do I use?</span></span><button :id="key.toLowerCase()" class="toggleExpand">+</button></span></span>
          <div class="fold" v-if="Array.isArray(section)">
            <span class="line dtab" v-for="(item, i) in section" :key="i"><span class="selector">"</span><span class="value">{{ item }}</span><span class="selector">"</span><span class="selector" v-if="i < section.length - 1">,</span></span>
            <span class="line tab"><span class="selector">]</span><span class="selector" v-if="i < Object.keys(content).length - 1">,</span></span>
          </div>
          <div class="fold" v-else>
            <div v-for="(item, key, i) in section" :key="i">
              <span class="line dtab"><span class="selector">"</span><span class="value">{{ key }}</span><span class="selector">"</span>: <span class="selector">[</span></span>
              <span class="line ttab" v-for="(skill, i) in item" :key="i"><span class="selector">"</span><span class="value">{{ skill }}</span><span class="selector">"</span><span class="selector" v-if="i < item.length - 1">,</span></span>
              <span class="line dtab"><span class="selector">]</span><span class="selector" v-if="i < Object.keys(section).length - 1">,</span></span>
            </div>
            <span class="line tab"><span class="selector">}</span><span class="selector" v-if="i < Object.keys(content).length - 1">,</span></span>
          </div>
        </div>
        <span class="line"><span class="selector">}</span></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        lines: ['freeze'],
        classes: []
      }
    },
    computed: {
      content () {
        return this.$store.getters.content.bio
      },
      fold () {
        return this.$store.getters.fold
      }
    },
    mounted () {
      let route = this
      let parent = this.$parent
      parent.addHandle('about-me')
      Object.keys(this.content).forEach((section, i) => {
        route.classes.push(section)
        route.lines.push(section)
        if (typeof this.content[section] !== 'string') {
          if (Array.isArray(this.content[section])) {
            this.content[section].forEach((item) => {
              route.lines.push(section)
            })
            route.lines.push(section) // ] line
          } else {
            Object.keys(this.content[section]).forEach((item) => {
              route.lines.push(section) // { line
              this.content[section][item].forEach((item) => {
                route.lines.push(section)
              })
              route.lines.push(section) // } line
            })
            route.lines.push(section) // } line
          }
        }
      })
      route.lines.push('freeze') // Last line

      this.$nextTick(() => {
        if (this.fold.about) { parent.expandNode(this.fold.about) }
        route.classes.forEach((value) => {
          document.querySelectorAll('.lines_number .line.' + value).forEach((line, i) => {
            line.style.display = 'none'
            if (i === 0) {
              line.classList.add('freeze')
              line.style.display = 'block'
            }
          })
        })
        window.myScroll.refresh()
      })
    }
  }
</script>

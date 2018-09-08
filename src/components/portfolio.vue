<template>
  <div id="wrapper">
    <div id="scroller">
      <div class="lines_number">
        <div v-for="(line, i) in lines" :key="i" class="line" :class="[line]">{{ i + 1 }}</div>
      </div>
      <div class="lines">
        <span class="line"><span class="selector">[</span><span class="comment"> // Projects I worked on</span></span>
        <div v-for="(project, i) in content" :key="i">
          <span class="line tab" @click="$parent.toggleExpand($event.currentTarget, 'portfolio')"><span class="selector">"</span><span class="value">{{ project.id }}</span><span class="selector">"</span>: <span class="selector">{<span v-if="fold.portfolio !== project.id.toLowerCase().replace(/\s/g, '')">...<span class="selector">}</span><span class="selector" v-if="i < Object.keys(content).length - 1">, </span></span><button :id="project.id.toLowerCase().replace(/\s/g, '')" class="toggleExpand">+</button></span></span>
          <div class="fold">
            <span class="line dtab" v-for="(value, key, i) in project" :key="i" v-if="typeof value === 'string' && key != 'id'"><span class="selector">"</span>{{ key }}<span class="selector">"</span>: <span class="selector">"</span><span class="value"><a :href="'http://' + value" target="_blank" v-if="key === 'url'">{{ value }}</a><span v-else>{{ value }}</span></span><span class="selector">"</span><span class="selector">,</span></span>
            <span class="line dtab" v-if="project.built.length-1 != 0"><span class="selector">"</span>built<span class="selector">"</span>: <span class="selector">["</span><span class="value" v-for="(skill, i) in project.built" :key="i">{{ skill }}<span class="selector" v-if="i < project.built.length-1">", "</span></span><span class="selector">"],</span></span>
            <span class="line dtab" v-if="project.gallery.length-1 != 0"><span class="selector">"</span>gallery<span class="selector">"</span>: <!--
              --><span class="selector">["</span><!--
              --><div class="portfolio-gallery" itemscope itemtype="http://schema.org/ImageGallery"><!--
              --><figure v-for="(img, i) in project.gallery" :key="i" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
                  <a :href="'/static/images/' + project.id.toLowerCase().replace(/\s/g, '') + '/' + img" itemprop="contentUrl" data-size="1349x645">
                    <img />
                  </a>
                  <figcaption itemprop="caption description">{{ img }}</figcaption><!--
                  --><span class="selector" v-if="i < project.gallery.length-1">", "</span>
                  </figure><!--
              --></div><!--
              --><span class="selector">"]</span>
            </span>
            <span class="line tab"><span class="selector">}</span><span class="selector" v-if="i < Object.keys(content).length - 1">,</span></span>
          </div>
        </div>
        <span class="line"><span class="selector">]</span></span>
      </div>
    </div>
  </div>
</template>
<script>
  // eslint-disable-next-line
  import * as PScss from '../../node_modules/photoswipe/dist/photoswipe.css'
  // eslint-disable-next-line
  import * as PSskin from '../../node_modules/photoswipe/dist/default-skin/default-skin.css'
  // eslint-disable-next-line
  const PhotoSwipe = require('photoswipe')
  // eslint-disable-next-line
  const PhotoSwipeUI_Default = require('photoswipe/dist/photoswipe-ui-default')
  // eslint-disable-next-line
  let initPhotoSwipeFromDOM = function (gallerySelector) {
    let parseThumbnailElements = function (el) {
      let thumbElements = el.childNodes
      let numNodes = thumbElements.length
      let items = []
      let figureEl
      let linkEl
      let size
      let item

      for (let i = 0; i < numNodes; i++) {
        figureEl = thumbElements[i]
        if (figureEl.nodeType !== 1) { continue }
        linkEl = figureEl.children[0]
        size = linkEl.getAttribute('data-size').split('x')
        item = {
          src: linkEl.getAttribute('href'),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10)
        }
        if (figureEl.children.length > 1) {
          item.title = figureEl.children[1].innerHTML
        }
        if (linkEl.children.length > 0) {
          item.msrc = linkEl.children[0].getAttribute('src')
        }
        item.el = figureEl
        items.push(item)
      }
      return items
    }

    let closest = function closest (el, fn) {
      return el && (fn(el) ? el : closest(el.parentNode, fn))
    }

    let onThumbnailsClick = function (e) {
      e = e || window.event
      e.preventDefault ? e.preventDefault() : e.returnValue = false

      let eTarget = e.target || e.srcElement

      let clickedListItem = closest(eTarget, function (el) {
        return (el.tagName && el.tagName.toUpperCase() === 'FIGURE')
      })

      if (!clickedListItem) {
        return
      }

      let clickedGallery = clickedListItem.parentNode
      let childNodes = clickedListItem.parentNode.childNodes
      let numChildNodes = childNodes.length
      let nodeIndex = 0
      let index

      for (let i = 0; i < numChildNodes; i++) {
        if (childNodes[i].nodeType !== 1) {
          continue
        }
        if (childNodes[i] === clickedListItem) {
          index = nodeIndex
          break
        }
        nodeIndex++
      }
      if (index >= 0) {
        openPhotoSwipe(index, clickedGallery)
      }
      return false
    }

    let photoswipeParseHash = function () {
      let hash = window.location.hash.substring(1)
      let params = {}

      if (hash.length < 5) { return params }

      let lets = hash.split('&')
      for (let i = 0; i < lets.length; i++) {
        if (!lets[i]) {
          continue
        }
        let pair = lets[i].split('=')
        if (pair.length < 2) {
          continue
        }
        params[pair[0]] = pair[1]
      }
      if (params.gid) {
        params.gid = parseInt(params.gid, 10)
      }
      return params
    }

    let openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
      let pswpElement = document.querySelectorAll('.pswp')[0]
      let gallery
      let options
      let items
      items = parseThumbnailElements(galleryElement)
      options = {
        galleryUID: galleryElement.getAttribute('data-pswp-uid'),
        getThumbBoundsFn: function (index) {
          let thumbnail = items[index].el.getElementsByTagName('img')[0]
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        }
      }
      if (fromURL) {
        if (options.galleryPIDs) {
          for (let j = 0; j < items.length; j++) {
            if (items[j].pid === index) {
              options.index = j
              break
            }
          }
        } else {
          options.index = parseInt(index, 10) - 1
        }
      } else {
        options.index = parseInt(index, 10)
      }
      if (isNaN(options.index)) {
        return
      }
      if (disableAnimation) {
        options.showAnimationDuration = 0
      }
      gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
      gallery.init()
    }

    let galleryElements = document.querySelectorAll(gallerySelector)
    for (let i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i + 1)
      galleryElements[i].onclick = onThumbnailsClick
    }

    let hashData = photoswipeParseHash()
    if (hashData.pid && hashData.gid) {
      openPhotoSwipe(hashData.pid, galleryElements[ hashData.gid - 1 ], true, true)
    }
  }

  export default {
    data () {
      return {
        lines: ['freeze'],
        classes: []
      }
    },
    computed: {
      content () {
        return this.$store.getters.content.portfolio
      },
      fold () {
        return this.$store.getters.fold
      }
    },
    mounted () {
      var route = this
      var parent = this.$parent
      parent.addHandle('portfolio')

      this.content.forEach((project) => {
        let id = project.id.toLowerCase().replace(/\s/g, '')
        route.classes.push(id)
        route.lines.push(id) // new Project()
        if (project.title) { route.lines.push(id) }
        if (project.description) { route.lines.push(id) }
        if (project.about) { route.lines.push(id) }
        if (project.built.length - 1 !== 0) { route.lines.push(id) }
        if (project.gallery.length - 1) { route.lines.push(id) }
        if (project.url) { route.lines.push(id) }
        route.lines.push(id) // EMPTY line
      })
      route.lines.push('freeze') // Last line

      this.$nextTick(() => {
        if (this.fold.portfolio) { parent.expandNode(this.fold.portfolio) }
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
    },
    updated () {
      initPhotoSwipeFromDOM('.portfolio-gallery')
    }
  }
</script>

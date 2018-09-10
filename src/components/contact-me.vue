<template>
  <div id="wrapper">
    <div id="scroller">
      <div class="lines_number auto-height">
        <div v-for="line in 99" :key="line">{{ line }}</div>
      </div>
      <div class="lines" v-if="content">
        <div id="contact">
          <div class="inherit-width" v-html="content"></div>
          <div class="inherit-width">
            <p class="success"><span>Thank You!</span> Your message just arrived in my inbox. Talk to you soon.</p>
          </div>
          <form @submit.prevent="onSubmit($parent)" class="contact-form" enctype="multipart/form-data">
            <span :class="{line:true, error:errors.name}">Name: <input type="text" name="name" class="input-field" placeholder="..." v-model="contactInfo.name" @keyup="onChange($event)" /></span>
            <span :class="{line:true, error:errors.email}">Email: <input type="text" name="email" class="input-field" placeholder="..." v-model="contactInfo.email" @keyup="onChange($event)" /></span>
            <span :class="{line:true, error:errors.subject}">Subject: <input type="text" name="subject" class="input-field" placeholder="..." v-model="contactInfo.subject" @keyup="onChange($event)" /></span>
            <span class="line">Budget: <input type="text" name="budget" class="input-field" placeholder="..." v-model="contactInfo.budget" /></span>
            <span class="line">Deadline: <input type="text" name="deadline" class="input-field" placeholder="..." v-model="contactInfo.deadline" /></span>
            <span :class="{line:true, multiline:true, error:errors.text}">Message: <textarea name="text" class="input-field" placeholder="..." v-model="contactInfo.text" @keyup="onChange($event)"></textarea></span><span class="autosize"></span>
            <span class="line"></span>
            <span class="line error-message" v-if="errors.form">Oops! Something goes wrong. Please try again later.</span>
            <span class="line"><button type="submit" class="form-submit" v-on-clickaway="blur">Click Here to Send</button></span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import autosize from 'autosize'
  import axios from 'axios'

  export default {
    data () {
      return {
        inputs: ['name', 'email', 'subject', 'budget', 'deadline', 'text'],
        errors: { form: null, name: null, email: null, subject: null, text: null }
      }
    },
    computed: {
      content () {
        return this.$store.getters.content.contact
      },
      contactInfo () {
        return this.$store.getters.contactInfo
      }
    },
    watch: {
      contactInfo: {
        handler () {
          this.$store.dispatch('contactInfo', { prop: null, data: this.contactInfo })
        },
        deep: true
      }
    },
    created () {
      this.$store.dispatch('contactInfo', { prop: 'subject', data: null })
      this.$store.dispatch('contactInfo', { prop: 'budget', data: null })
      this.$store.dispatch('contactInfo', { prop: 'deadline', data: null })
      this.$store.dispatch('contactInfo', { prop: 'text', data: null })
    },
    mounted () {
      let parent = this.$parent
      parent.addHandle('contact-me')

      autosize(document.querySelector('textarea'))
      parent.resetHeight()

      window.addEventListener('resize', function () {
        setTimeout(function () { parent.resetHeight() }, 100)
      })
    },
    updated () {
      let parent = this.$parent
      parent.resetHeight()
    },
    directives: {
      onClickaway: window.onClickaway
    },
    methods: {
      onSubmit (parent) {
        let route = this
        document.querySelector('.form-submit').innerHTML = 'Please Wait'
        document.querySelector('.form-submit').disable = true
        Object.keys(route.errors).forEach(function (key) { route.errors[key] = null })

        axios.post('http://localhost:3000/send', route.contactInfo)
          .then((response) => {
            if (response.status === 200) {
              document.querySelector('form').remove()
              document.querySelector('p.success').style.display = 'block'
              parent.resetHeight()
            }
          })
          .catch((error) => {
            if (error.status === 400) {
              Object.keys(error.response.data).forEach(function (key) { route.errors[key] = error.response.data[key] })
            } else {
              route.errors.form = 1
            }
            document.querySelector('.form-submit').disable = false
            document.querySelector('.form-submit').innerHTML = 'Try Again'
            parent.resetHeight()
          })
      },
      onChange (event) {
        let target = event.target
        let keyCode = event.keyCode
        if (!(keyCode === 9 || keyCode === 16)) {
          if (target.value.length === 0) {
            this.errors[target.name] = '* Required'
          } else { this.errors[target.name] = null }
        }
      },
      blur () {
        let input = event.target.name
        if (this.inputs.indexOf(input) === -1) { document.querySelector('.input-field').blur() }
      }
    }
  }
</script>

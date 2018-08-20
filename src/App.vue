<template>
  <main id="app" class="noselect">
    <aside v-on-clickaway="hideMobileMenu">
      <header>
        <img src="../src/assets/logo.png" alt="">
        <h1>Louay Hamada</h1>
        <br clear="all" />
      </header>
      <nav>
        <ul>
          <router-link tag="li" to="/about-me" exact @click.native="hideMobileMenu">
            <a id="about-me"><i></i><span>About me</span></a>
          </router-link>
          <router-link tag="li" to="/portfolio" @click.native="hideMobileMenu">
            <a id="portfolio"><i></i><span>Portfolio</span></a>
          </router-link>
          <router-link tag="li" to="/contact-me" @click.native="hideMobileMenu">
            <a id="contact-me"><i></i><span>Contact me</span></a>
          </router-link>
        </ul>
      </nav>
      <footer>© {{ (new Date()).getFullYear() }}</footer>
    </aside>
    <article id="content">
      <img class="mobileMenuButton" src="../src/assets/logo.png" @click="showMobileMenu">
      <header id="handlers">
      </header>
      <router-view></router-view>
    </article>
  </main>
</template>

<script src="./app.js"></script>
<style src="./app.scss" lang="scss"></style>

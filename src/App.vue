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
            <a id="about-me"><i></i><span>about-me</span></a>
          </router-link>
          <router-link tag="li" to="/portfolio" @click.native="hideMobileMenu">
            <a id="portfolio"><i></i><span>portfolio</span></a>
          </router-link>
          <router-link tag="li" to="/contact-me" @click.native="hideMobileMenu">
            <a id="contact-me"><i></i><span>contact-me</span></a>
          </router-link>
        </ul>
      </nav>
      <footer>© {{ (new Date()).getFullYear() }}</footer>
    </aside>
    <article id="content">
      <img class="mobileMenuButton" src="../src/assets/logo.png" @click="showMobileMenu">
      <header id="handlers">
        <Handle v-for="handle in handles" :key="handle" :title="handle"></Handle>
      </header>
      <router-view></router-view>
    </article>
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="pswp__bg"></div>
      <div class="pswp__scroll-wrap">
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <div class="pswp__counter"></div>
            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
          </button>
          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
          </button>
          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script src="./app.js"></script>
<style src="./app.scss" lang="scss"></style>

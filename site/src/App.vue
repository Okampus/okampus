<template>
  <div>
    <div
      class="relative flex flex-row filter h-screen w-screen z-1"
      :class="{'brightness-50': showModal}"
    >
      <sidebar
        ref="sidebar"
        :closed="closedSidebar && !uncollapsedSidebar"
        :uncollapsed="uncollapsedSidebar"
        :collapsing="collapsingSidebar"
        @close-side-bar="toggle-side-bar"
      />
      <div
        ref="content"
        :class="{'brightness-50': uncollapsedSidebar && !collapsingSidebar}"
        class="w-full bg-2 h-content flex flex-col relative after-topbar overflow-auto app-scrollbar filter"
      >
        <div
          class="flex-grow-1 flex-shrink-0 flex-auto"
        >
          <router-view />
        </div>
        <page-footer class="flex-shrink-0" />
      </div>
      <topbar
        ref="topbar"
        class="flex fixed top-0 left-0 w-full h-tbar border-bar
      text-1 items-center justify-between border-b bg-1 filter"
        :show-login="showLogin"
        :class="{'brightness-50': uncollapsedSidebar && !collapsingSidebar}"
        @toggle-side-bar="toggle-side-bar"
        @toggle-login="toggle-login"
      />
    </div>
    <div
      v-show="showModal"
      id="global-modal"
      class="fixed top-0 left-0 w-screen h-screen"
      @click="toggleModal"
    />
  </div>
</template>

<script lang="js">
import debounce from 'lodash/debounce'
import PageFooter from '@/components/PageFooter.vue'

import { ref, watch } from 'vue'

import Topbar from '@/components/TopBar.vue'
import Sidebar from '@/components/SideBar.vue'
const breakWidth = 768
export default {
  components: {
    Topbar,
    Sidebar,
    PageFooter
  },
  setup () {
    const sidebar = ref(null)
    const topbar = ref(null)
    const content = ref(null)
    return { sidebar, topbar, content }
  },
  data () {
    const isScreenSmall = () => Math.max(
      document.documentElement.clientWidth ||
        0, window.innerWidth || 0) <= breakWidth

    const checkResize = debounce(() => {
      if (!this.isScreenSmall() && this.smallScreen) {
        this.smallScreen = false

        if (this.uncollapsedSidebar) {
          this.uncollapsedSidebar = false
          this.topbar.$el.removeEventListener('mousedown', this.toggleSideBar)
          this.content.removeEventListener('mousedown', this.toggleSideBar)
        }
        if (this.closedSidebar) {
          this.closedSidebar = false
        }
      } else if (this.isScreenSmall() && !this.smallScreen) {
        this.smallScreen = true
        if (!this.closedSidebar) {
          this.closedSidebar = true
        }
      }
    }, 50)

    return {
      checkResize,
      isScreenSmall,
      closedSidebar: isScreenSmall(),
      uncollapsedSidebar: false,
      collapsingSidebar: false,
      smallScreen: isScreenSmall(),
      showModal: false,
      showLogin: false
    }
  },
  created () {
    document.querySelector(':root').className = this.$store.state.userConfig.theme === 'dark' ? 'dark' : ''
  },
  mounted () {
    watch(() => this.$store.getters['userConfig/getTheme'], (theme) => {
      document.querySelector(':root').className = theme === 'dark' ? 'dark' : ''
    })

    this.emitter.on('login', () => {
      this.toggleLogin()
    })

    this.emitter.on('toggleModal', () => {
      this.toggleModal()
    })

    window.addEventListener('resize', this.checkResize)
  },
  unmounted () {
    window.removeEventListener('resize', this.checkResize)
  },
  methods: {
    toggleModal () {
      this.showModal = !this.showModal
      if (this.showLogin) {
        this.showLogin = false
      }
    },

    toggleSideBar () {
      if (this.smallScreen) {
        if (this.uncollapsedSidebar) {
          this.topbar.$el.removeEventListener('mousedown', this.toggleSideBar)
          this.content.removeEventListener('mousedown', this.toggleSideBar)
          this.collapsingSidebar = true
          this.sidebar.$el.addEventListener('transitionend', () => {
            this.uncollapsedSidebar = false
            this.collapsingSidebar = false
          }, { once: true })
        } else {
          this.uncollapsedSidebar = true
          this.topbar.$el.addEventListener('mousedown', this.toggleSideBar)
          this.content.addEventListener('mousedown', this.toggleSideBar)
        }
      } else {
        this.closedSidebar = !this.closedSidebar
      }
    },
    toggleLogin () {
      if (this.showLogin) {
        this.showLogin = false
        this.showModal = false
      } else {
        if (!this.showModal) {
          this.showModal = true
          this.showLogin = true
        }
      }
    }
  }
}
</script>

<style lang="scss">

@import "@/assets/scss/app.scss";
@import "@/assets/scss/components/button.scss";
@import "@/assets/scss/components/card.scss";
@import "@/assets/scss/components/input.scss";
@import "@/assets/scss/components/tiptap.scss";
@import "@/assets/scss/components/link.scss";
@import "@/assets/scss/sections/hero.scss";
@import "@/assets/scss/core/spacing.scss";
@import "@/assets/scss/core/tab.scss";
@import "@/assets/scss/core/scrollbar.scss";

@font-face {
  font-family: AtkinsonHyperlegible;
  font-weight: 400;
  src: url("@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Regular.ttf") format("truetype");
}

@font-face {
  font-family: AtkinsonHyperlegible;
  font-weight: 800;
  src: url("@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Bold.ttf") format("truetype");
}

* {
  font-family: AtkinsonHyperlegible;
}

html {
  font-size: 14px;
}

@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}
</style>

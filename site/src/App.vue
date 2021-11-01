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
        @closeSidebar="toggleSidebar"
      />
      <div
        ref="content"
        :class="{'brightness-50': uncollapsedSidebar && !collapsingSidebar}"
        class="deep-inner-shadow w-full bg-2 h-content flex flex-col relative top-tbar overflow-auto app-scrollbar filter"
      >
        <div
          class="flex-grow-1 flex-shrink-0 flex-auto"
        >
          <router-view class="my-7 mx-9" />
        </div>
        <page-footer class="flex-shrink-0" />
      </div>
      <topbar
        ref="topbar"
        class="flex fixed top-0 left-0 w-full h-tbar border-bar
      text-1 items-center justify-between border-b bg-1 filter"
        :show-login="showLogin"
        :class="{'brightness-50': uncollapsedSidebar && !collapsingSidebar}"
        @toggleSidebar="toggleSidebar"
        @toggleLogin="toggleLogin"
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

import { defineComponent, watch, ref } from 'vue'

import Topbar from '@/components/Topbar.vue'
import Sidebar from '@/components/Sidebar.vue'
const breakWidth = 1024
export default defineComponent({
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
          this.topbar.$el.removeEventListener('mousedown', this.toggleSidebar)
          this.content.removeEventListener('mousedown', this.toggleSidebar)
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
    if (this.$store.state.userConfig.theme === 'dark') {
      const root = document.querySelector(':root')
      if (!root.classList.contains('dark')) {
        root.classList.add('dark')
      }
    }
  },
  mounted () {
    this.emitter.on('login', () => {
      this.toggleLogin()
    })

    this.emitter.on('toggleModal', () => {
      this.toggleModal()
    })

    watch(() => this.$store.getters['userConfig/getTheme'], (theme) => {
      const root = document.querySelector(':root')
      if (theme === 'dark') {
        if (!root.classList.contains('dark')) {
          root.classList.add('dark')
        }
      } else {
        if (root.classList.contains('dark')) {
          root.classList.remove('dark')
        }
      }
    })

    window.addEventListener('resize', this.checkResize)
  },
  unmounted () {
    window.removeEventListener('resize', this.checkResize)
  },
  methods: {
    toggleModal () {
      this.showModal = !this.showModal
    },

    toggleSidebar () {
      if (this.smallScreen) {
        if (this.uncollapsedSidebar) {
          this.topbar.$el.removeEventListener('mousedown', this.toggleSidebar)
          this.content.removeEventListener('mousedown', this.toggleSidebar)
          this.collapsingSidebar = true
          this.sidebar.$el.addEventListener('transitionend', () => {
            this.uncollapsedSidebar = false
            this.collapsingSidebar = false
          }, { once: true })
        } else {
          this.uncollapsedSidebar = true
          this.topbar.$el.addEventListener('mousedown', this.toggleSidebar)
          this.content.addEventListener('mousedown', this.toggleSidebar)
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
})
</script>

<style lang="scss">

@import "~@/assets/scss/themes.scss";

@import "~@/assets/scss/components/button.scss";
@import "~@/assets/scss/components/card.scss";
@import "~@/assets/scss/components/input.scss";
@import "~@/assets/scss/components/section.scss";

@import "~@/assets/css/constants/spacing.css";

@font-face {
  font-family: AtkinsonHyperlegible;
  font-weight: 400;
  src: url("~@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Regular.ttf") format("truetype");
}

@font-face {
  font-family: AtkinsonHyperlegible;
  font-weight: 800;
  src: url("~@/assets/font/AtkinsonHyperlegible/AtkinsonHyperlegible-Bold.ttf") format("truetype");
}

.deep-inner-shadow::after {
  content: '';
  @apply shadow-inner-deep dark:shadow-dark-inner-deep h-full w-full absolute top-0 left-0 pointer-events-none;
}

* {
  font-family: AtkinsonHyperlegible;
  font-size: 14px;
  transition: color 300ms, box-shadow 300ms, background-color 300ms linear, border-color 300ms, border-radius 300ms, fill 300ms, stroke 300ms, filter 200ms;
}

@media (min-width: 720px) {
  html {
    font-size: 16px;
  }
}
</style>

<template>
  <SlidingSidebar @closeSidebar="sidebarHandler" />

  <div
    id="main-container"
    class="relative flex flex-row filter h-screen w-screen tr-filter z-1"
  >
    <SearchQuery ref="searchQuery" />
    <Topbar
      ref="topbar"
      @launchSearch="launchSearch"
      @updateSearch="updateSearch"
      @openSidebar="sidebarHandler"
    />
    <Sidebar @closeSidebar="sidebarHandler" />
    <div
      id="content-wrapper"
      class="w-full bg-3 h-content flex relative top-tbar bg-gray-100 overflow-hidden"
    >
      <div
        id="content"
        class="p-4 flex-1 overflow-auto app-scrollbar"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'

import Topbar from '@/components/Topbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import SlidingSidebar from '@/components/SlidingSidebar.vue'
import SearchQuery from '@/components/SearchQuery.vue'

// import { getURL } from '@api/api.config'

export default defineComponent({
  components: {
    Topbar,
    Sidebar,
    SlidingSidebar,
    SearchQuery
  },
  data () {
    return {
      showSidebar: false,
      reachedBreak: false,
      breakWidth: 1024
    }
  },
  mounted () {
    window.addEventListener('resize', this.checkResize)
    window.addEventListener('keydown', this.checkKeydown)
    this.checkResize()
  },
  unmounted () {
    window.removeEventListener('resize', this.checkResize)
    window.removeEventListener('keydown', this.checkKeydown)
  },
  methods: {
    checkKeydown (e) {
      if (e.key === 'Escape') {
        if (this.$data.showSidebar) {
          this.sidebarHandler()
        } else if (this.$refs.searchQuery.$data.searchVisible) {
          this.$refs.searchQuery.collapseSearch()
        }
      }
    },
    checkResize () {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      this.$refs.searchQuery.checkResize()
      if (vw > this.$data.breakWidth && !this.$data.reachedBreak) {
        const slideSidebar = document.getElementById('slide-sidebar')
        if (!slideSidebar.classList.contains('-l-sbar')) {
          slideSidebar.classList.add('-l-sbar')
        }

        const mainContainer = document.getElementById('main-container')
        mainContainer.classList.remove('brightness-50')

        this.$data.reachedBreak = true
      } else if (vw <= this.$data.breakWidth && this.$data.reachedBreak) {
        this.$data.reachedBreak = false
      }
    },
    sidebarHandler () {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      const slideSidebar = document.getElementById('slide-sidebar')
      const mainContainer = document.getElementById('main-container')
      if (vw > this.$data.breakWidth && !this.$refs.searchQuery.$data.searchVisible) {
      //   this.$data.showSidebar = false
      } else if (!this.$data.showSidebar) {
        slideSidebar.classList.remove('-l-sbar')
        mainContainer.classList.add('brightness-50')
        this.$data.showSidebar = true
        mainContainer.addEventListener('mousedown', this.sidebarHandler, { once: true })
      } else if (this.$data.showSidebar) {
        slideSidebar.classList.add('-l-sbar')
        mainContainer.classList.remove('brightness-50')
        this.$data.showSidebar = false
        mainContainer.removeEventListener('mousedown', this.sidebarHandler, { once: true })
      }
    },
    updateSearch (e) {
      this.$refs.searchQuery.updateQuery(e)
    },
    launchSearch (e) {
      const input = document.getElementById('search-input')
      this.$refs.searchQuery.launchSearch(input.value)
    }
  }
})
</script>

<style>
@import "~@/assets/css/themes.css";

.icon {
  @apply h-6 float-right pl-6;
}

.tr-filter {
  transition: color 300ms, background-color 300ms linear, border-color 300ms, fill 300ms, stroke 300ms, filter 500ms;
}

* {
  transition: color 300ms, background-color 300ms linear, border-color 300ms, fill 300ms, stroke 300ms;
}

html {
  font-size: 13px;
}

@media (min-width: 720px) {
  html {
    font-size: 15px;
  }
}
</style>

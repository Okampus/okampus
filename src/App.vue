<template>
    <div class="flex flex-column fixed w-screen top-tbar left-0 h-content bg-transparent">
      <div id="expander-filler" class="flex-shrink-0 flex-grow"></div>
      <div id="expander-content" class="flex-shrink flex-grow-0 z-30"></div>
    </div>
    <SlidingSidebar @closeSidebar="sidebarHandler"/>
    <div id="main-container" class="flex flex-row filter h-screen w-screen transition-filter duration-300">
      <Topbar @updateSearch="searchQuery" @openSidebar="sidebarHandler" ref="topbar" />
      <Sidebar @closeSidebar="sidebarHandler"/>
      <div id="content" class="bg-3 h-content flex relative top-tbar bg-gray-100 overflow-hidden transition-filter">
          <div class="p-4 flex-1 overflow-auto app-scrollbar">
              <div class="py-8 shadow text-center rounded-lg mb-10 bg-white" v-for="i in 50" v-bind:key="i">
                CONTENT
              </div>
          </div>
      </div>
    </div>

</template>

<script lang="js">
import { defineComponent } from 'vue'

import Topbar from '@/components/Topbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import SlidingSidebar from '@/components/SlidingSidebar.vue'

// import { getURL } from '@api/api.config'

export default defineComponent({
  data () {
    return {
      showSidebar: false,
      reachedBreak: false,
      searching: false,
      breakWidth: 1024
    }
  },
  methods: {
    sidebarHandler () {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      const slideSidebar = document.getElementById('slide-sidebar')
      // const sidebarTop = document.getElementById('sidebar-top')
      const mainContainer = document.getElementById('main-container')
      // console.log(sidebar, show && !this.$data.showSidebar, !show && this.$data.showSidebar)
      if (vw > this.$data.breakWidth) {
      //   this.$data.showSidebar = false
      } else if (!this.$data.showSidebar) {
        slideSidebar.classList.remove('-l-sbar')
        mainContainer.classList.add('brightness-50')
        // sidebar.classList.remove('lg-max:w-0', 'border-0')
        // sidebar.setAttribute('opened', '')
        // sidebarTop.setAttribute('opened', '')
        this.$data.showSidebar = true
      } else if (this.$data.showSidebar) {
        slideSidebar.classList.add('-l-sbar')
        mainContainer.classList.remove('brightness-50')
        // sidebar.classList.add('lg-max:w-0', 'border-0')
        // sidebar.addEventListener('transitionend', () => {
        //   sidebar.removeAttribute('opened')
        //   sidebarTop.removeAttribute('opened')
        // }, { once: true })

        this.$data.showSidebar = false
      }
    },
    searchQuery (e) {
      // console.log('update', getURL)
      const content = document.querySelector('#expander-content')
      const filler = document.querySelector('#expander-filler')

      // console.log(e)

      if (e) {
        if (!this.$data.searching) {
          this.$data.searching = true
        }
        filler.classList.add('flex-shrink')
        content.classList.add('flex-grow')
        filler.classList.remove('flex-shrink-0')
        content.classList.remove('flex-grow-0')
      } else {
        // console.log('false')
        filler.classList.add('flex-shrink-0')
        content.classList.add('flex-grow-0')
        filler.classList.remove('flex-shrink')
        content.classList.remove('flex-grow')
      }
    }
  },
  components: {
    Topbar,
    Sidebar,
    SlidingSidebar
  },
  mounted () {
    const comp = this
    function checkResize () {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      if (vw > comp.$data.breakWidth && !comp.$data.reachedBreak) {
        const slideSidebar = document.getElementById('slide-sidebar')
        if (!slideSidebar.classList.contains('-l-sbar')) {
          slideSidebar.classList.add('-l-sbar')
        }

        const mainContainer = document.getElementById('main-container')
        if (mainContainer.classList.contains('brightness-50')) {
          mainContainer.classList.remove('brightness-50')
        }
        comp.$data.reachedBreak = true
      } else if (vw <= comp.$data.breakWidth && comp.$data.reachedBreak) {
        comp.$data.reachedBreak = false
      }
    }

    window.addEventListener('resize', checkResize)
    checkResize()
  }
})
</script>

<style>
@import "~@/assets/css/themes.css";

html {
 font-size: 13px
}

@media (min-width:720px) {
 html {
  font-size: 15px
 }
}

#content {
  flex: 1; /*grow*/
  display: flex;
  width: 100%;
  transition: flex var(--expander-transition-time) ease-in-out;
}

#search-expander {
  flex: 0; /*grow*/
  width: 100%;
  transition: flex var(--expander-transition-time) ease-in-out;
  background-color: white;
}
</style>

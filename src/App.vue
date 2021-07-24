<template>
  <div id="main" class="bg-1">
    <topbar id="topbar" v-on:updateSearch="searchQuery" />
    <div id="main-container" class="columns m-0 is-mobile">
      <sidebar id="sidebar" />
      <div id="content-col">
        <span id="content"></span>
        <span id="search-expander"></span>
      </div>
      <!--
        <div id="content-col" class="column p-0">
        <span id="content"></span>
        <span id="search-expander"></span>
      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue'

export default defineComponent({
  methods: {
    searchQuery (e: string) {
      const content = document.querySelector('#content') as HTMLElement
      const expander = document.querySelector('#search-expander') as HTMLElement
      console.log(e)
      if (e) {
        console.log('true')
        content.style.flex = '0'
        expander.style.flex = '1'
      } else {
        console.log('false')
        content.style.flex = '1'
        expander.style.flex = '0'
      }
    }
  },
  components: {
    sidebar: Sidebar,
    topbar: Topbar
  }
})
</script>

<style>
@import "~@/assets/css/themes.css";

html,
body,
#app,
#main {
  overflow-y: auto !important;
  width: 100vw;
  height: 100vh;
}

#main {
  display: flex;
  flex-flow: column;
}

#main #topbar {
  flex: 0 1 auto;
}

#main #main-container {
  flex: 1 1 auto;
}

#content-col {
  width: 100%;
  display: flex; /*flexbox*/
  flex-flow: column;
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

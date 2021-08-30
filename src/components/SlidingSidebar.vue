<template>
    <aside id="slide-sidebar" class="-l-sbar fixed overflow-hidden z-10 flex flex-col h-full w-sbar border bc-2 bg-1 fc-2 whitespace-nowrap transition-spacing duration-300">
      <div id="slide-sidebar-top" class="bg-2 h-tbar flex flex-shrink-0 items-center pl-3">
        <button class="mr-4" aria-label="Open Menu" @click="this.$emit('closeSidebar')">
          <XIcon class="w-10 h-10"/>
        </button>
        <div class="logo w-32 h-6 flex-shrink-0"></div>
      </div>
      <SidebarBase/>
    </aside>
</template>

<script lang="js">
import {
  XIcon
} from '@heroicons/vue/solid'
import { defineComponent } from 'vue'
import SidebarBase from '@/components/SidebarBase.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    XIcon,
    SidebarBase
  }
})
</script>

<style>
#sidebar[opened] {
  @apply lg-max:absolute lg-max:h-screen lg-max:top-0;
}

#sidebar-top:not([opened]) {
  @apply hidden;
}

#sidebar-top[opened] {
  @apply lg:hidden;
}
</style>

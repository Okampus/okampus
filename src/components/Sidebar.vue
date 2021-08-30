<template>
    <aside id="sidebar" class="sticky overflow-hidden z-10 lg-max:w-0 flex flex-col h-content sticky w-sbar top-tbar border bc-2 bg-1 fc-2 whitespace-nowrap transition-width duration-300">
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

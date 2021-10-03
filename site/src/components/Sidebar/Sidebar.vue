<template>
  <aside
    id="sidebar"
    class="sticky overflow-hidden lg-max:w-0 flex flex-col flex-shrink-0 h-content w-sbar top-tbar border bc-2 bg-2 fc-2 whitespace-nowrap tr-width duration-300"
  >
    <SidebarBase />
  </aside>
</template>

<script lang="js">
import {
  XIcon
} from '@heroicons/vue/solid'
import { defineComponent } from 'vue'
import SidebarBase from '@/components/Sidebar/SidebarBase.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    XIcon,
    SidebarBase
  }
})
</script>

<style scoped>
#sidebar[opened] {
  @apply lg-max:absolute lg-max:h-screen lg-max:top-0;
}

#sidebar-top:not([opened]) {
  @apply hidden;
}

#sidebar-top[opened] {
  @apply lg:hidden;
}

.tr-width {
  transition: color 300ms, background-color 300ms linear, border-color 300ms, fill 300ms, stroke 300ms, width 500ms;
}
</style>

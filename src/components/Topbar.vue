<template>
  <nav
    id="topbar" class="flex fixed top-0 left-0 w-full h-tbar bg-2 bc-1 fc-1 items-center justify-between border-b transition-filter"
  >
    <div class="flex flex-shrink-0 px-4 w-sbar items-center justify-center">
      <button class="mr-4" aria-label="Open Menu" @click="this.$emit('openSidebar')">
        <MenuIcon class="h-8 w-8"/>
      </button>
      <div class="logo w-48 h-8 mt-1.5"></div>
    </div>

    <div class="relative bg-transparent flex-grow px-6">
      <span class="absolute inset-y-0 right-0 flex items-center pr-6">
        <button type="submit" class="p-1 w-8 h-8 text-hover-brand transition-colors">
          <DocumentSearchIcon/>
        </button>
      </span>
      <input @input="(e) => this.$emit('updateSearch', e.target.value)" id="test-input" type="text" class="w-full fc-1 placeholder-3 bg-2 p-1.5 pr-10 text-lg border-b-2 bc-alt-1 bc-mouse-brand transition-border" placeholder="Search...">
    </div>

    <div class="flex bg-transparent items-center justify-between">
        <div class="topbar-icon">
          <bellIcon/>
        </div>
        <div class="topbar-icon">
          <folderIcon/>
        </div>
        <div class="topbar-icon">
          <mailIcon/>
        </div>
    </div>

    <label class="switch mr-3 orange" v-on:click="changeTheme">
      <input type="checkbox" />
      <span class="slider round"></span>
    </label>
  </nav>
</template>

<style>
  @import "~@/assets/css/utils/switch.css";

  .topbar-icon {
      @apply mr-6 w-6 h-6;
  }
</style>

<script>
import { DocumentSearchIcon, BellIcon, FolderIcon, MailIcon, MenuIcon } from '@heroicons/vue/solid'

export default {
  components: {
    DocumentSearchIcon,
    MenuIcon,
    bellIcon: BellIcon,
    folderIcon: FolderIcon,
    mailIcon: MailIcon
  },
  methods: {
    log (val) {
      console.log(val)
    },
    changeTheme (e) {
      const root = document.querySelector(':root')
      if (e.target.checked) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  },
  mounted () {
    const input = document.getElementById('test-input')
    console.log('input', input)
    // input.addEventListener('change', (e) => console.log(e))
  }
}
</script>

<template>
  <nav
    id="topbar"
    class="flex fixed top-0 left-0 w-full h-tbar bg-2 bc-1 text-1 items-center justify-between border-b transition-filter"
  >
    <div class="flex flex-shrink-0 px-4 w-sbar items-center justify-center">
      <button
        class="mr-4"
        aria-label="Open Menu"
        @click="$emit('openSidebar')"
      >
        <MenuIcon class="h-8 w-8" />
      </button>
      <div class="logo w-48 h-8 mt-1.5" />
    </div>

    <div class="relative bg-transparent flex-grow px-6">
      <span class="absolute inset-y-0 right-0 flex items-center pr-6">
        <DocumentSearchIcon
          class="p-1 w-8 h-8 text-hover-brand transition-colors"
          @click="() => $emit('launchSearch')"
        />
      </span>
      <input
        id="search-input"
        type="text"
        class="w-full text-1 placeholder-3 bg-2 p-1.5 pr-10 text-lg border-b-2 bc-alt-1 bc-mouse-brand transition-border"
        placeholder="Search..."
        @input="(e) => $emit('updateSearch', e.target.value)"
      >
    </div>

    <div class="flex bg-transparent items-center justify-between">
      <div class="topbar-icon">
        <BellIcon />
      </div>
      <div class="topbar-icon">
        <FolderIcon />
      </div>
      <div class="topbar-icon">
        <MailIcon />
      </div>
    </div>

    <label
      class="switch mr-3 orange"
      @click="changeTheme"
    >
      <input type="checkbox">
      <span class="slider round" />
    </label>
  </nav>
</template>

<script>
import { DocumentSearchIcon, BellIcon, FolderIcon, MailIcon, MenuIcon } from '@heroicons/vue/solid'

export default {
  components: {
    DocumentSearchIcon,
    MenuIcon,
    BellIcon,
    FolderIcon,
    MailIcon
  },
  emits: [
    'launchSearch',
    'updateSearch',
    'openSidebar',
    'closeSidebar'
  ],
  mounted () {
    const input = document.getElementById('test-input')
    console.log('input', input)
    // input.addEventListener('change', (e) => console.log(e))
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
  }
}
</script>

<style>
  @import "~@/assets/css/utils/switch.css";

  .topbar-icon {
      @apply mr-6 w-6 h-6;
  }
</style>

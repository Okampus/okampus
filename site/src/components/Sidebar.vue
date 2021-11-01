<template>
  <aside
    id="sidebar"
    :class="{'-l-sbar': closed || collapsing, 'fixed': uncollapsed, 'h-screen': uncollapsed,
             'sticky': !uncollapsed, 'top-tbar': !uncollapsed, 'h-content': !uncollapsed}"
    class="overflow-hidden flex flex-col
    flex-shrink-0 w-sbar bg-1
    border-r border-bar whitespace-nowrap tr-spacing z-50"
  >
    <div
      v-if="uncollapsed"
      id="slide-sidebar-top"
      class="bg-2 h-tbar flex flex-shrink-0 items-center justify-center"
    >
      <button
        aria-label="Open Menu"
        @click="$emit('closeSidebar')"
      >
        <i class="ri-close-line text-4xl text-1" />
      </button>
      <!-- <div class="brand w-32 h-6 flex-shrink-0" /> -->
    </div>

    <div class="text-1 overflow-y-auto overflow-x-hidden app-scrollbar">
      <div class="divide-y divide-color-1">
        <ul
          v-for="linkSection of links"
          :key="linkSection"
          class="py-2"
        >
          <template
            v-for="link of linkSection"
            :key="link"
          >
            <li>
              <router-link
                v-if="link.condition == undefined || condition(link.condition)"
                :to="link.to"
                class="py-1 flex w-full items-center transition-colors bg-mouse-brand duration-300 cursor-pointer"
                :class="{ active: link.to === $route.path }"
              >
                <div class="flex flex-col items-center w-full mt-1 mb-2">
                  <i
                    :class="link.icon"
                    class="flex-shrink-0 text-2xl"
                  />
                  <span class="text-sm">{{ link.text }}</span>
                </div>
              </router-link>
            </li>
          </template>
        </ul>

        <div class="flex flex-col py-4 items-center">
          <label
            class="switch orange"
            @click="$store.dispatch('userConfig/switchTheme')"
          >
            <input
              v-model="theme"
              type="checkbox"
            >
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="js">
import { defineComponent, watch } from 'vue'

export default defineComponent({
  name: 'SidebarBase',
  props: {
    closed: {
      type: Boolean,
      default: true
    },
    uncollapsed: {
      type: Boolean,
      default: true
    },
    collapsing: {
      type: Boolean,
      default: true
    },
    links: {
      type: Array,
      default: () => [
        [
          { to: '/', text: 'Accueil', icon: 'ri-home-3-line' },
          { to: '/info', text: 'Annonces', icon: 'ri-alarm-warning-line' },
          { to: '/dashboard', text: 'Admin', icon: 'ri-pie-chart-box-line' }
        ],
        [
          { to: '/file-upload', text: 'Docs Sharing', icon: 'ri-folder-upload-line' }
        ],
        [
          { to: '/new-post', text: 'Créer un Post', icon: 'ri-chat-new-line' },
          { to: '/posts', text: 'Tous les Posts', icon: 'ri-chat-check-line' }
        ],
        [
          { to: '/my-account', text: 'Mon compte', icon: 'ri-account-box-line', condition: 'loggedIn' },
          { to: '/rgpd', text: 'RGPD', icon: 'ri-database-2-line' },
          { to: '/horizon', text: 'Horizon', icon: 'ri-information-line' }
        ]
      ]
    }
  },
  emits: [
    'closeSidebar'
  ],
  data () {
    return {
      theme: this.$store.state.userConfig.theme === 'dark'
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    }
  },
  mounted () {
    watch(() => this.$store.getters['userConfig/getTheme'], (newTheme) => {
      if ((newTheme === 'dark') !== this.theme) {
        this.theme = newTheme === 'dark'
      }
    })
  },
  methods: {
    condition (type) {
      if (type === 'loggedIn') {
        return this.loggedIn
      } else {
        return false
      }
    }
  }
})
</script>

<style>
@import "~@/assets/css/components/switch.css";

.tr-spacing {
  transition: color 300ms, background-color 300ms linear, border-color 300ms, fill 300ms, stroke 300ms, margin-left 500ms;
}
</style>

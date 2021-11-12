<template>
  <aside
    id="sidebar"
    :class="{
      'hidden-sidebar': closed || collapsing, 'sidebar-shadow': uncollapsed || !closed || collapsing,
      'fixed': uncollapsed, 'h-screen': uncollapsed, 'sticky': !uncollapsed,
      'after-topbar': !uncollapsed, 'h-content': !uncollapsed
    }"
    class="overflow-hidden flex flex-col flex-shrink-0 w-sidebar bg-1
    border-r border-bar whitespace-nowrap tr-spacing z-50"
  >
    <div
      v-if="uncollapsed"
      id="slide-sidebar-top"
      class="bg-2 h-topbar flex flex-shrink-0 items-center justify-center"
    >
      <button
        aria-label="Open Menu"
        @click="$emit('closeSidebar')"
      >
        <i class="ri-close-line text-4xl text-1" />
      </button>
    </div>

    <div class="overflow-y-auto overflow-x-hidden app-scrollbar-on-hover">
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
                class="py-1 flex w-full items-center transition-colors horizontal-tab duration-300 cursor-pointer opacity-80"
                :class="{ active: link.to === $route.path }"
              >
                <div class="flex flex-col items-center w-full mt-1 mb-2 text-2">
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
          <switch-input
            v-model="theme"
            @click="$store.dispatch('userConfig/switchTheme')"
          />
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="js">
import SwitchInput from '@/components/Input/SwitchInput.vue'

export default {
  components: { SwitchInput },
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
  computed: {
    theme () {
      return this.$store.state.userConfig.theme === 'dark'
    },

    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    }
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
}
</script>

<style lang="scss">

.sidebar-shadow {
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  clip-path: inset(0px -15px 0px 0px);
  :root.dark & {
    box-shadow: 0 0 10px rgba(0,0,0,0.75);
  }
}

.tr-spacing {
  transition: color 300ms, background-color 300ms linear, border-color 300ms, fill 300ms, stroke 300ms, margin-left 500ms;
}

</style>

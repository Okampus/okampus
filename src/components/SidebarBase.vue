<template>
  <div class="overflow-y-auto overflow-x-hidden app-scrollbar">
    <div class="divide-y bc-2">
      <ul class="py-2" v-for="section of sections" :key="section">
        <span class="capitalize"></span>
        <template v-for="link of links" :key="link">
          <li v-if="link.section == section">
            <a :href="link.href" class="h-12 py-2 px-4 flex w-full items-center transition-colors bg-mouse-brand duration-300">
            <component class="w-6 h-6 mr-4 flex-shrink-0" :is="link.icon" ></component>
            <span>{{ link.text }}</span>
            </a>
          </li>
        </template>
      </ul>

      <div class="px-8">
        <ul class="w-full flex items-center justify-between">
            <li class="cursor-pointer pt-5 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bell" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path>
                    <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
                </svg>
            </li>
            <li class="cursor-pointer pt-5 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-messages" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10"></path>
                    <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"></path>
                </svg>
            </li>
            <li class="cursor-pointer pt-5 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </li>
            <li class="cursor-pointer pt-5 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-archive" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <rect x="3" y="4" width="18" height="4" rx="2"></rect>
                    <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10"></path>
                    <line x1="10" y1="12" x2="14" y2="12"></line>
                </svg>
            </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import {
  SearchIcon,
  SpeakerphoneIcon
} from '@heroicons/vue/solid'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SidebarBase',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    SearchIcon,
    SpeakerphoneIcon
  },
  // methods: {
  //   sidebarHandler () {
  //     this.$emit('closeSidebar')
  //   }
  // },
  props: {
    sections: {
      default: () => [
        'Général',
        "Ef'réussite",
        'Scolarité',
        'Horizon',
        'Mon Espace'
      ]
    },

    links: {
      default: () => [
        { href: '#', section: 'Général', text: 'Annonces', icon: 'SpeakerphoneIcon' },
        { href: '#', section: 'Général', text: 'Dashboard site', icon: 'SearchIcon' },
        { href: '#', section: "Ef'réussite", text: 'Docs sharing', icon: 'SearchIcon' },
        { href: '#', section: "Ef'réussite", text: 'Scheduler', icon: 'SearchIcon' },
        { href: '#', section: 'Scolarité', text: 'Infos scolarité', icon: 'SearchIcon' },
        { href: '#', section: 'Scolarité', text: 'Remontées', icon: 'SearchIcon' },
        { href: '#', section: 'Horizon', text: 'Notre association', icon: 'SearchIcon' },
        { href: '#', section: 'Horizon', text: 'Project dating', icon: 'SearchIcon' },
        { href: '#', section: 'Mon Espace', text: 'Mon compte', icon: 'SearchIcon' },
        { href: '#', section: 'Mon Espace', text: 'RGPD', icon: 'SearchIcon' }
      ]
    }
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

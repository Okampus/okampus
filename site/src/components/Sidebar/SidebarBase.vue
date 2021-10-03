<template>
  <div class="text-1 overflow-y-auto overflow-x-hidden app-scrollbar">
    <div class="divide-y bc-1">
      <ul
        v-for="section of sections"
        :key="section"
        class="py-2"
      >
        <span class="capitalize" />
        <template
          v-for="link of links"
          :key="link"
        >
          <li v-if="link.section == section">
            <a
              :href="link.href"
              class="h-12 py-2 px-4 flex w-full items-center transition-colors bg-mouse-brand duration-300"
            >
              <component
                :is="link.icon"
                class="w-6 h-6 mr-4 flex-shrink-0"
              />
              <span>{{ link.text }}</span>
            </a>
          </li>
        </template>
      </ul>

      <div class="px-4">
        <ul class="w-full flex items-center justify-between">
          <li class="cursor-pointer pt-5 pb-3">
            <CogIcon class="h-8" />
          </li>
        </ul>
      </div>
    </div>
    <div class="" />
  </div>
</template>

<script lang="js">
import {
  SearchIcon,
  SpeakerphoneIcon,
  DocumentDownloadIcon,
  CalendarIcon,
  TicketIcon,
  InformationCircleIcon,
  UserIcon,
  BriefcaseIcon,
  PresentationChartLineIcon,
  DatabaseIcon
} from '@heroicons/vue/solid'

import {
  CogIcon
} from '@heroicons/vue/outline'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SidebarBase',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    CogIcon,
    SearchIcon,
    SpeakerphoneIcon,
    DocumentDownloadIcon,
    CalendarIcon,
    TicketIcon,
    InformationCircleIcon,
    UserIcon,
    BriefcaseIcon,
    PresentationChartLineIcon,
    DatabaseIcon
  },
  // methods: {
  //   sidebarHandler () {
  //     this.$emit('closeSidebar')
  //   }
  // },
  props: {
    sections: {
      type: Array,
      default: () => [
        'Général',
        "Ef'réussite",
        'Scolarité',
        'Horizon',
        'Mon Espace'
      ]
    },

    links: {
      type: Array,
      default: () => [
        { href: '#', section: 'Général', text: 'Annonces', icon: 'SpeakerphoneIcon' },
        { href: '#', section: 'Général', text: 'Dashboard site', icon: 'PresentationChartLineIcon' },
        { href: '#', section: "Ef'réussite", text: 'Docs sharing', icon: 'DocumentDownloadIcon' },
        { href: '#', section: "Ef'réussite", text: 'Scheduler', icon: 'CalendarIcon' },
        { href: '#', section: 'Scolarité', text: 'Infos scolarité', icon: 'InformationCircleIcon' },
        { href: '#', section: 'Scolarité', text: 'Remontées', icon: 'TicketIcon' },
        { href: '#', section: 'Horizon', text: 'Notre association', icon: 'SearchIcon' },
        { href: '#', section: 'Horizon', text: 'Project dating', icon: 'BriefcaseIcon' },
        { href: '#', section: 'Mon Espace', text: 'Mon compte', icon: 'UserIcon' },
        { href: '#', section: 'Mon Espace', text: 'RGPD', icon: 'DatabaseIcon' }
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

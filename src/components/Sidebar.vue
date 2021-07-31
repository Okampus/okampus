<template>
  <aside class="sidebar menu bg-2">
    <template v-for="category of categories_displayed" :key="category">
      <p class="menu-label mt-5 mb-1 text-3-important">{{ category }}</p>
      <ul class="menu-list">
        <template v-for="link of links" :key="link.key">
          <li v-if="link.category == category">
            <a
              class="menu-link text-2-important"
              :href="link.href"
              >{{ link.text }}</a
            >
          </li>
        </template>
      </ul>
    </template>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Sidebar',
  props: {
    categories_displayed: {
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
        { href: '#', category: 'Général', text: 'Annonces' },
        { href: '#', category: 'Général', text: 'Dashboard site' },
        { href: '#', category: "Ef'réussite", text: 'Docs sharing' },
        { href: '#', category: "Ef'réussite", text: 'Scheduler' },
        { href: '#', category: 'Scolarité', text: 'Infos scolarité' },
        { href: '#', category: 'Scolarité', text: 'Remontées' },
        { href: '#', category: 'Horizon', text: 'Notre association' },
        { href: '#', category: 'Horizon', text: 'Project dating' },
        { href: '#', category: 'Mon Espace', text: 'Mon compte' },
        { href: '#', category: 'Mon Espace', text: 'RGPD' }
      ]
    }
  }
})
</script>

<style>
.sidebar {
  transition: padding 1s, width 0.5s ease-in-out;
  padding: 10px 20px 20px 20px;
  width: var(--sidebar-width);
  overflow: hidden;
  white-space: nowrap;
}

.menu-list a.menu-link {
  display: inline-block;
  transition: 0.2s ease-in-out;
}

.menu-list a.menu-link:hover {
  display: inline-block;
  background-color: var(--sep-2);
}

@media screen and (max-width: 900px) { /* Sync breakpoint with Topbar.vue */
  .sidebar {
    width: 0;
    padding: 0;
  }

  .menu-list a.menu-link {
    pointer-events: none;
    cursor: default;
    text-decoration: none;
  }
}
</style>

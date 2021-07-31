<template>
  <nav class="topbar level is-mobile bg-2 mb-0 sep-2">
    <div id="top-level-left-side" class="level-item sidebar-width">
      <div class="logo" />
    </div>

    <div id="top-level-right-side" class="level-item content-width">
      <searchbar
        id="topbar-searchbar"
        ref="searchbar"
        placeholder="Chercher une page, un document, un article..."
        v-on:updateSearch="(e) => this.$emit('updateSearch', e)"
        v-bind:classes="['bg-2', 'text-2']"
      />

      <div class="burger-button">
        <font-awesome-icon icon="bars" size="lg" />
      </div>

      <span class="topbar-icon-group">
        <div class="topbar-icon">
          <font-awesome-icon icon="bell" size="lg" :style="{ color: 'var(--text-2)' }" />
        </div>
        <div class="topbar-icon">
          <font-awesome-icon icon="folder-open" size="lg" :style="{ color: 'var(--text-2)' }" />
        </div>
        <div class="topbar-icon">
          <font-awesome-icon icon="envelope" size="lg" :style="{ color: 'var(--text-2)' }" />
        </div>
      </span>

      <label class="switch ml-3 orange" v-on:click="changeTheme">
        <input type="checkbox" />
        <span class="slider round"></span>
      </label>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Searchbar from './Searchbar.vue'

export default defineComponent({
  created: function () {
    window.addEventListener('resize', () => {
      const breakpoint = 900
      const input = document.querySelector('#topbar-searchbar input') as HTMLInputElement
      const iconGroup = document.querySelector('span.topbar-icon-group') as HTMLElement
      const burger = document.querySelector('.burger-button') as HTMLElement

      if (window.innerWidth < breakpoint) {
        input.placeholder = ''
        iconGroup.style.display = 'none'
        burger.style.display = 'inline-flex'
      } else {
        input.placeholder = (this.$refs.searchbar as typeof Searchbar).placeholder
        iconGroup.style.display = 'inline-flex'
        burger.style.display = 'none'
      }
    })
  },
  methods: {
    changeTheme (e: Event) {
      const root = document.querySelector(':root') as HTMLElement
      console.log(document.querySelector(':root'))
      if ((e.target as HTMLFormElement).checked) {
        root.classList.add('light_mode')
      } else {
        root.classList.remove('light_mode')
      }
    }
  },
  name: 'Topbar',
  components: {
    searchbar: Searchbar
  }
})
</script>

<style>
@import "~@/assets/css/themes.css";
@import "~@/assets/css/utils/switch.css";

#top-level-left-side,
#top-level-right-side {
  padding-top: 0.6em;
  padding-bottom: 0.5em;
}

#top-level-left-side {
  width: var(--sidebar-width);
  flex-grow: 0;
  padding-left: 20px;
  padding-right: 20px;
}

#top-level-right-side {
  padding-left: 20px;
  padding-right: 20px;
  flex-basis: 0;
}

.topbar {
  border-bottom-width: 2px;
  border-bottom-style: solid;
}

.burger-button {
  display: none;
  padding-left: 30px;
  padding-right: 30px;
}

/*.topbar-input::-webkit-input-placeholder {
    transition: 2s;
}*/

.topbar-icon-group {
  display: flex;
  padding-left: 20px;
}

.topbar-icon {
  font-size: 15px;
  padding-left: 15px;
  padding-right: 15px;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}

.topbar-icon:hover {
  filter: drop-shadow(0px 0px 2px var(--text-2));
}

.logo {
  width: 170px;
  height: 55px;
  display: block;
}
</style>

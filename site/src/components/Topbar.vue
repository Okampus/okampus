<template>
  <nav
    id="topbar"
    class="bg-1 flex fixed top-0 left-0 w-full h-tbar text-1 items-center justify-between border-b"
  >
    <div class="flex flex-shrink-0 px-4 w-sbar items-center justify-center">
      <button
        aria-label="Open Menu"
        @click="$emit('toggleSidebar')"
      >
        <i class="ri-menu-line text-2xl" />
      </button>
      <!-- <div class="brand w-32 h-6 mt-1.5" /> -->
    </div>

    <div class="w-full h-full flex items-center">
      <div class="relative bg-transparent flex-grow px-6">
        <input
          id="search-input"
          type="text"
          class="bg-1 w-full text-1 placeholder-3 px-3 py-1.5 pr-10 text-lg border-b-2 border-color-4 hover:border-indigo-500 focus-border-1 focus:ring-4 focus:rounded-md outline-none"
          placeholder="Rechercher..."
          @input="(e) => $emit('updateSearch', e.target.value)"
        >
        <span class="absolute inset-y-0 right-0 flex items-center pr-6">
          <i
            class="p-1 ri-file-search-line mouse-icon text-2xl"
            @click="() => $emit('launchSearch')"
          />
        </span>
      </div>
    </div>

    <div
      v-if="!loggedIn"
      class="flex-shrink-0 flex justify-center items-center mr-4"
    >
      <button
        class="button text-md"
        @click="$emit('toggleLogin')"
      >
        <div class="flex space-x-2 items-center">
          <p class="text-md">
            SE CONNECTER
          </p>
          <i class="ri-login-circle-line text-xl" />
        </div>
      </button>
    </div>

    <div
      v-else
      class="flex bg-transparent items-center justify-between h-full"
    >
      <div class="mr-4">
        <user-card
          avatar="https://www.hersolrentals.com/images/user.png"
          :username="user.username"
          :email="user.email"
          status="green-500"
        />
      </div>
    </div>

    <component
      :is="loginComponent"
      v-if="showLogin"
    />
  </nav>
</template>

<script>

import UserCard from '@/components/Card/UserCard.vue'
import Login from '@/components/Login.vue'

export default {
  components: {
    UserCard,
    Login
  },
  props: {
    showLogin: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'launchSearch',
    'updateSearch',
    'toggleSidebar',
    'toggleLogin'
  ],
  data () {
    return {
      loginComponent: null
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    },
    user () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
    this.loginComponent = 'login'
  }
}
</script>

<style lang="scss">
  @import "~@/assets/scss/utils/get-color.scss";

  input.focus-border-1:focus {
    @include get-color('border', 1, true);
  }
</style>

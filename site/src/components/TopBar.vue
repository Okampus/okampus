<template>
  <nav
    id="topbar"
    class="bg-1 flex fixed top-0 left-0 w-full h-topbar text-1 items-center justify-between border-b
    topbar-shadow"
  >
    <div class="flex flex-shrink-0 px-4 w-sidebar items-center justify-center">
      <button
        aria-label="Open Menu"
        @click="$emit('toggle-side-bar')"
      >
        <i class="ri-menu-line text-2xl" />
      </button>
      <div class="hidden 2xl:block brand w-32 h-6 ml-4" />
    </div>

    <div class="w-full h-full flex items-center">
      <div class="relative bg-transparent flex-grow px-6">
        <input
          id="search-input"
          type="text"
          class="bg-1 w-full text-1 placeholder-3 px-3 py-1.5 pr-10 text-lg border-b-2
            dark:border-2-light border-2-dark
          focus:border-0 focus:ring-4 focus:rounded-md outline-none"
          placeholder="Rechercher..."
        >
        <span class="absolute inset-y-0 right-0 flex items-center pr-6">
          <i
            class="p-1 ri-file-search-line mouse-icon text-2xl"
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
        @click="$emit('toggle-login')"
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
      v-if="showLogin && !loggedIn"
    />
  </nav>
</template>

<script>

import UserCard from '@/components/Card/UserCard.vue'
import UserLogin from '@/components/UserLogin.vue'

export default {
    components: {
        UserCard,
        UserLogin
    },
    props: {
        showLogin: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'toggle-side-bar',
        'toggle-login'
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
.topbar-shadow {
  box-shadow: 0 0 15px 3px rgba(0,0,0,0.05);
  clip-path: inset(0px 0px -30px 0px);
  :root.dark & {
    box-shadow: 0 0 20px 5px rgba(0,0,0,0.4);
  }
}
</style>

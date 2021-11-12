<template>
  <div class="flex space-x-4 items-center">
    <div class="relative w-11 h-11">
      <div>
        <img
          class="rounded-2xl"
          :src="avatar ?? require('@/assets/img/default_avatars/user.png')"
          :alt="username"
        >
      </div>
      <span
        class="w-1/3 h-1/3 absolute bottom-0 right-0 rounded-full border border-color-alt-2"
        :class="`bg-${status}`"
      />
    </div>
    <div class="flex flex-col min-w-0">
      <div class="font-semibold truncate">
        {{ username }}
      </div>
      <div class="truncate">
        {{ email }}
      </div>
    </div>
    <div class="flex flex-col items-center justify-center space-y-2">
      <i class="ri-settings-4-line cursor-pointer" />
      <i
        class="ri-logout-box-line cursor-pointer"
        @click="logout"
      />
    </div>
  </div>
</template>

<script lang="js">

export default {
  props: {
    username: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'red-500'
    }
  },
  methods: {
    logout () {
      this.emitter.emit('logout')
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>

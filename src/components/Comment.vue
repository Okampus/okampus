<template>
  <div
    class="
      text-1 text-sm
      bg-1
      w-full
      border-opacity-50
      rounded-md
      float-right
      mt-2
      p-1
      border-1
    "
  >
    {{ content }}
    <span class="font-bold"> - {{ author }}</span>
    <div class="float-right mr-1">
      <HeartIcon class="h-6 w-6 inline-block" />
      <div class="h-6 w-auto inline-block">
        125
      </div>
      <ChatAltIcon class="h-6 w-6 inline-block ml-1" />
      <FlagIcon class="h-6 w-6 inline-block ml-2" />
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import { FlagIcon, ChatAltIcon, HeartIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'Comment',
  components: {
    FlagIcon,
    ChatAltIcon,
    HeartIcon
  },
  props: {
    content: {
      type: String
    },
    author: {
      type: String
    }
  },

  methods: {
  }
})
</script>

<style scoped>
</style>

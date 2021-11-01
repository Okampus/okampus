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
    {{ comment.content }}
    <span class="font-bold"> - {{ comment.author }}</span>
    <div class="float-right mr-1">
      <i class="ri-heart-line inline-block" />
      <div class="h-6 w-auto inline-block">
        {{ comment.likes }}
      </div>
      <i class="ri-chat-4-line inline-block ml-1" />
      <i class="ri-flag-line inline-block ml-2" />
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
  }
})
</script>

<style scoped>
</style>

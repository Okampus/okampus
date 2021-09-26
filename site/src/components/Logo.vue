<template>
  <div
    class="
      px-1
      border-opacity-100 border-2
      bg-opacity-40
      rounded-full
      w-auto
      inline-block
    "
    :class="'bg-' + color + ' ' + 'border-' + color"
  >
    <div class="text-sm">
      {{ title }}
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Logo'
})
</script>

<style scoped>
</style>

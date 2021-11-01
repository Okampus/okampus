<template>
  <div
    class="
      h-7 rounded-full text-white space-x-0 md:space-x-1 font-medium flex items-center justify-center mr-1 md:mr-2 px-2 md:px-4 bg-opacity-80 cursor-pointer hover:bg-opacity-100
    "
    :class="`bg-${color}`"
  >
    <span class="text-sm md:text-base pb-1">
      {{ name }}
    </span>
    <slot />
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Tag',
  props: {
    name: {
      type: String,
      default: '<Tag>'
    },
    color: {
      type: String,
      default: 'red-500'
    }
  }
})
</script>

<template>
  <div
    v-for="i in 50"
    :key="i"
    class="py-8 shadow text-center rounded-lg mb-10 bg-white"
  >
    CONTENT
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Content'
})
</script>

<template>
  <div class="text-1 flex flex-col items-center">
    <i class="ri-ancient-pavilion-fill mt-4" />
    <i class="ri-ancient-pavilion-fill mt-4" />
    <i class="ri-ancient-pavilion-fill mt-4" />
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ToolbarAdmin',
  props: {
    sections: {
      type: Array,
      default: () => [
        'Général',
        "Ef'réussite"
      ]
    }
  },
  methods: {
  }
})
</script>

<style scoped>
</style>

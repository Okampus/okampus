<template>
  <div>
    <img
      :src="contributor.img"
      alt="Avatar"
      class="rounded-full h-8 w-8 mr-2 mt-1 bg-white"
      :title="contributor.pseudo"
    >
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Response',
  components: {
  },
  props: {
    contributor: {
      type: Object,
      default: () => {
        return {
          img: '',
          pseudo: '<Pseudo>'
        }
      }
    }
  }
})
</script>

<style scoped>
</style>

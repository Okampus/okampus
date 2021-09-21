<template>
  <div class="w-5/6 mx-auto px-16">
    <div class="text-3xl text-1">
      Liste des Threads :
    </div>
    <div class="">
      <ThreadMini
        class="mt-1"
        :title="'Probleme lors de la création de Threads'"
      />

      <ThreadMini
        class="mt-1"
        :title="'Probleme lors de la création de Threads'"
      />

      <ThreadMini
        class="mt-1"
        :title="'Probleme lors de la création de Threads'"
      />

      <ThreadMini
        class="mt-1"
        :title="'Probleme lors de la création de Threads'"
      />
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import ThreadMini from '@/components/ThreadMini.vue'

export default defineComponent({
  name: 'ThreadList',
  components: { ThreadMini },
  props: {
  },

  methods: {
  }
})
</script>

<style scoped>
</style>

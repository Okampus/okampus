<template>
  <div class="w-5/6 mx-auto px-16">
    <div class="text-3xl text-1">
      Liste des Threads :
    </div>
    <div class="">
      <PostMini
        class="mt-1"
        :title="'Probleme lors de la création de Threads'"
      />

      <PostMini
        class="mt-1"
        :title="'Probleme lors de la création de Threads'"
      />

      <PostMini
        class="mt-1"
        :title="'Probleme lors de la création de Threads'"
      />

      <PostMini
        class="mt-1"
        :title="'Probleme lors de la création de Threads'"
      />
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import PostMini from '@/pages/Post/PostMini.vue'

export default defineComponent({
  name: 'PostList',
  components: { PostMini },
  props: {
  },

  methods: {
  }
})
</script>

<style scoped>
</style>

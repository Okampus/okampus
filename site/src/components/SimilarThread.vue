<template>
  <div class="p-1/2 w-auto flex flex-col pl-1 pb-1">
    <hr class="mb-2">
    <div class="w-5/6">
      <div class="text-base font-bold">
        {{ thread.title }}
      </div>
      <div class="flex flex-wrap">
        <tag
          v-for="tag in thread.tags"
          :key="tag"
          :name="tag.title"
          :color="tag.color"
        />
      </div>
    </div>
  </div>
</template>

<script lang="js">
import Tag from '@/components/Tag.vue'

export default {
  components: {
    Tag
  },
  props: {
    thread: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped></style>

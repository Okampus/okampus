<template>
  <div class="bg-1 p-1/2 border-1 rounded-md w-auto flex pl-1 pb-1">
    <div class="w-5/6">
      <div class="text-base font-bold">
        #{{ topic.number }} {{ topic.title }}
      </div>
      <Tag
        v-for="tag in topic.tags"
        :key="tag"
        :title="tag.title"
        class="mr-2"
        :color="tag.color"
      />
      <div>Hotness</div>
      <div>Timeline Status</div>
    </div>
    <div class="w-1/6 flex flex-col items-center">
      <BellIcon class="h-7 w-7 mt-1" />
      <StarIcon class="h-7 w-7 mt-2" />
      <FlagIcon class="h-7 w-7 mt-2" />
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import Tag from '@/components/Tag.vue'
import { BellIcon, StarIcon, FlagIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'SimilarTopic',
  components: {
    Tag,
    BellIcon,
    StarIcon,
    FlagIcon
  },
  props: {
    topic: {
      type: Object
    }
  }
})
</script>

<style scoped>
</style>

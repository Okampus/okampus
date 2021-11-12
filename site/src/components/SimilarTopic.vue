<template>
  <div class="bg-1 p-1/2 border-1 rounded-md w-auto flex pl-1 pb-1">
    <div class="w-5/6">
      <div class="text-base font-bold">
        #{{ topic.number }} {{ topic.title }}
      </div>
      <div class="flex flex-wrap">
        <Tag
          v-for="tag in topic.tags"
          :key="tag"
          :name="tag.title"
          class="mr-2"
          :color="tag.color"
        />
      </div>
      <div>Hotness</div>
      <div>Timeline Status</div>
    </div>
    <div class="w-1/6 flex flex-col items-center">
      <i class="ri-notification-2-line mt-2" />
      <i class="ri-star-line mt-2" />
      <i class="ri-flag-line mt-2" />
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
    topic: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

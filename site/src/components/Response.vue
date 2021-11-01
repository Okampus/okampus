<template>
  <div>
    <div class="text-1 border-1 bg-1 rounded-md">
      <div class="flex pr-4">
        <div class="flex flex-col w-2/12 items-center bg-2 border-r pb-4">
          <img
            :src="response.creator.img"
            alt="Profile Picture"
            class="bg-white w-24 h-24 mt-4"
          >
          <div class="font-bold">
            {{ response.creator.pseudo }}
          </div>
          <div>{{ response.creator.role }}</div>
          <i class="ri-arrow-up-s-line" />
          <div class="text-center">
            {{ response.upvotes }}
          </div>
          <i class="ri-arrow-down-s-line" />
          <i class="ri-star-line" />
          <i class="ri-notification-2-line" />
          <i class="ri-flag-line" />
        </div>
        <div class="w-10/12 pl-2 pb-4">
          <div class="px-4 pt-4 text-3xl font-bold text-center">
            {{ response.title }}
          </div>
          <i class="ri-edit-line" />
          <i class="ri-archive-line" />
          <div class="p-1 mt-2 text-2 text-sm">
            {{ response.content }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="comment in response.responses"
      :key="comment"
    >
      <Comment :comment="comment" />
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import Comment from '@/components/Comment.vue'

export default defineComponent({
  name: 'Response',
  components: {
    Comment
  },
  props: {
    response: {
      type: Object,
      default: () => {}
    }
  }
})
</script>

<style scoped>
</style>

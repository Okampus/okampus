<template>
  <div>
    <div class="text-1 border-1 bg-1 rounded-md">
      <div class="px-4 pt-4 text-3xl font-bold text-center">
        #{{ post.number }} - {{ post.title }}
      </div>
      <div class="flex pb-4 pr-4 mt-1">
        <div class="flex flex-col w-1/12 items-center">
          <i class="ri-arrow-up-s-line" />
          <div class="text-center">
            {{ post.upvotes }}
          </div>
          <i class="ri-arrow-down-s-line" />
          <i class="ri-star-line" />
          <i class="ri-notification-2-line" />
          <i class="ri-flag-line" />
        </div>
        <div class="w-11/12">
          <i class="ri-edit-line ml-3 inline-block" />
          <i class="ri-archive-line ml-3 inline-block" />
          <div class="p-1 mt-2 text-2 text-sm">
            {{ post.content }}
          </div>
        </div>
      </div>
      <div class="flex bg-2 border-t rounded-b-md">
        <img
          :src="post.creator.img"
          alt="Profile Picture"
          class="bg-white w-24 h-24"
        >
        <div class="relative ml-3">
          <div>
            <div class="inline-block text-lg font-medium">
              {{ post.creator.pseudo }}
            </div>
            <div class="inline-block ml-3 text-sm">
              {{ post.creator.role }}
            </div>
          </div>
          <div>dfs</div>
        </div>
      </div>
    </div>
    <div
      v-for="comment in post.responses"
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
  name: 'Message',
  components: {
    Comment
  },
  props: {
    post: {
      type: Object,
      default: () => {}
    }
  }
})
</script>

<style scoped>
</style>

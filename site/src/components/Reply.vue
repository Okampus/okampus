<template>
  <div>
    <div class="text-1">
      <div class="flex">
        <div class="flex flex-col flex-shrink-0 w-20 items-center text-lg">
          <!-- <i class="ri-arrow-up-s-fill ri-2x" />
          <div class="text-center">
            {{ reply.upvotes }}
          </div>
          <i class="ri-arrow-down-s-fill ri-2x" /> -->
          <img
            :src="reply.creator.img"
            alt="Profile Picture"
            class="w-16 h-16 rounded mt-2"
          >
          <div class="font-medium">
            {{ reply.creator.pseudo }}
          </div>
          <div class="text-sm">
            {{ reply.creator.role }}
          </div>
        </div>

        <div class="left-1/12 w-11/12 pl-2">
          <div class="p-1 text-2 text-sm">
            {{ reply.content }}
          </div>
          <div class="flex space-x-2 my-1">
            <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
              <p>0</p> <i class="ri-thumb-up-line text-yellow-400 ri-md" />
            </div>
            <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
              <p>0</p> <i class="ri-check-line text-green-500 ri-lg" />
            </div>
            <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
              <p>0</p> <i class="ri-close-line text-red-500 ri-lg" />
            </div>
            <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
              <p>0</p> <i class="ri-heart-line text-pink-500 ri-md" />
            </div>
            <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
              <p>0</p> <i class="ri-question-mark text-blue-500 ri-md" />
            </div>
            <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
              <p>0</p> <p>🤔</p>
            </div>
            <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm">
              <p>0</p> <p>😂</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="comment in reply.comments"
      :key="comment"
      class="ml-20"
    >
      <Comment :comment="comment" />
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import Comment from '@/components/Comment.vue'

export default defineComponent({
  components: {
    Comment
  },
  props: {
    reply: {
      type: Object,
      default: () => {}
    },
    actions: {
      type: Array,
      default: function () {
        return [
          'viewComments',
          'favorite',
          'edit',
          'flag'
        ]
      }
    }
  },
  computed: {
    actionsMap () {
      // TODO: Actions
      return {
        viewComments: { name: () => { return `${this.comments.length} Commentaires` }, icon: 'ri-chat-2-line', action: function () { console.log('Commentaire') } },
        favorite: { name: () => { return 'Favori' }, icon: 'ri-star-line', action: function () { console.log('Favori') } },
        edit: { name: () => { return 'Éditer' }, icon: 'ri-edit-line', action: function () { console.log('Éditer') } },
        flag: { name: () => { return 'Signaler' }, icon: 'ri-flag-line', action: function () { console.log('Signaler') } }
      }
    }
  }
})
</script>

<style scoped></style>

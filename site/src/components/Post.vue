<template>
  <div>
    <div class="text-1">
      <div class="flex mt-1">
        <div class="flex flex-col flex-shrink-0 w-20 items-center justify-center gap-1 text-lg">
          <i class="ri-arrow-up-s-fill ri-2x" />
          <div class="text-center text-xl">
            {{ post.upvotes }}
          </div>
          <i class="ri-arrow-down-s-fill ri-2x" />
        </div>
        <div class="w-11/12">
          <div class="p-1 mt-2 text-2 text-sm">
            {{ post.content }}
          </div>
          <div class="mt-2">
            <div class="ml-3 flex items-center ri-lg space-x-4">
              <div
                v-for="(action,i) in actions"
                :key="i"
                class="flex items-center text-5"
                @click="actionsMap[action].action"
              >
                <i
                  :class="actionsMap[action].icon"
                  class="ri-md"
                />
                <p class="text-sm tracking-tighter pl-1 hidden md:block">
                  {{ actionsMap[action].name() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex">
        <div class="w-20 h-20 p-3">
          <img
            :src="post.creator.img"
            alt="Profile Picture"
            class="rounded"
          >
        </div>

        <div class="my-3 mx-2 flex">
          <div class="flex flex-col">
            <div class="text-lg font-medium">
              {{ post.creator.pseudo }}
            </div>
            <div class="text-sm">
              {{ post.creator.role }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="comment in post.comments"
      :key="comment"
    >
      <Comment :comment="comment" />
    </div>
  </div>
</template>

<script lang="js">
import Comment from './Comment.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Comment
  },
  props: {
    post: {
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
        viewComments: { name: () => { return `${this.post.comments.length} Commentaires` }, icon: 'ri-chat-2-line', action: function () { console.log('Commentaire') } },
        favorite: { name: () => { return 'Favori' }, icon: 'ri-star-line', action: function () { console.log('Favori') } },
        edit: { name: () => { return 'Éditer' }, icon: 'ri-edit-line', action: function () { console.log('Éditer') } },
        flag: { name: () => { return 'Signaler' }, icon: 'ri-flag-line', action: function () { console.log('Signaler') } }
      }
    }
  }
})
</script>

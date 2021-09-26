<template>
  <div>
    <div class="text-1 border-1 bg-1 rounded-md">
      <div class="flex pr-4">
        <div class="flex flex-col w-2/12 items-center bg-2 border-r pb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
            alt="Profile Picture"
            class="bg-white w-24 h-24 mt-4"
          />
          <div class="font-bold">Pseudo</div>
          <div>Rôle</div>
          <div>dfs</div>
          <ChevronUpIcon class="h-10 w-10 mt-4" />
          <div class="text-center">
            {{ response.number }}
          </div>
          <ChevronDownIcon class="h-10 w-10" />
          <StarIcon class="h-7 w-7 mt-4" />
          <BellIcon class="h-7 w-7 mt-4" />
          <FlagIcon class="h-7 w-7 mt-4" />
          <!-- <PencilAltIcon class="h-7 w-7 mt-4" />
        <ArchiveIcon class="h-7 w-7 mt-4" /> -->
        </div>
        <div class="w-10/12 pl-2 pb-4">
          <div class="px-4 pt-4 text-3xl font-bold text-center">
            #192 - {{ response.title }}
          </div>
          <PencilAltIcon class="ml-3 inline-block h-7 w-7" />
          <ArchiveIcon class="ml-3 inline-block h-7 w-7" />
          <div class="p-1 mt-2 text-2 text-sm">
            {{ response.content }}
          </div>
        </div>
      </div>
    </div>
    <div v-for="comment in response.responses" :key="comment">
      <Comment :comment="comment" />
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import { ChevronDownIcon, ChevronUpIcon, BellIcon, StarIcon, FlagIcon, PencilAltIcon, ArchiveIcon } from '@heroicons/vue/outline'
import Comment from '@/components/Comment.vue'

export default defineComponent({
  name: 'Response',
  components: {
    ChevronDownIcon,
    ChevronUpIcon,
    BellIcon,
    StarIcon,
    FlagIcon,
    PencilAltIcon,
    ArchiveIcon,
    Comment
  },
  props: {
    response: {
      type: Object
    }
  }
})
</script>

<style scoped>
</style>

<template>
  <div class="flex bg-2 border-1 text-1 p-2">
    <div class="flex flex-col items-center m-y-auto mx-4">
      <!-- Colonne 1 -->
      <div class="my-auto">
        <ThumbUpIcon class="h-9 w-9" />
        185
      </div>
      <BellIcon class="h-9 w-9 my-auto" />
      <FlagIcon class="h-9 w-9 my-auto" />
    </div>
    <div>
      <div class="text-xl text-blue-400">
        #185 {{ title }}
      </div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut consectetur
        deserunt ipsa sunt magnam aperiam aut quisquam sit ipsam fugiat! Ut
        asperiores veritatis laboriosam, voluptatum rem expedita illum nobis ex
        deserunt quia minima assumenda dolores aperiam minus culpa quis, enim
        optio. Magnam culpa architecto cum consequuntur velit est sunt
        necessitatibus itaque sit non! Atque, aliquam. Culpa doloribus aliquid,
        a eius ex adipisci molestias facere at maiores odio, eveniet illum amet
        reiciendis delectus eum eligendi nisi.
      </div>
      <Tag
        class="mt-1 mr-1 inline-block"
        :title="'Exemple'"
        :color="'pink-500'"
      />
      <Tag
        class="mt-1 mr-1 inline-block"
        :title="'TagExemple'"
        :color="'blue-500'"
      />
      <Tag
        class="mt-1 mr-1 inline-block"
        :title="'Tag'"
        :color="'red-500'"
      />
      <Tag
        class="mt-1 mr-1 inline-block"
        :title="'TagTitle'"
        :color="'orange-500'"
      />
      <Tag
        class="mt-1 mr-1 inline-block"
        :title="'OneTagForExemple'"
        :color="'purple-500'"
      />
      <div class="float-right">
        18/09/2021 - <span class="font-bold">Pseudo</span>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import Tag from '@/components/Tag.vue'
import { ThumbUpIcon, BellIcon, FlagIcon } from '@heroicons/vue/outline'

export default defineComponent({
  name: 'SimilarTopic',
  components: {
    Tag,
    ThumbUpIcon,
    BellIcon,
    FlagIcon
  },
  props: {
    title: {
      type: String
    }
  }
})
</script>

<style scoped>
</style>

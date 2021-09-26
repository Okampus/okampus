<template>
  <div>
    <!-- Haut de page : Timeline... -->
    <div class="flex mb-4">
      <div class="text-1 w-1/6 bg-1 rounded-md pl-1 border-1">
        <div>Demandé : Il y a <span class="font-bold"> 2 semaines</span></div>
        <div>
          Denière activité : Il y a <span class="font-bold">2 jours</span>
        </div>
        <div>
          Nombre de vues : <span class="font-bold">{{ thread.views }}</span>
        </div>
      </div>
      <div class="text-1 mx-2 w-4/6 border-1 bg-1 rounded-md">
        <Timeline />
        <!-- Timeline -->
      </div>
      <div class="w-1/6 h-auto">
        <div
          class="
            text-center
            bg-blue-400
            text-white
            hover:text-black
            border-opacity-50
            rounded-md
            p-2
            border-1
          "
        >
          Créer un Thread
        </div>
        <div
          class="
            text-center
            bg-blue-400
            text-white
            hover:text-black
            border-opacity-50
            rounded-md
            p-2
            border-1
            mt-2
          "
        >
          Suggérer une idée
        </div>
      </div>
    </div>
    <!-- Box contenant les posts -->
    <div class="flex">
      <div class="w-9/12 flex">
        <div>
          <div>
            <Post :post="thread.post" />
          </div>
          <div
            class="mt-4 w-11/12 float-right"
            v-for="response in thread.responses"
            :key="response"
          >
            <Response :response="response" />
          </div>
        </div>
      </div>
      <div class="w-3/12 ml-4 text-1">
        <div class="sticky top-0 p-2 border-1 bg-1 rounded-md">
          <div class="bg-2 border-1 rounded-md px-2 pb-1">
            <div class="font-bold text-base mb-1/2">Tags :</div>
            <Tag
              class="mr-1"
              v-for="tag in thread.tags"
              :key="tag"
              :title="tag.title"
              :color="tag.color"
            />
          </div>
          <div class="bg-2 border-1 rounded-md px-2 mt-4">
            <div class="font-bold text-base">Contributors :</div>
            <Contributors
              v-for="contributor in thread.contributors"
              :key="contributor"
              :contributor="contributor"
              class="inline-block"
            />
          </div>
          <div class="bg-2 border-1 rounded-md px-2 mt-4 pb-2">
            <div class="font-bold text-base mb-1/2">Sujets semblables :</div>
            <SimilarTopic
              v-for="topic in thread.similarTopics"
              :key="topic"
              :topic="topic"
              class="mb-2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import Post from '@/components/Post.vue'
import Response from '@/components/Response.vue'
import Timeline from '@/components/Timeline.vue'
import Tag from '@/components/Tag.vue'
import Contributors from '@/components/Contributor.vue'
import SimilarTopic from '@/components/SimilarTopic.vue'
// import Comment from '@/components/Comment.vue'

export default defineComponent({
  name: 'Thread',
  components: {
    Timeline,
    Tag,
    Contributors,
    SimilarTopic,
    Post,
    Response
    // Comment
  },
  props: {
    thread: {
      type: Object
    }
  },

  data () {
    return {}
  },
  methods: {}
})
</script>

<style scoped>
.border {
  /* border: 1px solid white; */
}
</style>

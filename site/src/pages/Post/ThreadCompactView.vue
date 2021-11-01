<template>
  <div>
    <!-- Haut de page : Timeline... -->
    <div class="flex mb-4 items-center">
      <div class="text-1 bg-3 rounded-md px-4 py-2 flex-shrink-0">
        <div class="flex space-x-2">
          <i class="ri-file-edit-fill" /> <p>{{ timeAgo (post.createdAt, 'long') }}</p>
        </div>
        <div class="flex space-x-2">
          <i class="ri-history-line" /> <p>{{ timeAgo (post.updatedAt, 'long') }}</p>
        </div>
        <div class="flex space-x-2">
          <i class="ri-eye-line" /> <p>{{ post.views }} vues</p>
        </div>
      </div>
      <div class="text-1 mx-2 w-full border-1 bg-1 rounded-md text-center h-24">
        TIMELINE
      </div>
      <div class="box-border flex flex-col space-y-3 flex-shrink-0">
        <router-link
          to="/new-post"
          class="
            text-center
            button
          "
        >
          Créer un Post
        </router-link>
        <router-link
          to="/posts"
          class="
            text-center
            button
          "
        >
          Voir d'autres posts
        </router-link>
      </div>
    </div>
    <!-- Box contenant les posts -->
    <div class="flex">
      <div class="w-9/12 flex">
        <div>
          <div>
            <Reply :post="post.post" />
          </div>
          <div
            v-for="response in post.responses"
            :key="response"
            class="mt-4 w-11/12 float-right"
          >
            <Response :response="response" />
          </div>
        </div>
      </div>
      <div class="w-3/12 ml-4 text-1 sticky top-0 space-y-2">
        <div class="bg-3 px-4 py-2">
          <div class="flex mb-2 space-x-2 text-xl items-center">
            <div class="font-bold text-md mr-4">
              Tags
            </div>
            <i class="ri-settings-2-line" />
            <i class="ri-menu-add-line" />
          </div>
          <div class="flex flex-wrap">
            <Tag
              v-for="tag in post.tags"
              :key="tag"
              class="mr-1 mb-1"
              :name="tag.title"
              :color="tag.color"
            />
          </div>
        </div>
        <div class="bg-3 px-4 py-2">
          <div class="flex mb-2 space-x-2 text-xl items-center">
            <div class="font-bold text-md mr-4">
              Contributeurs
            </div>
            <i class="ri-settings-2-line" />
            <i class="ri-arrow-left-right-line" />
          </div>
          <Contributors
            v-for="contributor in post.contributors"
            :key="contributor"
            :contributor="contributor"
            class="inline-block"
          />
        </div>
        <div class="bg-3 px-4 py-2">
          <div class="flex mb-3 space-x-2 text-xl items-center">
            <div class="font-bold text-md mr-4">
              Sujets semblables
            </div>
            <i class="ri-menu-add-line" />
            <i class="ri-arrow-left-circle-fill" />
            <i class="ri-arrow-right-circle-fill" />
          </div>
          <SimilarTopic
            v-for="topic in post.similarTopics"
            :key="topic"
            :topic="topic"
            class="mb-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import Reply from '@/components/Reply.vue'
import Response from '@/components/Response.vue'
import Tag from '@/components/Tag.vue'
import Contributors from '@/components/Contributor.vue'
import SimilarTopic from '@/components/SimilarTopic.vue'
// import Comment from '@/components/Comment.vue'

export default defineComponent({
  name: 'Thread',
  components: {
    Tag,
    Contributors,
    SimilarTopic,
    Reply,
    Response
    // Comment
  },
  props: {
    post: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    timeAgo (input, style) {
      const date = (input instanceof Date) ? input : new Date(input)
      const formatter = new Intl.RelativeTimeFormat('fr', { style })
      const ranges = {
        years: 3600 * 24 * 365,
        months: 3600 * 24 * 30,
        weeks: 3600 * 24 * 7,
        days: 3600 * 24,
        hours: 3600,
        minutes: 60,
        seconds: 1
      }
      const secondsElapsed = (date.getTime() - Date.now()) / 1000
      for (const key in ranges) {
        if (ranges[key] < Math.abs(secondsElapsed)) {
          const delta = secondsElapsed / ranges[key]
          return formatter.format(Math.round(delta), key)
        }
      }
    }
  }
})
</script>

<style scoped>
ol {
  margin: 0;
  list-style: none;
  padding: 0;
  --hue: 1;
  --unit: 1rem;
}
.event-date {
  margin: 0 0 0.25rem;
  font-weight: bold;
}
.event-description {
  margin: 0;
}
li {
  position: relative;
  display: block;
  background-color: hsl(calc(var(--hue)*360/20),90%,65%);
  border-color: hsl(calc(var(--hue)*360/20),90%,65%);
  padding: 1rem;
  margin: 2rem 0;
}
</style>

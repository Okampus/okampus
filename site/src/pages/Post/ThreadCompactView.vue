<template>
  <div>
    <!-- Haut de page : Timeline... -->
    <div class="flex mb-4 items-center">
      <div class="text-1 bg-3 rounded-md px-4 py-2 flex-shrink-0">
        <div class="flex space-x-2">
          <i class="ri-file-edit-fill" /> <p>{{ timeAgo (thread.createdAt, 'long') }}</p>
        </div>
        <div class="flex space-x-2">
          <i class="ri-history-line" /> <p>{{ timeAgo (thread.updatedAt, 'long') }}</p>
        </div>
        <div class="flex space-x-2">
          <i class="ri-eye-line" /> <p>{{ thread.views }} vues</p>
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
            <post :post="thread.post" />
          </div>
          <div
            v-for="(reply, i) in thread.replies"
            :key="i"
            class="mt-4 w-11/12 float-right"
          >
            <reply :reply="reply" />
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
            <tag
              v-for="tag in thread.tags"
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
          <contributors
            v-for="contributor in thread.contributors"
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
          <similar-topic
            v-for="topic in thread.similarTopics"
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
import Post from '@/components/Post.vue'
import Reply from '@/components/Reply.vue'
import Tag from '@/components/Tag.vue'
import Contributors from '@/components/Contributor.vue'
import SimilarTopic from '@/components/SimilarTopic.vue'

export default {
  components: {
    Tag,
    Contributors,
    SimilarTopic,
    Post,
    Reply
  },
  props: {
    thread: {
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
}
</script>

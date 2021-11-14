<template>
  <div class="px-4 py-6">
    <div class="text-1">
      <div class="px-4 pt-4 text-3xl font-bold mb-2">
        {{ thread.post.title }}
      </div>
      <div
        class="flex flex-row gap-4 text-1 rounded-md px-4 py-2 flex-shrink-0"
      >
        <div class="flex space-x-2">
          <i class="ri-file-edit-fill" />
          <p>{{ timeAgo(thread.createdAt, "long") }}</p>
        </div>
        <div class="flex space-x-2">
          <i class="ri-history-line" />
          <p>{{ timeAgo(thread.updatedAt, "long") }}</p>
        </div>
        <div class="flex space-x-2">
          <i class="ri-eye-line" />
          <p>{{ thread.views }} vues</p>
        </div>

        <!-- TODO: Talk tab -->
        <div class="border-b-2 border-blue-500">
          Post
        </div>
        <div class="border-b-2 border-transparent hover:border-blue-300">
          Talk
        </div>
      </div>
      <hr class="mt-2 mb-4">
    </div>

    <div class="flex">
      <div class="md:w-9/12">
        <div>
          <Post :post="thread.post" />
        </div>

        <div class="pt-4 text-1">
          {{ thread.replies.length }} {{ thread.replies.length > 1 ? 'Réponses' : 'Réponse' }}
        </div>
        <hr class="mt-2">

        <div
          v-for="(reply, i) in thread.replies"
          :key="i"
          class="mt-4"
        >
          <reply :reply="reply" />
        </div>
      </div>

      <div class="w-3/12 ml-4 text-1 sticky top-0 space-y-2 hidden md:block">
        <div class="border rounded-lg px-4 py-2">
          <div class="flex mb-2 space-x-2 text-xl items-center">
            <div class="font-bold text-md mr-4">
              Tags
            </div>
            <!-- TODO: Actions -->
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
        <div class="border rounded-lg px-4 py-2">
          <div class="flex mb-2 space-x-2 text-xl items-center">
            <div class="font-bold text-md mr-4">
              Contributeurs
            </div>
            <i class="ri-settings-2-line" />
            <i class="ri-arrow-left-right-line" />
          </div>
          <!-- TODO: Actions -->
          <contributors
            v-for="contributor in thread.contributors"
            :key="contributor"
            :contributor="contributor"
            class="inline-block"
          />
        </div>
        <div class="border rounded-lg px-4 py-2">
          <div class="flex mb-3 space-x-2 text-xl items-center">
            <div class="font-bold text-md mr-4">
              Sujets semblables
            </div>
            <!-- TODO: Actions -->
            <i class="ri-menu-add-line" />
            <i class="ri-arrow-left-circle-fill" />
            <i class="ri-arrow-right-circle-fill" />
          </div>
          <similar-thread
            v-for="similarThread in thread.similarThreads"
            :key="similarThread"
            :thread="similarThread"
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
import Tag from '@/components/Tag.vue'
import Contributors from '@/components/Contributor.vue'
import SimilarThread from '@/components/SimilarThread.vue'
import Post from '@/components/Post.vue'

export default defineComponent({
  components: {
    Tag,
    Contributors,
    SimilarThread,
    Reply,
    Post
  },
  props: {
    thread: {
      type: Object,
      default: () => {},
      required: true
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

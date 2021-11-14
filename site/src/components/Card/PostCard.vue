<template>
  <div>
    <div
      v-if="post"
      class="bg-0 rounded-lg rounded-l-xl"
    >
      <div class="flex gap-3">
        <div class="text-1 text-center flex flex-col flex-shrink-0 w-14 pt-1 pb-2 bg-5 rounded-l-lg">
          <i class="ri-add-line text-xl md:text-2xl mouse-icon" />
          <div class="font-medium">
            {{ abbrNumbers(post.upvotes - post.downvotes) }}
          </div>
          <i class="ri-subtract-line text-xl md:text-2xl -mt-1 mouse-icon" />
          <i class="mt-1 ri-bookmark-line mouse-icon text-lg md:text-xl" />
          <i class="mt-2 ri-star-line text-lg md:text-xl mouse-icon" />
          <div class="text-sm font-medium">
            {{ abbrNumbers(post.favorites) }}
          </div>
        </div>

        <div class="pl-1 pr-4 my-3 mr-2">
          <span class="font-light text-3 flex flex-wrap space-x-1 items-center h-6 whitespace-nowrap overflow-hidden">
            <div class="flex space-x-1 pl-1">
              <i
                :class="headerTypes[post.type]?.icon"
                class="text-1"
              />
              <div class="text-1 font-bold">
                {{ headerTypes[post.type]?.type }}
              </div>
            </div>
            <div class="flex space-x-1 pl-1">
              <p class="pr-1">•</p>
              <div
                :class="[post.solved ? 'text-red-500' : 'text-green-500']"
              >
                {{ post.solved ? 'Non-Résolu' : '✓ Résolu' }}
              </div>
            </div>
            <div class="flex space-x-1 pl-1">
              <p class="pr-1">•</p>
              <i class="ri-file-edit-fill" />
              <div>{{ timeAgo(post.createdAt) }}</div>
            </div>
            <div class="flex space-x-1 pl-1">
              <p class="pr-1">•</p>
              <i class="ri-history-line" />
              <div> {{ timeAgo(post.updatedAt) }}</div>
            </div>
            <div class="flex space-x-1 pl-1">
              <p class="pr-1">•</p>
              <i class="ri-eye-line" />
              <div>{{ abbrNumbers(post.views) }}</div>
            </div>
          </span>

          <div class="mt-1">
            <router-link
              :to="`/post/${post.postId}`"
              class="text-xl text-0 font-semibold hover:underline line-clamp-1"
            >
              {{ post.title }}
            </router-link>

            <p class="mt-1 text-2 text-justify line-clamp-2">
              {{ postPreview(JSON.parse(post.body) || '') }}
            </p>
          </div>

          <div class="relative">
            <div class="flex items-start space-x-2 h-12 mt-4 space-y-2 mr-4">
              <a
                href="#"
                class="flex flex-shrink-0 items-center"
              >
                <img
                  :src="post.author?.avatar || require('@/assets/img/default_avatars/user.png')"
                  alt="avatar"
                  class="mr-2 w-10 h-10 rounded-full"
                >

                <div class="flex flex-col">
                  <div class="text-1 font-bold text hover:underline">
                    {{ post.author?.username }}
                  </div>
                  <div class="text-sm text-2">{{ abbrNumbers(post.author?.reputation) }}</div>
                </div>
              </a>
              <div class="flex-shrink-0 font-medium text-1 pl-2">
                Tags :
              </div>
              <tags-list :tags="post.tags" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="bg-0 rounded-lg flex space-x-2 py-3 px-5 font-semibold"
    >
      <p class="text-lg text-0">
        Erreur: Ce post est vide.
      </p>

      <!-- TODO: Bug report pages -->
      <router-link
        :to="`/report-bug/posts`"
        class="text-lg font-semibold link-blue line-clamp-1"
      >
        Signalez ce bug !
      </router-link>
    </div>
  </div>
</template>

<script lang="js">
import { generateHTML } from '@tiptap/html'
import TagsList from '@/components/List/TagsList.vue'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'

import { abbrNumbers } from '../../utils/abbrNumbers'
import { timeAgo } from '../../utils/timeAgo'

export default {
  components: {
    TagsList
  },
  props: {
    post: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      headerTypes: {
        1: { type: 'Question', icon: 'ri-questionnaire-line' },
        2: { type: 'Suggestion', icon: 'ri-lightbulb-line' },
        3: { type: 'Problème', icon: 'ri-error-warning-line' },
        4: { type: 'Discussion', icon: 'ri-discuss-line' }
      },
      solvedState: {
        0: { state: 'Non-Résolu', class: 'text-red-500' },
        1: { state: '✓ Résolu', class: 'text-green-500' }
      }
    }
  },
  methods: {
    abbrNumbers,
    timeAgo,
    extractContent (s, space) {
      var span = document.createElement('span')
      span.innerHTML = s
      if (space) {
        var children = span.querySelectorAll('*')
        for (var i = 0; i < children.length; i++) {
          if (children[i].textContent) { children[i].textContent += ' ' } else { children[i].innerText += ' ' }
        }
      }
      return [span.textContent || span.innerText].toString().replace(/ +/g, ' ')
    },

    postPreview (postJson) {
      return this.extractContent(generateHTML(postJson,
        [
          StarterKit.configure({
            heading: {
              levels: [1, 2, 3]
            }
          }),
          Highlight,
          Typography,
          Placeholder,
          Underline,
          CharacterCount
        ]
      ), true)
    }
  }
}
</script>

<template>
    <div>
        <div
            v-if="post"
            class="bg-0 rounded-lg rounded-l-xl w-full"
        >
            <div class="flex w-full gap-3">
                <div class="text-1 text-center flex flex-col flex-shrink-0 w-14 pt-1 pb-2 bg-5 rounded-l-lg">
                    <i class="ri-add-line text-xl md:text-2xl mouse-icon" />
                    <div class="font-medium">
                        {{ abbrNumbers(post.upvotes - post.downvotes) }}
                    </div>
                    <i class="ri-subtract-line text-xl md:text-2xl -mt-1 mouse-icon" />
                    <i class="mt-1 ri-bookmark-line mouse-icon text-lg md:text-xl" />
                    <i class="mt-2 ri-star-line text-lg md:text-xl mouse-icon" />
                </div>

                <div class="pl-1 pr-4 my-3 mr-2">
                    <span class="font-light text-3 flex flex-wrap space-x-1 items-center h-6 whitespace-nowrap overflow-hidden">
                        <div class="flex space-x-1 pl-1">
                            <i
                                :class="postTypesEnum[post.type]?.icon"
                                class="text-1"
                            />
                            <div class="text-1 font-bold">
                                {{ postTypesEnum[post.type]?.fr }}
                            </div>
                        </div>
                        <div class="flex space-x-1 pl-1">
                            <p class="pr-1">•</p>
                            <div
                                :class="[post.solved ? 'text-green-500' : 'text-red-500']"
                            >
                                {{ post.solved ? '✓ Résolu' : 'Non-Résolu' }}
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
                            <div> {{ timeAgo(post.contentLastUpdatedAt) }}</div>
                        </div>
                    </span>

                    <div class="mt-1">
                        <router-link
                            :to="`/posts/${post.postId}`"
                            class="text-xl text-0 font-semibold hover:underline line-clamp-1"
                        >
                            {{ post.title }}
                        </router-link>

                        <p class="mt-1 text-2 text-justify line-clamp-2">
                            {{ extractTextFromTipTapJSON(JSON.parse(post.body)) }}
                        </p>
                    </div>

                    <div class="flex items-start space-x-2 h-12 mt-4 mr-4">
                        <a
                            href="#"
                            class="flex flex-shrink-0 items-center mr-4"
                        >
                            <user-preview
                                :username="post.author.username"
                                :avatar="post.author.avatar"
                                :reputation="post.author.reputation"
                            />
                        </a>


                        <TagsList
                            class="w-full"
                            :tags="post.tags"
                        />
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

import { abbrNumbers } from '@/utils/abbrNumbers'
import { timeAgo } from '@/utils/timeAgo'
import { extractTextFromTipTapJSON } from '@/utils/tiptap'
import UserPreview from '@/components/User/UserPreview.vue'
import TagsList from '@/components/List/TagsList.vue'
import postTypesEnum from '@/shared/types/post-types.enum'

export default {
    components: {
        UserPreview,
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
            postTypesEnum,
            // solvedState: {
            //     0: { state: 'Non-Résolu', class: 'text-red-500' },
            //     1: { state: '✓ Résolu', class: 'text-green-500' }
            // }
        }
    },
    methods: {
        abbrNumbers,
        timeAgo,
        extractTextFromTipTapJSON
    }
}
</script>

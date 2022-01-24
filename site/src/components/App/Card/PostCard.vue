<template>
    <div>
        <div v-if="post" class="w-full rounded-lg rounded-l-xl bg-0">
            <div class="flex gap-3 m-4 w-full">
                <div class="pr-4 pl-1 my-3 mr-2">
                    <span
                        class="flex overflow-hidden flex-wrap gap-5 items-center h-6 font-light whitespace-nowrap text-3"
                    >
                        <div class="flex gap-1 items-center pl-1">
                            <font-awesome-icon :icon="postTypesEnum[post.type]?.icon" class="text-1" />
                            <div class="font-bold text-1">
                                {{ postTypesEnum[post.type]?.fr }}
                            </div>
                        </div>
                        <div :class="[post.solved ? 'text-green-500' : 'text-red-500']">
                            {{ post.solved ? '✓ Résolu' : 'Non-Résolu' }}
                        </div>
                        <div class="flex gap-2 items-center pl-1">
                            <font-awesome-icon icon="hourglass-end" />
                            <div>{{ timeAgo(post.createdAt) }}</div>
                        </div>
                        <div class="flex gap-2 items-center pl-1">
                            <font-awesome-icon icon="history" />
                            <div>{{ timeAgo(post.contentLastUpdatedAt) }}</div>
                        </div>
                    </span>

                    <div class="mt-1">
                        <router-link
                            :to="`/posts/${post.postId}`"
                            class="text-xl font-semibold hover:underline line-clamp-1 text-0"
                        >
                            {{ post.title }}
                        </router-link>

                        <p class="mt-1 text-justify line-clamp-2 text-2">
                            {{ extractTextFromTipTapJSON(JSON.parse(post.body)) }}
                        </p>
                    </div>

                    <div class="flex items-start mt-4 mr-4 space-x-2 h-12">
                        <a href="#" class="flex shrink-0 items-center mr-4">
                            <UserPreview
                                :username="post.author.username"
                                :avatar="post.author.avatar"
                                :reputation="post.author.reputation"
                            />
                        </a>

                        <TagsList class="w-full" :tags="post.tags" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex py-3 px-5 space-x-2 font-semibold rounded-lg bg-0">
            <p class="text-lg text-0">Erreur: Ce post est vide.</p>

            <!-- TODO: Bug report pages -->
            <router-link :to="`/report-bug/posts`" class="text-lg font-semibold line-clamp-1 link-blue">
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
import TagsList from '@/components/List/TagList.vue'
import postTypesEnum from '@/shared/types/post-types.enum'

export default {
    components: {
        UserPreview,
        TagsList,
    },
    props: {
        post: {
            type: Object,
            default: () => {},
        },
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
        extractTextFromTipTapJSON,
    },
}
</script>

<template>
    <div class="mb-4">
        <div v-if="thread" class="w-full rounded-lg rounded-l-xl bg-0">
            <div class="py-3 px-5 w-full">
                <span
                    class="flex overflow-hidden flex-wrap gap-5 items-center h-6 font-light whitespace-nowrap text-3"
                >
                    <div class="flex gap-2 items-center">
                        <font-awesome-icon :icon="postTypesEnum[thread.type]?.icon" class="text-1" />
                        <div class="font-bold text-1">
                            {{ postTypesEnum[thread.type][$i18n.locale] }}
                        </div>
                    </div>
                    <div :class="[thread.solved ? 'text-green-600' : 'text-red-500']">
                        {{ thread.solved ? 'Résolu' : 'Non-Résolu' }}
                    </div>
                    <div class="flex gap-2 items-center pl-1">
                        <font-awesome-icon icon="hourglass-end" />
                        <div>{{ timeAgo(thread.createdAt) }}</div>
                    </div>
                    <div class="flex gap-2 items-center pl-1">
                        <font-awesome-icon icon="history" />
                        <div>{{ timeAgo(thread.post.contentLastUpdatedAt) }}</div>
                    </div>
                </span>

                <div class="mt-2">
                    <router-link
                        :to="`/posts/${thread.contentMasterId}`"
                        class="text-xl font-semibold hover:underline line-clamp-1 text-0"
                    >
                        {{ thread.title }}
                    </router-link>

                    <p class="mt-1 text-justify line-clamp-2 text-2">
                        {{ extractTextFromTipTapJSON(JSON.parse(thread.post.body)) }}
                    </p>
                </div>

                <div class="flex items-center mt-2 mr-4 space-x-2 h-12">
                    <a href="#" class="flex shrink-0 items-center mr-4">
                        <UserPreview
                            :username="thread.post.author?.fullname ?? 'Anonyme'"
                            :img-size="12"
                            :avatar="thread.post.author?.avatar"
                            :reputation="thread.post.author?.reputation ?? 0"
                        />
                    </a>

                    <TagsList class="w-full" :tags="thread.tags" />
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

    import TagsList from '@/components/List/TagList.vue'
    import UserPreview from '@/components/User/UserPreview.vue'
    import postTypesEnum from '@/shared/types/post-types.enum'
    import { abbrNumbers } from '@/utils/abbrNumbers'
    import { timeAgo } from '@/utils/timeAgo'
    import { extractTextFromTipTapJSON } from '@/utils/tiptap'


    export default {
        components: {
            UserPreview,
            TagsList,
        },
        props: {
            thread: {
                type: Object,
                default: () => {},
            },
        },
        data () {
            return { postTypesEnum }
        },
        methods: {
            abbrNumbers,
            timeAgo,
            extractTextFromTipTapJSON,
        },
    }
</script>

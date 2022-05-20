<template>
    <div class="flex flex-col gap-5 mx-4 md:mx-auto md:w-23/24 text-0">
        <div class="flex gap-5">
            <AppTag
                :icon="thread._type.icon"
                :tag-color="thread._type.color"
                :tag-name="thread._type[$i18n.locale]"
            />
            <p class="text-2xl break-all text-1">{{ thread.title }}</p>
        </div>

        <!-- <div class="flex flex-row gap-3">
            <UserAvatar
                :img-src="thread.getUser(thread._post.author).avatar"
                :size="size"
                :username="fullname(thread.getUser(thread._post.author))"
            />
            <div class="flex flex-col">
                <div>
                    {{ fullname(thread.getUser(thread._post.author)) }}
                </div>
                <DatePreview class="text-sm text-2" :date="thread.createdAt" />
            </div>
        </div> -->

        <div class="flex">
            <div class="w-full">
                <div class="flex flex-col gap-3">
                    <ThreadPost :post="thread._post" />

                    <template v-if="thread.replies.length > 0">
                        <div class="my-3">
                            <div class="mb-1 ml-2">
                                {{
                                    `${thread.replies.length} réponse${thread.replies.length > 1 ? 's' : ''}`
                                }}
                            </div>
                        </div>
                        <ThreadReply v-for="(reply, i) in thread.replies" :key="i" :reply="reply" />
                    </template>

                    <ThreadNewReply
                        :thread-id="thread.contentMasterId"
                        :parent-id="thread.post.contentId"
                        :first="thread.replies.length === 0"
                    />
                </div>
            </div>

            <div class="hidden sticky top-0 ml-4 space-y-2 w-3/12 lg:block text-1">
                <div class="p-4 rounded-lg bg-card-within-1">
                    <div class="flex items-center mb-2 space-x-2 text-xl">
                        <div class="mr-4 font-bold text-md">Tags</div>
                    </div>
                    <div v-if="thread.tags?.length" class="flex flex-wrap">
                        <AppTag
                            v-for="tag in thread.tags"
                            :key="tag"
                            class="mr-1 mb-1"
                            :tag-name="tag.name"
                            :tag-color="tag.color"
                        />
                    </div>
                    <div v-else class="italic">Aucun tag</div>
                </div>
                <div class="p-4 rounded-lg bg-card-within-1">
                    <div class="flex items-center mb-2 space-x-2 text-xl">
                        <div class="mr-4 font-bold text-md">Assigné</div>
                        <!-- TODO: Actions : Settings, Add -->
                    </div>
                    <div v-if="thread.assignees?.length" class="flex flex-col">
                        <UserPreview
                            v-for="(assigned, i) in thread.assignees"
                            :key="i"
                            :user="assigned"
                            mode="horizontal"
                        />
                    </div>
                    <div v-else class="italic">Personne n'est assigné</div>
                </div>
                <div class="p-4 rounded-lg bg-card-within-1">
                    <div class="flex items-center mb-2 space-x-2 text-xl">
                        <div class="mr-4 font-bold text-md">Participants</div>
                        <!-- TODO: Actions : Settings, Add -->
                    </div>
                    <div class="flex flex-col">
                        <UserPreview
                            v-for="(participant, i) in thread.participants"
                            :key="i"
                            :user="participant"
                            mode="horizontal"
                        />
                    </div>
                </div>
                <!-- <div class="card">
                        <div class="flex items-center mb-3 space-x-2 text-xl">
                            <div class="mr-4 font-bold text-md">Sujets semblables</div>
                            TODO: Actions : Suggest, next page
                        </div>
                        <SimilarThread
                            v-for="similarThread in post.similarThreads"
                            :key="similarThread"
                            :thread="similarThread"
                            class="mb-2"
                        />
                    </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
    import AppTag from '@/components/App/AppTag.vue'
    // import { fullname } from '@/utils/users'
    // import DatePreview from '@/components/App/Preview/DatePreview.vue'
    import UserPreview from '@/components/App/Preview/UserPreview.vue'
    // import { timeAgo } from '@/utils/timeAgo'

    import ThreadPost from '@/components/Thread/ThreadPost.vue'
    import ThreadReply from '@/components/Thread/ThreadReply.vue'
    import ThreadNewReply from '@/components/Thread/ThreadNewReply.vue'

    import { isPositiveInteger } from '@/utils/stringUtils'
    import { emitter } from '@/shared/modules/emitter'

    import { nextTick, watch, ref } from 'vue'
    import { useRoute } from 'vue-router'

    import { useThreadsStore } from '@/store/threads.store'

    import { getStatus } from '@/utils/errors'
    import { errorCodes } from '@/shared/errors/app-exceptions.enum'
    // import UserAvatar from '@/components/User/UserAvatar.vue'
    // import DatePreview from '@/components/App/Preview/DatePreview.vue'

    const route = useRoute()
    const threads = useThreadsStore()
    const thread = ref(null)

    const loadThread = async () => {
        if (route.name === 'threads') {
            const threadId = route.params.id
            if (!isPositiveInteger(threadId)) {
                emitter.emit('error-route', errorCodes.NOT_FOUND)
                return
            }

            await threads
                .getThread(threadId)
                .then(() => {
                    thread.value = threads.getThreadById(threadId)
                    nextTick(() => {
                        if (route.hash) {
                            emitter.emit('scroll-to-anchor', route.hash)
                        }
                    })
                })
                .catch((err) => {
                    emitter.emit('error-route', { code: getStatus(err.response) })
                })
        }
    }

    await loadThread()
    watch(() => route.params.id, loadThread)
</script>

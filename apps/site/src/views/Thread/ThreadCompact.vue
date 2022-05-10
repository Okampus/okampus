<template>
    <div class="flex flex-col mx-4 md:mx-auto md:w-23/24 text-0">
        <div class="flex gap-10 items-end my-6">
            <div class="flex flex-col gap-2">
                <p class="text-3xl break-all text-1">{{ thread.title }}</p>
                <div class="flex gap-4 items-center text-2">
                    <AppTag
                        :icon="thread._type.icon"
                        :tag-color="thread._type.color"
                        :tag-name="thread._type[$i18n.locale]"
                        :large="true"
                    />
                    <div class="flex gap-8">
                        <div class="flex flex-col">
                            <div class="text-sm tracking-tight text-2">Post créé par</div>
                            <div class="flex gap-2 items-center text-0">
                                <div class="flex">
                                    <div>{{ thread.getUser(thread.post.author)?.fullname }}</div>
                                    <div>,</div>
                                </div>
                                <p class="text-sm text-1">
                                    <DatePreview :date="thread.createdAt" />
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="text-sm tracking-tight text-2">
                                <!-- TODO: link to last action -->
                                <a class="link-blue"> Dernière action </a> par
                            </div>
                            <div class="flex gap-2 items-center text-0">
                                <div class="flex">
                                    <div>{{ thread.lastUpdatedBy?.fullname }}</div>
                                    <div>,</div>
                                </div>
                                <p class="text-sm text-1">
                                    <DatePreview :date="thread.lastUpdatedAt" />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="ml-10 button" @click="emitter.emit('scroll-to-anchor', 'new-reply')">
                        <p>Répondre</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex">
            <div class="w-full">
                <div class="flex flex-col gap-3">
                    <ThreadPost :post="thread._post" />

                    <template v-if="thread.replies.length > 0">
                        <div class="mt-2">
                            <div class="mb-1 ml-2">
                                {{
                                    `${thread.replies.length} réponse${thread.replies.length > 1 ? 's' : ''}`
                                }}
                            </div>
                            <hr />
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

    import DatePreview from '@/components/App/Preview/DatePreview.vue'
    import UserPreview from '@/components/App/Preview/UserPreview.vue'

    import ThreadPost from '@/components/Thread/ThreadPost.vue'
    import ThreadReply from '@/components/Thread/ThreadReply.vue'
    import ThreadNewReply from '@/components/Thread/ThreadNewReply.vue'

    import { isPositiveInteger } from '@/utils/conditions'
    import { emitter } from '@/shared/modules/emitter'

    import { nextTick, watch, ref } from 'vue'
    import { useRoute } from 'vue-router'

    import { useThreadsStore } from '@/store/threads.store'

    import { getStatus } from '@/utils/errors'
    import { errorCodes } from '@/shared/errors/app-exceptions.enum'

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

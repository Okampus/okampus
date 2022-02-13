<template>
    <AppToast v-model:active="showToast" :text="toastText" :type="toastType" />
    <div v-if="notLoaded" class="flex justify-center items-center w-full h-full text-4xl text-0">
        <!-- TODO: 404 page + fix Thread switch when on 404 -->
        404
    </div>
    <template v-else-if="isNil(thread)"><AppLoader :size="3" /></template>
    <div v-else>
        <FormReport :show="onReport" :content="reportedContent" @close="onReport = false" />
        <div class="flex flex-col mx-4 md:mx-auto md:w-23/24 text-0">
            <div class="flex gap-10 items-end my-6">
                <div class="flex flex-col gap-2">
                    <p class="text-3xl break-all text-1">{{ thread.title }}</p>
                    <div class="flex gap-4 items-center text-2">
                        <AppTag
                            :icon="postTypesEnum[thread.type]?.icon"
                            :tag-color="postTypesEnum[thread.type]?.color"
                            :tag-name="postTypesEnum[thread.type][$i18n.locale]"
                            :large="true"
                        />
                        <div class="flex gap-8">
                            <div class="flex flex-col">
                                <div class="text-sm tracking-tight text-2">Post créé par</div>
                                <div class="flex gap-2 items-center text-0">
                                    <div class="flex">
                                        <div>{{ thread.post?.author?.fullname }}</div>
                                        <div>,</div>
                                    </div>
                                    <p class="text-sm text-1">
                                        {{ timeAgo(thread.post.createdAt, 'short') }}
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
                                        <div>{{ thread.post?.author?.fullname }}</div>
                                        <div>,</div>
                                    </div>
                                    <p class="text-sm text-1">{{ lastUpdatedAt('short') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button" @click="scrollHighlight('new-reply')"><p>Répondre à ce post</p></div>
            </div>

            <div class="flex">
                <!-- TODO: FIX OVERFLOW: replace actions by icons to gain space OR use hamburger bars -->
                <div class="w-full">
                    <div class="flex flex-col gap-3">
                        <ThreadPost :post="thread.post" @report="activateReport($event)" />

                        <div v-if="thread.replies.length > 0" class="mt-2">
                            <div class="mb-1 ml-2">
                                {{
                                    `${thread.replies.length} réponse${thread.replies.length > 1 ? 's' : ''}`
                                }}
                            </div>
                            <hr />
                        </div>

                        <AppAlert v-else type="info" class="mt-2">
                            <!-- TODO: bonus for a first answer -->
                            <template #title> Sois le premier à répondre à ce post ! </template>
                            <template #text>
                                <div class="mb-2">
                                    Personne n'a encore répondu à ce post : propose une première réponse 🌟
                                </div>
                            </template>
                        </AppAlert>

                        <ThreadReply
                            v-for="(reply, i) in thread.replies"
                            :key="i"
                            :reply="reply"
                            @report="activateReport($event)"
                        />

                        <ThreadNewReply :post-parent-id="thread.post.contentId" />
                    </div>
                </div>

                <div class="hidden sticky top-0 ml-4 space-y-2 w-3/12 lg:block text-1">
                    <div class="card bg-card-within-1">
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
                    <div class="card bg-card-within-1">
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
                    <div class="card bg-card-within-1">
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
    </div>
</template>

<script>
    import postTypesEnum from '@/shared/types/post-types.enum'

    import AppAlert from '@/components/App/AppAlert.vue'
    import AppLoader from '@/components/App/AppLoader.vue'
    import AppTag from '@/components/App/AppTag.vue'

    import ThreadPost from '@/components/Thread/ThreadPost.vue'
    import ThreadReply from '@/components/Thread/ThreadReply.vue'

    import FormReport from '@/components/Form/FormReport.vue'
    import UserPreview from '@/components/User/UserPreview.vue'

    import { timeAgo } from '@/utils/timeAgo'
    import { defaultTipTapText } from '@/utils/tiptap'

    import { isNil } from 'lodash'
    import AppToast from '@/components/App/AppToast.vue'
    import ThreadNewReply from '@/components/Thread/ThreadNewReply.vue'

    export default {
        components: {
            AppLoader,
            AppTag,
            ThreadPost,
            ThreadReply,
            FormReport,
            UserPreview,
            AppAlert,
            AppToast,
            ThreadNewReply,
        },
        data() {
            return {
                postTypesEnum,
                showToast: false,
                toastText: '',
                toastType: 'info',
                reportedContent: null,
                onReport: false,
                newReply: defaultTipTapText,
                notLoaded: false,
                errorReply: false,
            }
        },
        computed: {
            loggedIn() {
                return this.$store.state.auth.loggedIn
            },
            user() {
                return this.$store.state.auth.user
            },
            thread() {
                return this.$store.getters['threads/getCurrentThread']?.contentMasterId.toString() ===
                    this.$route.params.id
                    ? this.$store.getters['threads/getCurrentThread']
                    : null
            },
            lastUpdatedAt() {
                return (mode) =>
                    this.thread ? timeAgo(this.thread.post.contentLastUpdatedAt, mode ?? 'long') : null
            },
            replies() {
                return this.thread.replies
            },
        },
        watch: { '$route': 'getThread' },
        created() {
            this.$emitter.on('show-toast', ({ text, type }) => {
                this.toastText = text
                this.toastType = type
                this.showToast = true
            })

            this.$emitter.on('report', (content) => {
                this.reportedUser = content.user
                this.reportedContent = content
                this.onReport = true
            })

            if (this.loggedIn) {
                this.getThread()
            }
        },
        methods: {
            isNil,
            timeAgo,
            scrollHighlight(id) {
                const el = document.querySelector(id.startsWith('#') ? id : `#${id}`)
                if (el) {
                    el.classList.add('highlight-active')
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    })
                    el.addEventListener(
                        'animationend',
                        () => {
                            el.classList.remove('highlight-active')
                        },
                        { once: true },
                    )
                }
            },
            getThread() {
                if (!isNil(this.$route.params.id)) {
                    if (this.$route.params.id > 0) {
                        if (this.thread === null) {
                            // TODO: CATCH: show error alert
                            this.$store
                                .dispatch('threads/getThread', this.$route.params.id)
                                .then(() => {
                                    this.$nextTick(() => {
                                        if (this.$route.hash) {
                                            this.scrollHighlight(this.$route.hash)
                                        }
                                    })
                                })
                                .catch((err) => {
                                    this.notLoaded = true
                                    this.$emitter.emit('show-toast', {
                                        text: `Le thread correspondant à cette page n'a pas pu être récupéré (${
                                            err?.response?.data?.message ?? err.toString()
                                        })`,
                                        type: 'error',
                                    })
                                })
                        }
                    } else {
                        this.$router.push('/posts')
                    }
                }
            },
            votePost(vote) {
                this.$store.dispatch('threads/voteContent', {
                    contentId: this.thread.post.contentId,
                    vote,
                })
            },
        },
    }
</script>

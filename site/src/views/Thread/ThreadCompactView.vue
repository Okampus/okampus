<template>
    <AppToast v-model:active="showToast" :text="toastText" :type="toastType" />
    <FormReport :show="onReport" :user="reportedUser" :content="reportedContent" @close="onReport = false" />
    <template v-if="isNil(thread)"><AppLoader :size="3" /></template>
    <div v-else>
        <div class="flex flex-col my-6 mx-auto md:w-21/24">
            <div class="flex gap-4 items-center mb-4 ml-4 text-xl font-bold md:ml-0 text-1">
                <AppTag
                    :icon="postTypesEnum[thread.type]?.icon"
                    :tag-color="postTypesEnum[thread.type]?.color"
                    :tag-name="postTypesEnum[thread.type][$i18n.locale]"
                    :large="true"
                />
                <p class="text-2xl break-all">{{ thread.title }}</p>
            </div>
            <div class="flex">
                <!-- TODO: FIX OVERFLOW: replace actions by icons to gain space OR use hamburger bars -->
                <div class="overflow-x-scroll px-0 w-full rounded-none md:rounded-md card">
                    <div class="mx-4 text-1">
                        <div class="flex justify-between items-center mx-2">
                            <div class="flex gap-4 items-center text-sm text-2">
                                <div class="flex gap-2 items-center">
                                    <font-awesome-icon icon="calendar" />
                                    <p>{{ timeAgo(thread.post.createdAt, 'long') }}</p>
                                </div>
                                <div class="flex gap-2 items-center">
                                    <font-awesome-icon icon="history" />
                                    <p>{{ lastUpdatedAt }}</p>
                                </div>
                            </div>
                        </div>
                        <hr class="mt-3 mb-2" />
                    </div>

                    <div class="flex flex-col gap-3 mx-4">
                        <ThreadPost :post="thread.post" @report="activateReport($event)" />

                        <div v-if="thread.replies.length > 0" class="mt-2 ml-4">
                            <div class="mx-2">
                                {{
                                    thread.replies.length > 1
                                        ? `${thread.replies.length} réponses`
                                        : `${thread.replies.length} réponse`
                                }}
                            </div>
                            <hr class="my-2" />
                        </div>

                        <AppAlert v-else type="info" class="mt-2">
                            <!-- TODO: bonus for a first answer -->
                            <template #title> Sois le premier à répondre à ce post ! </template>
                            <template #text>
                                <div class="mb-2">
                                    Personne n'a encore répondu à ce post : n'hésite pas à proposer une
                                    première réponse 🌟
                                </div>
                            </template>
                        </AppAlert>

                        <ThreadReply
                            v-for="(reply, i) in thread.replies"
                            :key="i"
                            :reply="reply"
                            @report="activateReport($event)"
                        />

                        <p class="mt-2 ml-6 label-title">Ta réponse</p>
                        <ThreadReply
                            v-model:body="newReply"
                            :new-reply="true"
                            :closeable="false"
                            @send="sendReply()"
                        />
                    </div>
                </div>

                <div class="hidden sticky top-0 ml-4 space-y-2 w-3/12 lg:block text-1">
                    <div class="card">
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
                    <div class="card">
                        <div class="flex items-center mb-2 space-x-2 text-xl">
                            <div class="mr-4 font-bold text-md">Assigné</div>
                            <!-- TODO: Actions : Settings, Add -->
                        </div>
                        <div v-if="thread.assignees?.length" class="flex flex-col">
                            <UserPreview
                                v-for="(assigned, i) in thread.assignees"
                                :key="i"
                                :img-size="12"
                                :username="assigned.fullname"
                                :avatar="assigned.avatar"
                                :reputation="assigned.reputation"
                                mode="horizontal"
                            />
                        </div>
                        <div v-else class="italic">Personne n'est assigné</div>
                    </div>
                    <div class="card">
                        <div class="flex items-center mb-2 space-x-2 text-xl">
                            <div class="mr-4 font-bold text-md">Participants</div>
                            <!-- TODO: Actions : Settings, Add -->
                        </div>
                        <div class="flex flex-col">
                            <UserPreview
                                v-for="(participant, i) in thread.participants"
                                :key="i"
                                :img-size="12"
                                :username="participant.fullname"
                                :avatar="participant.avatar"
                                :reputation="participant.reputation"
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
    import defaultAvatar from '@/assets/img/default_avatars/user.png'

    import AppAlert from '@/components/App/AppAlert.vue'
    import AppLoader from '@/components/App/AppLoader.vue'
    import AppTag from '@/components/App/AppTag.vue'

    import ThreadPost from '@/components/Thread/ThreadPost.vue'
    import ThreadReply from '@/components/Thread/ThreadReply.vue'

    import FormReport from '@/components/Form/FormReport.vue'
    import UserPreview from '@/components/User/UserPreview.vue'

    import { timeAgo } from '@/utils/timeAgo'
    import { defaultTipTapText } from '@/utils/tiptap'

    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'

    import { isNil } from 'lodash'
    import AppToast from '@/components/App/AppToast.vue'

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
        },
        setup() {
            return { v$: useVuelidate() }
        },
        data() {
            return {
                postTypesEnum,
                showToast: false,
                toastText: '',
                toastType: 'info',
                defaultAvatar,
                reportedUser: null,
                reportedContent: null,
                onReport: false,
                newReply: defaultTipTapText,
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
                return timeAgo(this.thread.post.contentLastUpdatedAt, 'long')
            },
            replies() {
                return this.thread.replies
            },
        },
        validations() {
            return { newReply: { required } }
        },
        watch: { '$route': 'getThread' },
        created() {
            this.$emitter.on('show-toast', ({ text, type }) => {
                this.toastText = text
                this.toastType = type
                this.showToast = true
            })

            if (this.loggedIn) {
                this.getThread()
            }
        },
        methods: {
            isNil,
            timeAgo,
            activateReport(content) {
                this.reportedUser = content.author
                this.reportedContent = content
                this.onReport = true
            },
            getThread() {
                if (!isNil(this.$route.params.id)) {
                    if (this.$route.params.id > 0) {
                        if (this.thread === null) {
                            // TODO: CATCH: show error alert
                            this.$store.dispatch('threads/getThread', this.$route.params.id).then(() => {
                                this.$nextTick(() => {
                                    if (this.$route.hash) {
                                        const el = document.querySelector(this.$route.hash)
                                        if (el) {
                                            el.classList.add('highlight-active')
                                            el.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                            })
                                        }
                                    }
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
            sendReply() {
                this.$store
                    .dispatch('threads/addReply', {
                        parentId: this.thread.post.contentId,
                        body: this.newReply,
                        contentMasterType: 'thread',
                    })
                    .then(() => {
                        this.newReply = defaultTipTapText
                    })
                    .catch(() => {
                        this.errorReply = true
                    })
            },
        },
    }
</script>

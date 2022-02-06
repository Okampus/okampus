<template>
    <FormReport :show="onReport" :user="reportedUser" :content="reportedContent" @close="onReport = false" />
    <template v-if="thread === null || thread === undefined"><AppLoader /></template>
    <div v-else>
        <div class="flex flex-col my-6 mx-auto md:w-21/24">
            <div class="flex gap-4 items-center mb-4 ml-4 text-3xl font-bold md:ml-0 text-1">
                <AppTag
                    :icon="postTypesEnum[thread.type]?.icon"
                    :tag-color="postTypesEnum[thread.type]?.color"
                    :tag-name="postTypesEnum[thread.type][$i18n.locale]"
                    large="true"
                />
                <p class="break-all">{{ thread.title }}</p>
            </div>
            <div class="flex">
                <!-- TODO: FIX OVEFLOW: replace actions by icons to gain space OR use hamburger bars -->
                <div class="overflow-x-scroll w-full rounded-none md:rounded-md card">
                    <div class="text-1">
                        <div class="flex justify-between items-center">
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

                    <div class="flex flex-col gap-3">
                        <ThreadPost
                            :post="thread.post"
                            @reply="onReply = true"
                            @report="activateReport($event)"
                        />

                        <div v-if="thread.replies.length > 0">
                            {{
                                thread.replies.length > 1
                                    ? `${thread.replies.length} réponses`
                                    : `${thread.replies.length} réponse`
                            }}
                            <hr class="my-2" />
                            <ThreadReply
                                v-if="onReply"
                                v-model:body="newReply"
                                :new-reply="true"
                                @close="onReply = false"
                                @send="sendReply()"
                            />
                        </div>

                        <div v-else class="flex gap-5 mt-2">
                            <AppAlert type="info">
                                <!-- TODO: bonus for a first answer -->
                                <template #title> Sois le premier à répondre à ce post ! </template>
                                <template #text>
                                    <div class="mb-2">
                                        Personne n'a encore répondu à ce post : n'hésite pas à proposer une
                                        première réponse :)
                                    </div>
                                    <ThreadReply
                                        v-model:body="newReply"
                                        :new-reply="true"
                                        :closeable="false"
                                        @send="sendReply()"
                                    />
                                </template>
                            </AppAlert>
                        </div>

                        <div v-for="(reply, i) in thread.replies" :key="i">
                            <ThreadReply :reply="reply" @report="activateReport($event)" />
                        </div>
                    </div>
                </div>
                <div class="hidden sticky top-0 ml-4 space-y-2 w-3/12 lg:block text-1">
                    <div class="card">
                        <div class="flex items-center mb-2 space-x-2 text-xl">
                            <div class="mr-4 font-bold text-md">Tags</div>
                        </div>
                        <div class="flex flex-wrap">
                            <AppTag
                                v-for="tag in thread.tags"
                                :key="tag"
                                class="mr-1 mb-1"
                                :tag-name="tag.name"
                                :tag-color="tag.color"
                            />
                        </div>
                    </div>
                    <div class="card">
                        <div class="flex items-center mb-2 space-x-2 text-xl">
                            <div class="mr-4 font-bold text-md">Contributeurs</div>
                            <!-- TODO: Actions : Settings, Add -->
                        </div>
                        <div class="flex flex-col">
                            <UserPreview
                                v-for="(contributor, i) in thread.contributors"
                                :key="i"
                                :img-size="12"
                                :username="contributor.fullname"
                                :avatar="contributor.avatar"
                                :reputation="contributor.reputation"
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

    export default {
        components: {
            AppLoader,
            AppTag,
            ThreadPost,
            ThreadReply,
            FormReport,
            UserPreview,
            AppAlert,
        },
        setup() {
            return { v$: useVuelidate() }
        },
        data() {
            return {
                postTypesEnum,
                defaultAvatar,
                reportedUser: null,
                reportedContent: null,
                onReport: false,
                onReply: false,
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
                return this.$store.getters['threads/getCurrentThread']
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
            if (this.loggedIn) {
                this.getThread()
            }
        },
        mounted() {
            this.$emitter.on('thread-action', () => (this.onReply = false))
        },
        methods: {
            timeAgo,
            activateReport(content) {
                this.reportedUser = content.author
                this.reportedContent = content
                this.onReport = true
            },
            getThread() {
                if (this.$route.params.id !== undefined && this.$route.params.id !== null) {
                    if (this.$route.params.id > 0) {
                        // (voluntarily not functional
                        // => decide whether to query all data in previews / how to optimize caching)
                        const thread = this.$store.getters['threads/getThreads'].find(
                            (thread) => thread.id === this.$route.params.id,
                        )

                        if (thread === undefined) {
                            // TODO: CATCH: show error alert
                            this.$store.dispatch('threads/getThread', this.$route.params.id)
                        } else {
                            this.$store.commit('threads/setCurrentThread', thread)
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
                        this.onReply = false
                    })
                    .catch(() => {
                        this.errorReply = true
                    })
            },
        },
    }
</script>

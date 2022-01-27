<template>
    <!-- <JsonView :data="thread" /> -->
    <FormReport :show="onReport" :user="reportedUser" :content="reportedContent" @close="onReport = false" />
    <div v-if="thread === null || thread === undefined"><AppLoader /></div>
    <div v-else>
        <div class="flex flex-col my-6 mx-auto md:w-21/24">
            <div class="flex gap-4 mb-4 ml-4 w-full text-3xl font-bold md:ml-0 md:w-9/12 text-1">
                <div class="flex gap-2 items-center">
                    ⎡
                    <font-awesome-icon :icon="postTypesEnum[thread.type]?.icon" class="-ml-1 text-1" />
                    <div class="-mr-1 font-bold text-1">{{ postTypesEnum[thread.type][$i18n.locale] }}</div>
                    ⎦
                </div>
                <p>{{ thread.title }}</p>
            </div>
            <div class="flex">
                <div class="w-full rounded-none md:rounded-md card">
                    <div class="text-1">
                        <div class="flex justify-between items-center">
                            <div class="flex gap-4 items-center text-sm text-2">
                                <div class="flex gap-2 items-center">
                                    <font-awesome-icon icon="hourglass-end" />
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

                    <div>
                        <div>
                            <PostMessage
                                :post="thread.post"
                                @reply="onReply = true"
                                @report="activateReport($event)"
                            />
                        </div>

                        <div class="mt-6 text-1">
                            {{ thread.replies.length }}
                            {{ thread.replies.length > 1 ? 'réponses' : 'réponse' }}
                        </div>

                        <hr class="mt-2" />

                        <div v-if="onReply" class="flex mt-3">
                            <div class="flex flex-col items-center p-3 mt-4 -ml-5 w-4/24">
                                <UserPreview
                                    :username="user?.fullname ?? 'Anonyme'"
                                    :avatar="user?.avatar"
                                    mode="vertical"
                                />
                            </div>
                            <div class="flex flex-col gap-4 w-21/24">
                                <TipTapEditor
                                    v-model="newReply"
                                    :char-count="10000"
                                    :char-count-show-at="4000"
                                    class="w-full"
                                    :sendable="true"
                                    :cancellable="true"
                                    @send="sendReply()"
                                    @cancel="closeReply()"
                                >
                                    <template #error>
                                        <AppError
                                            v-if="errorReply"
                                            error="Il y'a eu une erreur lors de l'envoi de cette réponse."
                                        />
                                    </template>
                                </TipTapEditor>
                            </div>
                        </div>
                        <div v-for="(reply, i) in thread.replies" :key="i" class="mt-4">
                            <Reply :reply="reply" @report="activateReport($event)" />
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

<script lang="js">
    import postTypesEnum from '@/shared/types/post-types.enum'

    import defaultAvatar from '@/assets/img/default_avatars/user.png'
    import AppError from '@/components/App/AppError.vue'
    import AppTag from '@/components/App/AppTag.vue'
    // import Contributors from '@/components/Thread/ThreadContributor.vue'
    import PostMessage from '@/components/Thread/ThreadPost.vue'
    import Reply from '@/components/Thread/ThreadReply.vue'
    // import SimilarThread from '@/components/Thread/ThreadSimilar.vue'
    import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'
    import { timeAgo } from '@/utils/timeAgo'
    import { defaultTipTapText } from '@/utils/tiptap'
    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'
    import UserPreview from '@/components/User/UserPreview.vue'
    import FormReport from '@/components/Form/FormReport.vue'
    import AppLoader from '@/components/App/AppLoader.vue'

    export default {
        components: {
            AppTag,
            // Contributors,
            // SimilarThread,
            Reply,
            PostMessage,
            TipTapEditor,
            AppError,
            UserPreview,
            FormReport,
            AppLoader,
        },
        setup () {
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
            loggedIn () {
                return this.$store.state.auth.status.loggedIn
            },
            user () {
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
        created () {
            if (this.loggedIn) {
                this.getThread()
            }
        },
        mounted () {
            this.$emitter.on('thread-action', () => this.onReply = false)
        },
        methods: {
            timeAgo,
            activateReport(content) {
                console.log('ACTIVATING', content)
                this.reportedUser = content.author
                this.reportedContent = content
                this.onReport = true
            },
            getThread() {
                if (this.$route.params.id !== undefined && this.$route.params.id !== null) {
                    if (this.$route.params.id > 0) {
                        this.$store.dispatch('threads/getThread', this.$route.params.id)
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
            closeReply() {
                this.errorReply = false
                this.onReply = false
                this.newReply = defaultTipTapText
            },
            sendReply() {
                this.$store.dispatch('threads/addReply', {
                    parentId: this.thread.post.contentId,
                    body: this.newReply,
                    contentMasterType: 'thread',
                })
                    .then(() => { this.closeReply() })
                    .catch(() => { this.errorReply = true })
            },
        },
    }
</script>

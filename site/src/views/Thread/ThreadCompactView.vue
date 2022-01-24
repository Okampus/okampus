<template>
    <div v-if="post === null || post === undefined">Ce post n'existe pas.</div>
    <div v-else>
        <div class="flex flex-col my-6 mx-auto md:w-21/24">
            <div class="mb-4 ml-4 w-full text-3xl font-bold md:ml-0 md:w-9/12 text-1">
                {{ post.title }}
            </div>
            <div class="flex">
                <div class="w-full rounded-none md:rounded-md card">
                    <div class="text-1">
                        <div class="flex justify-between items-center">
                            <div class="flex gap-4 items-center text-sm text-2">
                                <div class="flex gap-2 items-center">
                                    <font-awesome-icon icon="hourglass-end" />
                                    <p>{{ timeAgo(post.createdAt, 'long') }}</p>
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
                            <div>
                                <PostMessage :post="post" @reply="onReply = true" />
                            </div>
                            <div class="pt-4 text-1">
                                {{ post.replies.length }}
                                {{ post.replies.length > 1 ? 'Réponses' : 'Réponse' }}
                            </div>
                            <hr class="mt-2" />
                            <div v-if="onReply" class="flex mt-3">
                                <div class="flex flex-col items-center mt-4 w-3/24">
                                    <img
                                        :src="user.avatar || default_avatar"
                                        alt="Profile Picture"
                                        class="mt-2 w-10 h-10 rounded-full"
                                    />
                                    <div class="text-sm font-medium text-center">
                                        {{ user.username }}
                                    </div>
                                </div>
                                <div class="flex flex-col gap-4 w-21/24">
                                    <TipTapEditor
                                        v-model="newReply"
                                        :char-count="240"
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
                            <div v-for="(reply, i) in replies" :key="i" class="mt-4">
                                <Reply :reply="reply" />
                            </div>
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
                                v-for="tag in post.tags"
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
                        <Contributors
                            v-for="contributor in post.contributors"
                            :key="contributor"
                            :contributor="contributor"
                            class="inline-block"
                        />
                    </div>
                    <div class="card">
                        <div class="flex items-center mb-3 space-x-2 text-xl">
                            <div class="mr-4 font-bold text-md">Sujets semblables</div>
                            <!-- TODO: Actions : Suggest, next page -->
                        </div>
                        <SimilarThread
                            v-for="similarThread in post.similarThreads"
                            :key="similarThread"
                            :thread="similarThread"
                            class="mb-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">

import Reply from '@/components/Thread/ThreadReply.vue'
import AppTag from '@/components/App/AppTag.vue'
import Contributors from '@/components/Thread/ThreadContributor.vue'
import SimilarThread from '@/components/Thread/ThreadSimilar.vue'
import PostMessage from '@/components/Thread/ThreadPost.vue'
import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import default_avatar from '@/assets/img/default_avatars/user.png'
import AppError from '@/components/App/AppError.vue'
import { timeAgo } from '@/utils/timeAgo'
import { defaultTipTapText } from '@/utils/tiptap'

export default {
    components: {
        AppTag,
        Contributors,
        SimilarThread,
        Reply,
        PostMessage,
        TipTapEditor,
        AppError,
    },
    setup () {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            default_avatar,
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
        lastUpdatedAt() {
            return timeAgo(this.post.contentLastUpdatedAt, 'long')
        },
        replies() {
            return this.post.replies
        },
        post() {
            return this.$store.state.thread.thread
        },
    },
    validations() {
        return { newReply: { required } }
    },
    watch: { '$route': 'fetchPost' },
    created () {
        if (this.loggedIn) {
            this.fetchPost()
        }
    },
    mounted () {
        this.emitter.on('thread-action', () => this.onReply = false)
    },
    methods: {
        fetchPost() {
            if (this.$route.params.id) {
                this.$store.dispatch('thread/fetchThread', this.$route.params.id)
            }
        },
        timeAgo,
        votePost(vote) {
            this.$store.dispatch('thread/postPostVote', {
                postId: this.$route.params.id,
                vote,
            })
        },
        closeReply() {
            this.errorReply = false
            this.onReply = false
            this.newReply = defaultTipTapText
        },
        sendReply() {
            this.$store.dispatch('thread/addReply', {
                postId: this.post.postId,
                body: this.newReply,
            })
                .then(() => { this.closeReply() })
                .catch(() => { this.errorReply = true })
        },
    },
}
</script>

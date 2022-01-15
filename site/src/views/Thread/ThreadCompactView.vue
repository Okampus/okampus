<template>
    <div v-if="post === null || post === undefined">
        Ce post n'existe pas.
    </div>
    <div v-else>
        <div class="w-21/24 mx-auto my-6 flex flex-col">
            <div class="text-1 w-full md:w-9/12 text-3xl font-bold mb-4">
                {{ post.title }}
            </div>
            <div class="flex ">
                <div class="card w-full">
                    <div class="text-1">
                        <div class="flex justify-between items-center">
                            <div class="text-2 text-sm flex gap-2">
                                <div class="flex space-x-2">
                                    <i class="ri-pencil-line" />
                                    <p>{{ timeAgo(post.createdAt, "long") }}</p>
                                </div>
                                <div class="flex space-x-2">
                                    <i class="ri-history-line" />
                                    <p>{{ lastUpdatedAt }}</p>
                                </div>
                            </div>
                        </div>
                        <hr class="mt-3 mb-2">
                    </div>
                    <div>
                        <div>
                            <div>
                                <PostMessage
                                    :post="post"
                                    @reply="onReply = true"
                                />
                            </div>
                            <div class="pt-4 text-1">
                                {{ post.replies.length }} {{ post.replies.length > 1 ? 'Réponses' : 'Réponse' }}
                            </div>
                            <hr class="mt-2">
                            <div
                                v-if="onReply"
                                class="flex mt-3"
                            >
                                <div class="w-3/24 flex flex-col items-center mt-4">
                                    <img
                                        :src="user.avatar || default_avatar"
                                        alt="Profile Picture"
                                        class="w-10 h-10 rounded-full mt-2 "
                                    >
                                    <div class="font-medium text-center text-sm">
                                        {{ user.username }}
                                    </div>
                                </div>
                                <div class="flex flex-col w-21/24 gap-4">
                                    <tip-tap-editor
                                        v-model="newReply"
                                        :char-count-limit="240"
                                        class="w-full"
                                        :sendable="true"
                                        :cancellable="true"
                                        @send="sendReply()"
                                        @cancel="closeReply()"
                                    >
                                        <template #error>
                                            <ErrorWrapper
                                                v-if="errorReply"
                                                error="Il y'a eu une erreur lors de l'envoi de cette réponse."
                                            />
                                        </template>
                                    </tip-tap-editor>
                                </div>
                            </div>
                            <div
                                v-for="(reply, i) in replies"
                                :key="i"
                                class="mt-4"
                            >
                                <reply :reply="reply" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-3/12 ml-4 text-1 sticky top-0 space-y-2 hidden lg:block">
                    <div class="card">
                        <div class="flex mb-2 space-x-2 text-xl items-center">
                            <div class="font-bold text-md mr-4">
                                Tags
                            </div>
                        </div>
                        <div class="flex flex-wrap">
                            <tag
                                v-for="tag in post.tags"
                                :key="tag"
                                class="mr-1 mb-1"
                                :tag-name="tag.name"
                                :color="tag.color"
                            />
                        </div>
                    </div>
                    <div class="card">
                        <div class="flex mb-2 space-x-2 text-xl items-center">
                            <div class="font-bold text-md mr-4">
                                Contributeurs
                            </div>
                            <!-- TODO: Actions -->
                            <!-- <i class="ri-settings-2-line" />
                            <i class="ri-arrow-left-right-line" /> -->
                        </div>
                        <contributors
                            v-for="contributor in post.contributors"
                            :key="contributor"
                            :contributor="contributor"
                            class="inline-block"
                        />
                    </div>
                    <div class="card">
                        <div class="flex mb-3 space-x-2 text-xl items-center">
                            <div class="font-bold text-md mr-4">
                                Sujets semblables
                            </div>
                            <!-- TODO: Actions -->
                            <!-- <i class="ri-menu-add-line" />
                            <i class="ri-arrow-left-circle-fill" />
                            <i class="ri-arrow-right-circle-fill" /> -->
                        </div>
                        <similar-thread
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
import Reply from '@/components/Thread/PostReply.vue'
import Tag from '@/components/ColoredTag.vue'
import Contributors from '@/components/Thread/PostContributor.vue'
import SimilarThread from '@/components/Thread/SimilarThread.vue'
import PostMessage from '@/components/Thread/PostMessage.vue'
import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
// import { posts } from '../../fake/posts'

import default_avatar from '@/assets/img/default_avatars/user.png'
import ErrorWrapper from '@/components/ErrorWrapper.vue'
import { timeAgo } from '@/utils/timeAgo'

const emptyTipTapValue = '{"type":"doc","content":[{"type":"paragraph"}]}'

export default {
    components: {
        Tag,
        Contributors,
        SimilarThread,
        Reply,
        PostMessage,
        TipTapEditor,
        ErrorWrapper
    },
    setup () {
        return { v$: useVuelidate() }
    },
    data() {
        return {
            default_avatar,
            onReply : false,
            newReply: emptyTipTapValue,
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
            console.log(this.post.contentLastUpdatedAt, timeAgo(this.post.contentLastUpdatedAt, 'long'))
            return timeAgo(this.post.contentLastUpdatedAt, 'long')
        },
        replies() {
            return this.post.replies
        },
        post() {
            return this.$store.state.thread.thread
        }
    },
    validations(){
        return {
            newReply: { required }
        }
    },
    watch: {
        '$route': 'fetchPost'
    },
    created () {
        if (this.loggedIn) {
            this.fetchPost()
        }
    },
    methods: {
        fetchPost() {
            if (this.$route.params.id) {
                this.$store.dispatch('thread/fetchThread', this.$route.params.id)
            }
        },
        timeAgo,
        votePost(vote) {
            this.$store.dispatch('thread/postPostVote', {postId: this.$route.params.id, vote})
        },
        closeReply() {
            this.errorReply = false
            this.onReply = false
            this.newReply = emptyTipTapValue
            console.log("REPLY", this.newReply)
        },
        sendReply() {
            this.$store.dispatch('thread/addReply', {postId: this.post.postId, body: this.newReply})
                .then(() => { this.closeReply() })
                .catch(() => { this.errorReply = true })
        }
    }
}
</script>

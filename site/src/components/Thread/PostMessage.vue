<template>
    <div>
        <!-- {{ post }} -->
        <div class="text-1">
            <div class="flex mt-1">
                <div class="flex flex-col flex-shrink-0 w-3/24 items-center text-lg gap-3 -ml-4">
                    <UserPreview
                        :username="post.author?.username"
                        :avatar="post.author?.avatar"
                        img-size="14"
                        text-class="text-lg"
                        mode="vertical"
                    />

                    <div class="mt-1 flex items-center gap-2">
                        <i
                            class="ri-lg hover:text-blue-500 cursor-pointer"
                            :class="[post.currentVote === 1 ? 'ri-thumb-up-fill text-green-500' : 'ri-thumb-up-line']"
                            @click="post.currentVote === 1 ? sendVote(0) : sendVote(1)"
                        />
                        <div class="text-center text-xl">
                            {{ post.upvotes - post.downvotes }}
                        </div>
                        <i
                            class="ri-lg hover:text-blue-500 cursor-pointer"
                            :class="[post.currentVote === -1 ? 'ri-thumb-down-fill text-red-500' : 'ri-thumb-down-line ']"
                            @click="post.currentVote === -1 ? sendVote(0) : sendVote(-1)"
                        />
                    </div>

                    <div class="flex flex-col mt-3">
                        <div
                            v-for="(action, i) in otherActions"
                            :key="i"
                            class="flex items-center text-5 rounded transition cursor-pointer"
                            @click="actionsMap[action].action"
                        >
                            <i
                                :class="`${actionsMap[action].icon} ${actionsMap[action].class}`"
                                class="ri-lg"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-21/24 gap-3 bg-2 p-2 rounded-xl mt-2">
                    <div class="p-2 text-lg">
                        <EditableRender
                            v-model:content="body"
                            v-model:show="showEditor"
                            @validate="updatePost($event)"
                        />
                    </div>

                    <div class="flex justify-between items-center">
                        <!-- <UserPreview
                            :username="post.author.username"
                            :avatar="post.author.avatar"
                            :reputation="post.author.reputation"
                        /> -->

                        <div class="flex items-center ri-lg">
                            <div
                                v-for="(action, i) in actionsBar"
                                :key="i"
                                class="group flex gap-1 items-center text-5 transition rounded-lg cursor-pointer p-2"
                                @click="actionsMap[action].action"
                            >
                                <i
                                    :class="`${actionsMap[action].icon} ${actionsMap[action].class}`"
                                    class="ri-md"
                                />
                                <p
                                    :class="`${actionsMap[action].class}`"
                                    class="text-sm"
                                >
                                    {{ actionsMap[action].name() }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <PostCommentList
                        v-model:on-comment="onComment"
                        :parent-content="{type: 'post', id: post.postId}"
                        :comments="comments"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import UserPreview from '@/components/User/UserPreview.vue'
import PostCommentList from '@/components/Thread/PostCommentList.vue'
import { watch } from 'vue'
import EditableRender from '../TipTap/EditableRender.vue'

export default {
    components: {
        UserPreview,
        PostCommentList,
        EditableRender
    },
    props: {
        post: {
            type: Object,
            default: () => {}
        },
    },
    emits: ['reply'],
    data() {
        return {
            maxCommentsShown: 2,
            showEditor: false,
            body: this.post.body,
            onComment: false
        }
    },
    computed: {
        actionsBar() {
            return [
                ...[
                    'reply',
                    'addComment',
                    'report'
                ],
                ...(this.post.author.userId === this.$store.state.auth.user.userId
                    ? ['edit']
                    : [])
            ]
        },
        otherActions() {
            return ['favorite']
        },
        actionsMap () {
            return { ...( {
                reply: {
                    name: () => 'Répondre',
                    icon: 'ri-reply-fill',
                    class:"group-hover:text-blue-500",
                    action:  () => { this.$emit("reply") }
                },
                addComment: {
                    name: ()=> 'Commenter',
                    icon: 'ri-chat-new-line',
                    class: "group-hover:text-blue-500",
                    action: () => { this.onComment = true }
                },
                report: {
                    name: ()=> 'Signaler',
                    icon: 'ri-flag-line',
                    class:"group-hover:text-red-500",
                    action: () => {  }
                },
                favorite: {
                    name: ()=> 'Répondre',
                    icon: this.post?.favorited ? 'ri-star-fill' : 'ri-star-line',
                    class: this.post?.favorited ? 'group-hover:text-blue-500 text-yellow-500' : 'group-hover:text-yellow-500',
                    action: () => { this.post?.favorited ? this.deleteFavorite() : this.addFavorite() }
                }
            }),
            ...(this.post.author.userId === this.$store.state.auth.user?.userId && {
                edit: {
                    name: () => 'Éditer',
                    condition: () => this.isUser(),
                    icon: 'ri-edit-line',
                    class: "group-hover:text-green-500",
                    action: () => { this.showEditor = true }
                }})
            }
        },
        comments() {
            return this.post.comments
        }
    },
    mounted() {
        watch(
            () => this.post.body,
            (newBody) => {
                this.body = newBody
            }
        )
    },
    methods: {
        updatePost(body) {
            this.$store.dispatch('thread/updatePost', { ...this.post, body })
        },
        sendVote(vote) {
            this.$store.dispatch('thread/votePost', {
                postId: this.post.postId,
                value: vote
            })
        },
        addFavorite() {
            this.$store.dispatch('thread/addFavoritePost', this.post.postId)
        },
        deleteFavorite() {
            this.$store.dispatch('thread/deleteFavoritePost', this.post.postId)
        }
    }
}
</script>

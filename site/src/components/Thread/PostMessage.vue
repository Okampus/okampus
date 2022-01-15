<template>
    <div>
        <!-- {{ post }} -->
        <div class="text-1">
            <div class="flex mt-1">
                <div class="flex flex-col flex-shrink-0 w-3/24 items-center text-lg pt-4 gap-4">
                    <div class="flex items-center flex-col">
                        <i
                            class="ri-arrow-up-s-fill ri-2x hover:text-blue-500 cursor-pointer"
                            :class="[post.currentVote === 1 ? 'text-orange-500' : '']"
                            @click="post.currentVote === 1 ? sendVote(0) : sendVote(1)"
                        />
                        <div class="text-center text-xl">
                            {{ post.upvotes - post.downvotes }}
                        </div>
                        <i
                            class="ri-arrow-down-s-fill ri-2x hover:text-blue-500 cursor-pointer"
                            :class="[post.currentVote === -1 ? 'text-orange-500' : '']"
                            @click="post.currentVote === -1 ? sendVote(0) : sendVote(-1)"
                        />
                    </div>
                    <div class="flex flex-col">
                        <div
                            v-for="(action,i) in otherActions"
                            :key="i"
                            class="flex items-center text-5 rounded transition"
                            :class="actionsMap[action].class"
                            @click="actionsMap[action].action"
                        >
                            <i
                                :class="actionsMap[action].icon"
                                class="ri-lg"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-21/24 gap-3 bg-2 p-2 rounded-xl">
                    <div class="p-2 text-lg">
                        <EditableRender
                            v-model:content="body"
                            v-model:show="showEditor"
                            @validate="updatePost($event)"
                        />
                    </div>
                    <!-- <hr class=" border-gray-400 opacity-50"> -->
                    <div class="flex justify-between items-center">
                        <UserPreview
                            :username="post.author.username"
                            :avatar="post.author.avatar"
                            :reputation="post.author.reputation"
                        />

                        <div class="flex items-center ri-lg">
                            <div
                                v-for="(action, i) in actionsBar"
                                :key="i"
                                class="flex gap-1 items-center text-5 transition rounded-lg cursor-pointer p-2"
                                :class="actionsMap[action].class"
                                @click="actionsMap[action].action"
                            >
                                <i
                                    :class="actionsMap[action].icon"
                                    class="ri-md"
                                />
                                <p class="text-sm group-hover:underline">
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
import UserPreview from '@/components/Dashboard/UserPreview.vue'
import PostCommentList from '@/components/Thread/PostCommentList.vue'
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
        actionsBar: {
            type: Array,
            default: function () {
                return [
                    'reply',
                    'addComment',
                    'edit',
                    'flag'
                ]
            }
        },
        otherActions:{
            type: Array,
            default: function () {
                return [
                    'favorite',
                ]
            }
        }
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
        actionsMap () {
            return {
                reply: { name:()=> 'Répondre', icon: 'ri-reply-fill', class:"hover:text-blue-500", action:  () => { this.$emit("reply"); console.log("Reply")} },
                addComment: { name:()=> 'Commenter', icon: 'ri-chat-new-line', class:"hover:text-blue-500", action: () => { this.onComment = true } },
                favorite: { name:()=> 'Répondre', icon: this.post.favorited ? 'ri-star-fill' : 'ri-star-line', class: [this.post.favorited ? 'hover:text-blue-500 text-yellow-500' : 'hover:text-yellow-500', 'cursor-pointer'],
                    action: () => { this.post.favorited ? this.deleteFavorite() : this.addFavorite() } },
                edit: { name:()=> 'Éditer', icon: 'ri-edit-line', class:"hover:text-green-500", action: () => { this.showEditor = true } },
                flag: { name:()=> 'Signaler', icon: 'ri-flag-line', class:"hover:text-red-500", action: () => {  } }
            }
        },
        comments() {
            return this.post.comments
        }
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

<template>
    <div>
        <!-- {{ post }} -->
        <div class="text-1">
            <div class="flex mt-1">
                <div class="flex flex-col shrink-0 gap-2 items-center -ml-4 w-3/24 text-lg">
                    <UserPreview
                        :username="post.author?.username"
                        :avatar="post.author?.avatar"
                        :img-size="14"
                        text-class="text-lg"
                        mode="vertical"
                    />

                    <div class="flex gap-2 items-center mt-1">
                        <font-awesome-icon
                            :icon="['fa', 'thumbs-up']"
                            class="text-lg hover:text-blue-500 cursor-pointer"
                            :class="{ 'text-green-500': post.currentVote === 1 }"
                            @click="post.currentVote === 1 ? sendVote(0) : sendVote(1)"
                        />
                        <div class="text-xl text-center">
                            {{ post.upvotes - post.downvotes }}
                        </div>
                        <font-awesome-icon
                            :icon="['fa', 'thumbs-down']"
                            class="text-lg hover:text-blue-500 cursor-pointer symmetry-x"
                            :class="{ 'text-red-500': post.currentVote === -1 }"
                            @click="post.currentVote === -1 ? sendVote(0) : sendVote(-1)"
                        />
                    </div>

                    <div class="flex flex-col mt-1">
                        <div
                            v-for="(action, i) in otherActions"
                            :key="i"
                            class="flex items-center rounded transition cursor-pointer text-5"
                            @click="actionsMap[action].action"
                        >
                            <font-awesome-icon
                                :icon="actionsMap[action].icon"
                                :class="actionsMap[action].class"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-3 p-2 mt-2 w-21/24 rounded-xl bg-2">
                    <div class="p-2 text-lg">
                        <TipTapEditableRender
                            v-model:content="body"
                            v-model:show="showEditor"
                            @validate="updatePost($event)"
                        />
                    </div>

                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <div
                                v-for="(action, i) in actionsBar"
                                :key="i"
                                class="group flex gap-1 items-center p-2 rounded-lg transition cursor-pointer text-5"
                                @click="actionsMap[action].action"
                            >
                                <font-awesome-icon
                                    :icon="actionsMap[action].icon"
                                    :class="actionsMap[action].class"
                                />
                                <p :class="actionsMap[action].class" class="text-sm">
                                    {{ actionsMap[action].name() }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <ThreadCommentList
                        v-model:on-comment="onComment"
                        :parent-content="{ type: 'post', id: post.postId }"
                        :comments="comments"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import UserPreview from '@/components/User/UserPreview.vue'
import ThreadCommentList from '@/components/Thread/ThreadCommentList.vue'
import { watch } from 'vue'
import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'

export default {
    components: {
        UserPreview,
        ThreadCommentList,
        TipTapEditableRender,
    },
    props: {
        post: {
            type: Object,
            default: () => {},
        },
    },
    emits: ['reply'],
    data() {
        return {
            maxCommentsShown: 2,
            showEditor: false,
            body: this.post.body,
            onComment: false,
        }
    },
    computed: {
        actionsBar() {
            return [
                ...[
                    'reply',
                    'addComment',
                    'report',
                ],
                ...(this.post.author.userId === this.$store.state.auth.user.userId
                    ? ['edit']
                    : []),
            ]
        },
        otherActions() {
            return ['favorite']
        },
        actionsMap () {
            return {
                ...( {
                    reply: {
                        name: () => 'Répondre',
                        icon: ['far', 'comment-alt'],
                        class: 'group-hover:text-blue-500',
                        action: () => { this.$emit('reply') },
                    },
                    addComment: {
                        name: () => 'Commenter',
                        icon: ['far', 'comment'],
                        class: 'group-hover:text-blue-500',
                        action: () => { this.onComment = true },
                    },
                    report: {
                        name: () => 'Signaler',
                        icon: ['far', 'flag'],
                        class: 'group-hover:text-red-500',
                        action: () => {  },
                    },
                    favorite: {
                        name: () => 'Favori',
                        icon: this.post?.favorited ? 'star' : ['far', 'star'],
                        class: this.post?.favorited ? 'hover:text-yellow-500 text-yellow-400' : 'hover:text-yellow-400',
                        action: () => { this.post?.favorited ? this.deleteFavorite() : this.addFavorite() },
                    },
                }),
                ...(this.post.author.userId === this.$store.state.auth.user?.userId && {
                    edit: {
                        name: () => 'Éditer',
                        condition: () => this.isUser(),
                        icon: 'edit',
                        class: 'group-hover:text-green-500',
                        action: () => { this.showEditor = true },
                    },
                }),
            }
        },
        comments() {
            return this.post.comments
        },
    },
    mounted() {
        watch(
            () => this.post.body,
            (newBody) => {
                this.body = newBody
            },
        )
    },
    methods: {
        updatePost(body) {
            this.$store.dispatch('thread/updatePost', {
                ...this.post,
                body,
            })
        },
        sendVote(vote) {
            this.$store.dispatch('thread/votePost', {
                postId: this.post.postId,
                value: vote,
            })
        },
        addFavorite() {
            this.$store.dispatch('thread/addFavoritePost', this.post.postId)
        },
        deleteFavorite() {
            this.$store.dispatch('thread/deleteFavoritePost', this.post.postId)
        },
    },
}
</script>

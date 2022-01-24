<template>
    <div class="text-1">
        <div class="flex">
            <div class="flex flex-col shrink-0 gap-2 items-center -ml-4 w-3/24 text-lg">
                <UserPreview
                    :username="reply.author?.username"
                    :avatar="reply.author?.avatar"
                    mode="vertical"
                />

                <div class="flex gap-5 items-center">
                    <div class="flex flex-col gap-1 items-center">
                        <font-awesome-icon
                            :icon="['fa', 'check']"
                            class="text-lg hover:text-blue-500 cursor-pointer"
                            :class="{ 'text-green-500': reply.currentVote === 1 }"
                            @click="reply.currentVote === 1 ? sendVote(0) : sendVote(1)"
                        />
                        <p>{{ reply.upvotes }}</p>
                    </div>
                    <div class="flex flex-col gap-1 items-center">
                        <font-awesome-icon
                            :icon="['fa', 'times']"
                            class="text-xl hover:text-blue-500 cursor-pointer"
                            :class="{ 'text-red-500': reply.currentVote === -1 }"
                            @click="reply.currentVote === -1 ? sendVote(0) : sendVote(-1)"
                        />
                        <p>{{ reply.downvotes }}</p>
                    </div>
                </div>
            </div>

            <div class="p-2 w-11/12 rounded-xl left-1/12 bg-2">
                <div class="p-1 text-base text-2">
                    <TipTapEditableRender
                        v-model:show="showEditor"
                        v-model:content="body"
                        @validate="updateReply($event)"
                    />
                </div>
                <div class="flex items-center mt-2">
                    <div
                        v-for="(action, actionName) in actionsMap"
                        :key="actionName"
                        class="group flex gap-1 items-center p-2 rounded-lg transition cursor-pointer text-5"
                        @click="action.action"
                    >
                        <font-awesome-icon :icon="action.icon" :class="action.class" />

                        <p class="text-sm" :class="action.class">
                            {{ action.name() }}
                        </p>
                    </div>
                </div>
                <ThreadCommentList
                    v-model:on-comment="onComment"
                    class="mt-4"
                    :parent-content="{ type: 'reply', id: reply.replyId }"
                    :comments="reply.comments"
                />
            </div>
        </div>
    </div>
</template>

<script lang="js">
import default_avatar from '@/assets/img/default_avatars/user.png'
import ThreadCommentList from '@/components/Thread/ThreadCommentList.vue'
import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'
import UserPreview from '@/components/User/UserPreview.vue'
import { defaultTipTapText } from '@/utils/tiptap'
import { watch } from 'vue'

export default {
    components: {
        ThreadCommentList,
        TipTapEditableRender,
        UserPreview,
    },
    props: {
        reply: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            default_avatar,
            onComment: false,
            showEditor: false,
            body: this.reply.body ?? defaultTipTapText,
        }
    },
    computed: {
        actionsMap () {
            return {
                ...( {
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
                        icon: this.reply?.favorited ? 'star' : ['far', 'star'],
                        class: this.reply?.favorited ? 'group-hover:text-yellow-500 text-yellow-400' : 'group-hover:text-yellow-400',
                        action: () => { this.reply.favorited ? this.deleteFavorite() : this.addFavorite() },
                    },
                }),
                ...(this.reply.author.userId === this.$store.state.auth.user?.userId && {
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
            return this.reply.comments
        },
    },
    mounted() {
        watch(
            () => this.reply.body,
            (newBody) => {
                this.body = newBody
            },
        )

        this.emitter.on('thread-action', () => this.showEditor = false)
    },
    methods: {
        updateReply(body) {
            this.$store.dispatch('thread/updateReply', {
                ...this.reply,
                body,
            })
        },
        sendVote(vote) {
            this.$store.dispatch('thread/voteReply', {
                replyId: this.reply.replyId,
                value: vote,
            })
        },
        addFavorite() {
            this.$store.dispatch('thread/addFavoriteReply', this.reply.replyId)
        },
        deleteFavorite() {
            this.$store.dispatch('thread/deleteFavoriteReply', this.reply.replyId)
        },
    },
}
</script>

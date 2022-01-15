<template>
    <div class="text-1">
        <div class="flex">
            <div class="flex flex-col flex-shrink-0 w-3/24 items-center text-lg gap-2 mr-3">
                <img
                    :src="reply.author.avatar || default_avatar"
                    alt="Profile Picture"
                    class="w-10 h-10 rounded-full mt-2 "
                >
                <div class="font-medium text-center text-sm">
                    {{ reply.author.username }}
                </div>

                <div class="flex gap-2">
                    <div class="flex gap-1">
                        <i
                            class="cursor-pointer"
                            :class="[reply.currentVote === 1 ? 'ri-thumb-up-fill text-green-600' : 'ri-thumb-up-line hover:text-green-600']"
                            @click="reply.currentVote === 1 ? sendVote(0) : sendVote(1)"
                        />
                        <p>{{ reply.upvotes }}</p>
                    </div>
                    <div class="flex gap-1">
                        <i
                            class="cursor-pointer"
                            :class="[reply.currentVote === -1 ? 'ri-thumb-down-fill text-red-500' : 'ri-thumb-down-line hover:text-red-500']"
                            @click="reply.currentVote === -1 ? sendVote(0) : sendVote(-1)"
                        />
                        <p>{{ reply.downvotes }}</p>
                    </div>
                </div>
            </div>

            <div class="left-1/12 w-11/12 bg-2 p-2 rounded-xl">
                <div class="p-1 text-2 text-base">
                    <EditableRender
                        v-model:show="showEditor"
                        v-model:content="body"
                        @validate="updateReply($event)"
                    />
                </div>
                <div class="mt-2 flex items-center ri-lg">
                    <div
                        v-for="(action, actionName) in actionsMap"
                        :key="actionName"
                        class="flex gap-1 items-center text-5 transition rounded-lg cursor-pointer p-2"
                        :class="action.class"
                        @click="action.action"
                    >
                        <i
                            :class="action.icon"
                            class="ri-md"
                        />
                        <p class="text-sm">
                            {{ action.name() }}
                        </p>
                    </div>
                </div>
                <PostCommentList
                    v-model:on-comment="showComments"
                    class="mt-4"
                    :parent-content="{type: 'reply', id: reply.replyId}"
                    :comments="reply.comments"
                />
                <!-- <div class="flex space-x-2 my-1">
                        <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
                            <p>0</p> <i class="ri-thumb-up-line text-yellow-400 ri-md" />
                        </div>
                        <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
                            <p>0</p> <i class="ri-check-line text-green-500 ri-lg" />
                        </div>
                        <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
                            <p>0</p> <i class="ri-close-line text-red-500 ri-lg" />
                        </div>
                        <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
                            <p>0</p> <i class="ri-heart-line text-pink-500 ri-md" />
                        </div>
                        <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
                            <p>0</p> <i class="ri-question-mark text-blue-500 ri-md" />
                        </div>
                        <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm w-10">
                            <p>0</p> <p>🤔</p>
                        </div>
                        <div class="px-1 border rounded flex items-center justify-center space-x-1 ri-sm">
                            <p>0</p> <p>😂</p>
                        </div>
                    </div> -->
            </div>
        </div>
    </div>
</template>

<script lang="js">
import PostCommentList from '@/components/Thread/PostCommentList.vue'
import default_avatar from '@/assets/img/default_avatars/user.png'
import EditableRender from '../TipTap/EditableRender.vue'
import { watch } from 'vue'


export default {
    components: {
        PostCommentList,
        EditableRender
    },
    props: {
        reply: {
            type: Object,
            default: () => {}
        },
        actions: {
            type: Array,
            default: function () {
                return [
                    'viewComments',
                    'favorite',
                    'edit',
                    'flag'
                ]
            }
        }
    },
    data() {
        return {
            default_avatar,
            showComments: false,
            showEditor: false,
            body: this.reply.body ?? '{"type":"doc","content":[{"type":"paragraph"}]}'
        }
    },
    computed: {
        actionsMap () {
            return {
                addComment: {
                    name:()=> 'Commenter',
                    icon: 'ri-chat-new-line',
                    class: 'hover:text-blue-500',
                    action: () => { this.showComments = true }
                },
                favorite: {
                    name: () => { return 'Favori' },
                    icon: this.reply.favorited ? 'ri-star-fill' : 'ri-star-line',
                    class: this.reply.favorited ? 'text-yellow-500' : 'hover:text-yellow-500',
                    action: () => { this.reply.favorited ? this.deleteFavorite() : this.addFavorite() }
                },
                edit: {
                    name: () => { return 'Éditer' },
                    icon: 'ri-edit-line',
                    class: 'hover:text-green-500',
                    action: () => { console.log('Éditer') ; this.showEditor = !this.showEditor }
                },
                flag: {
                    name: () => { return 'Signaler' },
                    icon: 'ri-flag-line',
                    class: 'hover:text-red-500',
                    action: () => { console.log('Signaler') }
                }
            }
        },
        comments() {
            return this.reply.comments
        }
    },
    mounted() {
        watch(
            () => this.reply.body,
            (newBody) => {
                this.body = newBody
            }
        )
    },
    methods: {
        updateReply(body) {
            this.$store.dispatch('thread/updateReply', { ...this.reply, body })
        },
        sendVote(vote) {
            this.$store.dispatch('thread/voteReply', {
                replyId: this.reply.replyId,
                value: vote
            })
        },
        addFavorite() {
            this.$store.dispatch('thread/addFavoriteReply', this.reply.replyId)
        },
        deleteFavorite() {
            this.$store.dispatch('thread/deleteFavoriteReply', this.reply.replyId)
        }
    }
}
</script>

<style scoped></style>

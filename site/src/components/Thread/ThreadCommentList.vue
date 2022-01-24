<template>
    <div>
        <div v-if="onComment" class="flex mb-3">
            <div class="flex flex-col gap-4 w-full">
                <TipTapEditor
                    v-model="newComment"
                    class="w-full"
                    :="editorConfig"
                    :sendable="true"
                    :cancellable="true"
                    @send="sendComment()"
                    @cancel="closeComment()"
                />
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <div
                v-for="(comment, i) in shownComments"
                :key="i"
                class="flex gap-1 justify-between py-1 px-2 text-sm rounded-md text-1 bg-1"
            >
                <div class="flex items-center" :class="{ 'w-full': comment.edit }">
                    <TipTapEditableRender
                        v-model:content="comment.body"
                        v-model:show="comment.edit"
                        class="w-full"
                        :="editorConfig"
                        @validate="updateComment($event, i)"
                    />
                    <p v-if="!comment.edit" class="font-bold whitespace-nowrap">
                        &nbsp;- {{ comment.author.username }}
                    </p>
                </div>
                <div v-if="!comment.edit" class="flex items-center">
                    <div
                        v-for="(action, actionName) in actionsMap(i)"
                        :key="actionName"
                        class="group flex gap-1 items-center py-1 px-2 text-sm rounded-lg transition cursor-pointer text-5"
                        @click="action.action()"
                    >
                        <font-awesome-icon :icon="action.icon()" :class="action.class()" />
                        <p :class="action.class()" class="text-xs">
                            {{ action.name() }}
                        </p>
                    </div>
                </div>
            </div>
            <div
                v-if="comments.length > maxCommentsShow"
                class="mt-2 ml-1 text-sm text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                @click="commentsShow = !commentsShow"
            >
                <div class="flex gap-1 -ml-1">
                    <div>
                        {{ commentsShow ? 'Cacher' : 'Voir' }}
                    </div>
                    <div class="font-bold">
                        {{ comments.length - maxCommentsShow }}
                    </div>
                    <div>{{ comments.length - maxCommentsShow > 1 ? 'commentaires' : 'commentaire' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">

import default_avatar from '@/assets/img/default_avatars/user.png'
import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'
import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'
import { watch } from 'vue'
import { defaultTipTapText } from '@/utils/tiptap'

export default {
    components: {
        TipTapEditor,
        TipTapEditableRender,
    },
    props: {
        onComment: {
            type: Boolean,
            default: false,
        },
        parentContent: {
            type: Object,
            default: () => {},
        },
        comments: {
            type: Array,
            default: () => [],
        },
        maxCommentsShow: {
            type: Number,
            default: 2,
        },
        tiptapError: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:onComment'],
    data() {
        return {
            default_avatar,
            editorConfig: {
                charCount: 240,
                textClass: 'text-sm',
                editorClasses: ['text-sm'],
                editorButtons: [],
                placeholder: `${this.$store.state.auth.user.username} va commenter...`,
            },
            commentLimit: 240,
            newComment: defaultTipTapText,
            commentsShow: false,
            commentItems: this.comments.map(
                comment => ({
                    ...comment,
                    edit: false,
                }),
            ),
        }
    },
    computed: {
        shownComments() {
            return this.commentItems.slice(0, this.commentsShow ? this.commentItems.length : this.maxCommentsShow)
        },
    },
    mounted() {
        watch(
            () => this.comments,
            () => {
                this.commentItems = this.comments.map(
                    comment => ({
                        ...comment,
                        edit: false,
                    }),
                )
            }, { deep: true },
        )
    },
    methods: {
        actionsMap (i) {
            return {
                ...({
                    favorite: {
                        name: () => 'Favori',
                        icon: () => this.commentItems[i].favorited ? 'star' : ['far', 'star'],
                        class: () => this.commentItems[i].favorited ? 'hover:text-yellow-500 text-yellow-400' : 'hover:text-yellow-400',
                        action: () => { this.commentItems[i].favorited ? this.deleteFavorite(i) : this.addFavorite(i) },
                    },

                    flag: {
                        name: () => 'Signaler',
                        icon: () => ['far', 'flag'],
                        class: () => 'group-hover:text-red-500',
                        action: () => { console.log('Signaler') },
                    },
                }),
                ...(this.commentItems[i].author.userId === this.$store.state.auth.user?.userId && {
                    edit: {
                        name: () => 'Éditer',
                        icon: () => 'edit',
                        class: () => 'group-hover:text-green-500',
                        action: () => { this.commentItems[i].edit = !this.commentItems[i].edit },
                    },
                }),
            }
        },
        closeComment() {
            this.$emit('update:onComment', false)
            this.newComment = defaultTipTapText
        },
        sendComment() {
            if (this.parentContent.type === 'post') {
                this.$store.dispatch('thread/addPostComment', {
                    postId: this.parentContent.id,
                    body: this.newComment,
                })
                this.closeComment()
            } else if (this.parentContent.type === 'reply') {
                this.$store.dispatch('thread/addReplyComment', {
                    replyId: this.parentContent.id,
                    body: this.newComment,
                })
                this.closeComment()
            } else {
                console.error('Unknown parent type')
            }
        },
        updateComment(body, i) {
            this.$store.dispatch('thread/updateComment', {
                commentId: this.commentItems[i].commentId,
                body: body,
            }).then(() => {
                this.commentItems[i].edit = false
            })
        },
        addFavorite(i) {
            this.$store.dispatch('thread/addFavoriteComment', this.commentItems[i].commentId)
        },
        deleteFavorite(i) {
            this.$store.dispatch('thread/deleteFavoriteComment', this.commentItems[i].commentId)
        },
    },
}
</script>

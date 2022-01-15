<template>
    <div>
        <div
            v-if="onComment"
            class="flex mb-3"
        >
            <div class="flex flex-col w-full gap-4">
                <tip-tap-editor
                    v-model="newComment"
                    :char-count-limit="240"
                    :editor-classes="[]"
                    class="w-full"
                    :sendable="true"
                    :cancellable="true"
                    :small="true"
                    :placeholder="`${user.username} va commenter...`"
                    @send="sendComment()"
                    @cancel="closeComment()"
                />
            </div>
        </div>
        <div class="flex flex-col gap-1">
            <div
                v-for="(comment, i) in shownComments"
                :key="i"
                class="flex text-1 text-sm py-1 px-2 bg-1 rounded-md gap-1 justify-between"
            >
                <div
                    class="flex items-center"
                    :class="{'w-full': comment.edit}"
                >
                    <EditableRender
                        v-model:content="comment.body"
                        v-model:show="comment.edit"
                        class="w-full"
                        :editor-classes="['text-sm']"
                        @validate="updateComment($event, i)"
                    />
                    <p
                        v-if="!comment.edit"
                        class="font-bold whitespace-nowrap"
                    >
                        &nbsp;- {{ comment.author.username }}
                    </p>
                </div>
                <div
                    v-if="!comment.edit"
                    class="flex items-center"
                >
                    <div
                        v-for="(action, actionName) in actionsMap"
                        :key="actionName"
                        class="text-sm flex gap-1 items-center text-5 transition rounded-lg cursor-pointer py-1 px-2"
                        :class="action.class(i)"
                        @click="action.action(i)"
                    >
                        <i
                            :class="action.icon(i)"
                            class="ri-md"
                        />
                        <p class="text-xs">
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
// TODO: Expect errors
import default_avatar from '@/assets/img/default_avatars/user.png'
import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'
import EditableRender from '../TipTap/EditableRender.vue'
import { watch } from 'vue'

export default {
    components: {
        TipTapEditor,
        EditableRender
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
            default: () => []
        },
        maxCommentsShow: {
            type: Number,
            default: 2
        },
        tiptapError: {
            type: Boolean,
            default: false
        },
    },
    emits: ['update:onComment'],
    data() {
        return {
            default_avatar,
            newComment: '{"type":"doc","content":[{"type":"paragraph"}]}',
            commentsShow: false,
            commentItems: this.comments.map(
                comment => { return { ...comment, edit: false } }
            )
        }
    },
    computed: {
        actionsMap () {
            // TODO: Actions
            return {
                favorite: {
                    name: () => { return 'Favori' },
                    icon: (i) => this.commentItems[i].favorited ? 'ri-star-fill' : 'ri-star-line',
                    class: (i) => this.commentItems[i].favorited ? 'text-yellow-500' : 'hover:text-yellow-500',
                    action: (i) => { this.commentItems[i].favorited ? this.deleteFavorite(i) : this.addFavorite(i) }
                },
                edit: {
                    name: () => { return 'Éditer' },
                    icon: () => 'ri-edit-line',
                    class: () => 'hover:text-green-500',
                    action: (i) => { this.commentItems[i].edit = !this.commentItems[i].edit; console.log('d', i, this.commentItems) }
                },
                flag: {
                    name: () => { return 'Signaler' },
                    icon: () => 'ri-flag-line',
                    class: () => 'hover:text-red-500',
                    action: () => { console.log('Signaler') }
                }
            }
        },
        user () {
            return this.$store.state.auth.user
        },
        shownComments() {
            return this.commentItems.slice(0, this.commentsShow ? this.commentItems.length : this.maxCommentsShow)
        }
    },
    mounted() {
        watch(
            () => this.comments,
            () => {
                this.commentItems = this.comments.map(
                    comment => { return { ...comment, edit: false } }
                )
            }, { deep: true }
        )
    },
    methods: {
        closeComment() {
            this.$emit('update:onComment', false)
            this.newComment = '{"type":"doc","content":[{"type":"paragraph"}]}'
        },
        sendComment() {
            if (this.parentContent.type === 'post') {
                this.$store.dispatch('thread/addPostComment', {
                    postId: this.parentContent.id,
                    body: this.newComment
                })
                this.closeComment()
            } else if (this.parentContent.type === 'reply') {
                this.$store.dispatch('thread/addReplyComment', {
                    replyId: this.parentContent.id,
                    body: this.newComment
                })
                this.closeComment()
            } else {
                console.error('Unknown parent type')
            }
        },
        updateComment(body, i) {
            this.$store.dispatch('thread/updateComment', {
                commentId: this.commentItems[i].commentId,
                body: body
            }).then(() => {
                this.commentItems[i].edit = false
            })
        },
        addFavorite(i) {
            this.$store.dispatch('thread/addFavoriteComment', this.commentItems[i].commentId)
        },
        deleteFavorite(i) {
            this.$store.dispatch('thread/deleteFavoriteComment', this.commentItems[i].commentId)
        }
    }
}
</script>

<template>
    <div>
        <div class="flex flex-col gap-1">
            <div
                v-for="(comment, i) in shownComments"
                :id="`content-${comment.contentId}`"
                :key="i"
                :class="{ 'highlight-active': comment.active }"
                class="flex gap-1 justify-between py-1 px-2 text-sm rounded-md text-1 bg-1"
            >
                <div class="flex items-center" :class="{ 'w-full': comment.edit }">
                    <TipTapEditableRender
                        v-model:content="comment.body"
                        v-model:edit="comment.edit"
                        class="p-0 w-full"
                        :="editorConfig"
                        @send="updateComment($event, i)"
                    />
                    <p v-if="!comment.edit" class="font-bold whitespace-nowrap">
                        &nbsp;- {{ comment.author.fullname }}
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
                @click="toggleComments"
            >
                <div class="flex gap-1 mb-1">
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
        <div v-else @click="showEditor">
            <p class="text-sm font-bold text-gray-500 uppercase cursor-pointer">Commenter</p>
        </div>
    </div>
</template>

<script>
    import defaultAvatar from '@/assets/img/default_avatars/user.png'
    import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'
    import TipTapEditor from '@/components/TipTap/TipTapEditor.vue'
    import { getURL } from '@/utils/routeUtils'
    import { defaultTipTapText } from '@/utils/tiptap'
    import { watch } from 'vue'
    import urljoin from 'url-join'

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
            parentId: {
                type: Number,
                required: true,
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
        emits: ['update:onComment', 'report'],
        data() {
            return {
                defaultAvatar,
                editorConfig: {
                    charCount: 240,
                    textClass: 'text-sm',
                    editorClasses: ['text-sm'],
                    editorButtons: [],
                    placeholder: `${this.$store.state.auth.user.fullname} va commenter...`,
                },
                commentLimit: 240,
                newComment: defaultTipTapText,
                commentsShow: false,
                commentItems: this.comments.map((comment) => ({
                    ...comment,
                    edit: false,
                })),
            }
        },
        computed: {
            shownComments() {
                return this.commentItems.slice(
                    0,
                    this.commentsShow ? this.commentItems.length : this.maxCommentsShow,
                )
            },
        },
        mounted() {
            watch(
                () => this.comments,
                () => {
                    this.commentItems = this.comments.map((comment) => ({
                        ...comment,
                        edit: false,
                    }))
                },
                { deep: true },
            )
        },
        methods: {
            toggleComments() {
                if (this.commentsShow) {
                    this.commentItems.slice(this.maxCommentsShow, this.commentItems.length).map((comment) => {
                        comment.active = false
                    })

                    this.commentsShow = false
                } else {
                    this.commentItems.slice(this.maxCommentsShow, this.commentItems.length).map((comment) => {
                        comment.active = true
                    })
                    this.commentsShow = true
                }
            },
            showEditor() {
                this.$emit('update:onComment', true)
            },
            actionsMap(i) {
                return {
                    favorite: {
                        name: () => 'Favori',
                        icon: () => (this.commentItems[i].userFavorited ? 'star' : ['far', 'star']),
                        class: () =>
                            this.commentItems[i].userFavorited
                                ? 'group-hover:text-yellow-600 text-yellow-500'
                                : 'group-hover:text-yellow-500',
                        action: () => {
                            this.commentItems[i].userFavorited
                                ? this.deleteFavorite(i)
                                : this.addFavorite(i)
                        },
                    },
                    ...(this.commentItems[i].author.userId === this.$store.state.auth.user?.userId && {
                        edit: {
                            name: () => 'Éditer',
                            icon: () => 'pen',
                            class: () => 'group-hover:text-green-600',
                            action: () => {
                                this.commentItems[i].edit = !this.commentItems[i].edit
                            },
                        },
                    }),
                    report: {
                        name: () => (this.commentItems[i]?.userReported ? 'Signalé' : ''),
                        icon: () => (this.commentItems[i]?.userReported ? 'flag' : ['far', 'flag']),
                        class: () =>
                            this.commentItems[i]?.userReported
                                ? 'group-hover:text-red-600 text-red-500'
                                : 'group-hover:text-red-500',
                        action: () => {
                            this.commentItems[i]?.userReported
                                ? alert('Vous avez déjà signalé ce commentaire.')
                                : this.$emit('report', this.commentItems[i])
                        },
                    },

                    getLink: {
                        name: () => '',
                        icon: () => 'link',
                        class: () => 'group-hover:text-blue-600',
                        action: () => {
                            navigator.clipboard.writeText(
                                getURL(
                                    urljoin(
                                        this.$route.path,
                                        '#content-' + this.commentItems[i].contentId,
                                    ),
                                ),
                            )
                            this.$emitter.emit('show-toast', {
                                text: 'Le lien du commentaire a bien été copié !',
                                type: 'info',
                            })
                        },
                    },
                }
            },
            closeComment() {
                this.$emit('update:onComment', false)
                this.newComment = defaultTipTapText
            },
            sendComment() {
                this.$store
                    .dispatch('threads/addComment', {
                        parentId: this.parentId,
                        body: this.newComment,
                    })
                    .then(this.closeComment)
            },
            updateComment(body, i) {
                this.$store
                    .dispatch('threads/updateContent', {
                        contentId: this.commentItems[i].contentId,
                        body: body,
                    })
                    .then(() => {
                        this.commentItems[i].edit = false
                    })
            },
            addFavorite(i) {
                this.$store.dispatch('threads/addFavorite', this.commentItems[i].contentId)
            },
            deleteFavorite(i) {
                this.$store.dispatch('threads/deleteFavorite', this.commentItems[i])
            },
        },
    }
</script>

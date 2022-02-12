<template>
    <div class="flex items-start">
        <div class="flex flex-col shrink-0 gap-2 items-center px-3 w-[8.5rem] text-lg">
            <UserPreview
                :username="post.author?.fullname"
                :avatar="post.author?.avatar"
                :reputation="post.author?.points"
                :school-role="post.author?.schoolRole"
                :img-size="14"
                mode="vertical"
            />
        </div>
        <div
            :id="`content-${post.contentId}`"
            class="flex flex-col gap-3 p-2 mt-2 w-[calc(100%-8.5rem)] rounded-xl bg-2"
        >
            <TipTapEditableRender
                v-model:content="currentBody"
                v-model:edit="showEditor"
                @send="updatePost($event)"
            />

            <div class="flex justify-between items-center">
                <div class="flex gap-2 items-center">
                    <div class="flex gap-2.5 items-center py-2 px-3 mt-1 rounded-lg bg-3 text-2">
                        <!-- TODO: mobile-friendly: tap & hold to react -->
                        <font-awesome-icon
                            :icon="['fa', 'heart']"
                            class="text-xl hover:text-blue-500 cursor-pointer"
                            :class="{ 'text-green-600': post.userVote === 1 }"
                            @click="post.userVote === 1 ? sendVote(0) : sendVote(1)"
                        />
                        <!-- <div class="text-center">
                                    {{ post.upvotes - post.downvotes }}
                                </div> -->
                        <font-awesome-icon
                            :icon="['fa', 'heart-broken']"
                            class="text-xl hover:text-blue-500 cursor-pointer"
                            :class="{ 'text-red-500': post.userVote === -1 }"
                            @click="post.userVote === -1 ? sendVote(0) : sendVote(-1)"
                        />
                    </div>
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
                :parent-id="post.contentId"
                :comments="comments"
                @report="
                    (content) => {
                        $emit('report', content)
                    }
                "
            />
        </div>
    </div>
</template>

<script>
    import ThreadCommentList from '@/components/Thread/ThreadCommentList.vue'
    import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'
    import UserPreview from '@/components/User/UserPreview.vue'
    import { getURL } from '@/utils/routeUtils'
    import { watch } from 'vue'
    import urljoin from 'url-join'

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
        emits: ['reply', 'report'],
        data() {
            return {
                maxCommentsShown: 2,
                showEditor: false,
                currentBody: this.post.body,
                onComment: false,
            }
        },
        computed: {
            actionsBar() {
                return [
                    ...['reply', 'addComment', 'report', 'getLink', 'delete'],
                    ...(this.post.author.userId === this.$store.state.auth.user.userId ? ['edit'] : []),
                ]
            },
            actionsMap() {
                return {
                    ...{
                        reply: {
                            name: () => 'Répondre',
                            icon: ['far', 'comment-alt'],
                            class: 'group-hover:text-blue-500',
                            action: () => {
                                this.$emit('reply')
                            },
                        },
                        addComment: {
                            name: () => 'Commenter',
                            icon: ['far', 'comment'],
                            class: 'group-hover:text-blue-500',
                            action: () => {
                                this.onComment = true
                            },
                        },
                        report: {
                            name: () => (this.post?.userReported ? 'Signalé' : 'Signaler'),
                            icon: this.post?.userReported ? 'flag' : ['far', 'flag'],
                            class: this.post?.userReported
                                ? 'group-hover:text-red-600 text-red-500'
                                : 'group-hover:text-red-500',
                            action: () => {
                                this.post?.userReported
                                    ? alert('Vous avez déjà signalé ce post.')
                                    : this.$emit('report', this.post)
                            },
                        },
                        favorite: {
                            name: () => 'Favori',
                            icon: this.post?.userFavorited ? 'star' : ['far', 'star'],
                            class: this.post?.userFavorited
                                ? 'group-hover:text-yellow-600 text-yellow-500'
                                : 'group-hover:text-yellow-500',
                            action: () => {
                                this.post?.userFavorited
                                    ? this.$store.dispatch('threads/deleteFavorite', this.post)
                                    : this.$store.dispatch('threads/addFavorite', this.post.contentId)
                            },
                        },
                        getLink: {
                            name: () => 'Lien',
                            icon: 'link',
                            class: 'group-hover:text-blue-600',
                            action: () => {
                                navigator.clipboard.writeText(
                                    getURL(urljoin(this.$route.path, '#content-' + this.post?.contentId)),
                                )
                                this.$emitter.emit('show-toast', {
                                    text: 'Le lien du post a bien été copié !',
                                    type: 'info',
                                })
                            },
                        },
                        delete: {
                            name: () => 'Supprimer',
                            icon: 'trash-alt',
                            class: 'group-hover:text-red-500',
                            action: () => {
                                this.$store
                                    .dispatch('threads/deleteThread', this.post.contentMasterId)
                                    .then(() => {
                                        this.$router.push('/')
                                    })
                                    .catch(() => {
                                        console.log("Couldn't delete thread")
                                    })
                            },
                        },
                    },
                    ...(this.post.author.userId === this.$store.state.auth.user?.userId && {
                        edit: {
                            name: () => 'Éditer',
                            condition: () => this.isUser(),
                            icon: 'pen',
                            class: 'group-hover:text-green-600',
                            action: () => {
                                this.showEditor = true
                            },
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
                this.$store.dispatch('threads/updateContent', {
                    contentId: this.post.contentId,
                    body,
                })
            },
            sendVote(vote) {
                this.$store.dispatch('threads/voteContent', {
                    contentId: this.post.contentId,
                    value: vote,
                })
            },
        },
    }
</script>

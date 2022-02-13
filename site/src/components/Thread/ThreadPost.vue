<template>
    <ThreadCommentable :content="post">
        <template #content>
            <TipTapEditableRender
                v-model:content="currentBody"
                v-model:edit="showEditor"
                @send="updatePost($event)"
            />

            <div class="flex items-center mt-2">
                <!-- TODO: mobile-friendly: tap & hold to react -->
                <font-awesome-icon
                    :icon="['fa', 'heart']"
                    class="p-2 text-xl hover:text-blue-500 cursor-pointer"
                    :class="[post.userVote === 1 ? 'text-green-600' : 'text-5']"
                    @click="post.userVote === 1 ? sendVote(0) : sendVote(1)"
                />
                <!-- <div class="text-center">
                                        {{ post.upvotes - post.downvotes }}
                                    </div> -->
                <font-awesome-icon
                    :icon="['fa', 'heart-broken']"
                    class="p-2 text-xl hover:text-blue-500 cursor-pointer"
                    :class="[post.userVote === -1 ? 'text-red-500' : 'text-5']"
                    @click="post.userVote === -1 ? sendVote(0) : sendVote(-1)"
                />
                <div
                    v-for="(action, _, i) in actionsMap"
                    :key="i"
                    class="group flex gap-1 items-center p-2 rounded-lg transition cursor-pointer text-5"
                    @click="action.action()"
                >
                    <font-awesome-icon :icon="action.icon" :class="action.class" />
                    <p :class="action.class" class="text-sm">
                        {{ action.name() }}
                    </p>
                </div>
            </div>
        </template>
    </ThreadCommentable>
</template>

<script>
    import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'
    import { watch } from 'vue'
    import ThreadCommentable from './ThreadCommentable.vue'

    export default {
        components: {
            TipTapEditableRender,
            ThreadCommentable,
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
            actionsMap() {
                return {
                    ...{
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
                                        this.$emitter.emit('show-toast', {
                                            message: 'La suppression du thread a échoué',
                                            type: 'error',
                                        })
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

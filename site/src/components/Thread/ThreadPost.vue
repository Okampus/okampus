<template>
    <div>
        <div class="flex items-start">
            <div class="flex flex-col shrink-0 gap-2 items-center px-3 -ml-5 w-32 text-lg">
                <UserPreview
                    :username="post.author?.fullname"
                    :avatar="post.author?.avatar"
                    :img-size="14"
                    mode="vertical"
                />

                <div class="flex flex-col mt-1">
                    <div
                        v-for="(action, i) in otherActions"
                        :key="i"
                        class="flex items-center rounded transition cursor-pointer text-5"
                        @click="actionsMap[action].action"
                    >
                        <div class="group flex gap-2 items-center">
                            <font-awesome-icon
                                :icon="actionsMap[action].icon"
                                :class="actionsMap[action].class"
                            />
                            <p :class="actionsMap[action].class" class="pt-1 text-sm">
                                {{ actionsMap[action].name() }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-3 p-2 mt-2 w-full rounded-xl bg-2">
                <div class="p-2 text-lg">
                    <TipTapEditableRender
                        v-model:content="currentBody"
                        v-model:edit="showEditor"
                        @send="updatePost($event)"
                    />
                </div>

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
    </div>
</template>

<script>
    import ThreadCommentList from '@/components/Thread/ThreadCommentList.vue'
    import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'
    import UserPreview from '@/components/User/UserPreview.vue'
    import { watch } from 'vue'

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
                    ...['reply', 'addComment', 'report'],
                    ...(this.post.author.userId === this.$store.state.auth.user.userId ? ['edit'] : []),
                ]
            },
            otherActions() {
                return ['favorite']
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
                            name: () => 'Signaler',
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
                                this.post?.userFavorited ? this.deleteFavorite() : this.addFavorite()
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
            addFavorite() {
                this.$store.dispatch('threads/addFavorite', this.post.contentId)
            },
            deleteFavorite() {
                this.$store.dispatch('threads/deleteFavorite', this.post)
            },
        },
    }
</script>

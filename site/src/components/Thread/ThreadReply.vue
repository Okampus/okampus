<template>
    <div class="flex items-start">
        <div class="flex flex-col shrink-0 gap-2 items-center p-3 -ml-5 w-4/24 text-lg">
            <UserPreview
                :username="reply.author?.fullname ?? 'Anonyme'"
                :avatar="reply.author?.avatar"
                mode="vertical"
                :img-size="14"
            />

            <div class="flex gap-5 items-center">
                <div class="flex flex-col gap-1 items-center">
                    <font-awesome-icon
                        :icon="['fa', 'check']"
                        class="text-lg hover:text-blue-500 cursor-pointer"
                        :class="{ 'text-green-600': reply.userVote === 1 }"
                        @click="reply.userVote === 1 ? sendVote(0) : sendVote(1)"
                    />
                    <p>{{ reply.upvotes }}</p>
                </div>
                <div class="flex flex-col gap-1 items-center">
                    <font-awesome-icon
                        :icon="['fa', 'times']"
                        class="text-xl hover:text-blue-500 cursor-pointer"
                        :class="{ 'text-red-500': reply.userVote === -1 }"
                        @click="reply.userVote === -1 ? sendVote(0) : sendVote(-1)"
                    />
                    <p>{{ reply.downvotes }}</p>
                </div>
            </div>
        </div>

        <div class="p-2 w-full rounded-xl bg-2">
            <div class="p-1 text-base">
                <TipTapEditableRender
                    v-model:show="showEditor"
                    v-model:content="currentBody"
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
                :parent-id="reply.contentId"
                :comments="reply.comments"
                @report="
                    (content) => {
                        $emit('report', content)
                    }
                "
            />
        </div>
    </div>
</template>

<script lang="js">
    import defaultAvatar from '@/assets/img/default_avatars/user.png'
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
        emits: ['report'],
        data() {
            return {
                defaultAvatar,
                currentBody: this.reply.body ?? defaultTipTapText,
                onComment: false,
                showEditor: false,
            }
        },
        computed: {
            actionsMap () {
                return {
                    ...( {
                        favorite: {
                            name: () => 'Favori',
                            icon: this.reply?.userFavorited ? 'star' : ['far', 'star'],
                            class: this.reply?.userFavorited ? 'group-hover:text-yellow-600 text-yellow-500' : 'group-hover:text-yellow-500',
                            action: () => { this.reply.userFavorited ? this.deleteFavorite() : this.addFavorite() },
                        },
                        addComment: {
                            name: () => 'Commenter',
                            icon: ['far', 'comment'],
                            class: 'group-hover:text-blue-500',
                            action: () => { this.onComment = true },
                        },
                        report: {
                            name: () => 'Signaler',
                            icon: this.reply?.userReported ? 'flag' : ['far', 'flag'],
                            class: this.reply?.userReported ? 'group-hover:text-red-600 text-red-500' : 'group-hover:text-red-500',
                            action: () => { this.reply?.userReported ? alert('Vous avez déjà signalé cette réponse.') : this.$emit('report', this.reply) },
                        },
                    }),
                    ...(this.reply.author.userId === this.$store.state.auth.user?.userId && {
                        edit: {
                            name: () => 'Éditer',
                            condition: () => this.isUser(),
                            icon: 'pen',
                            class: 'group-hover:text-green-600',
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

            this.$emitter.on('thread-action', () => this.showEditor = false)
        },
        methods: {
            updateReply(body) {
                this.$store.dispatch('threads/updateContent', {
                    contentId: this.reply.contentId,
                    body,
                })
            },
            sendVote(vote) {
                this.$store.dispatch('threads/voteContent', {
                    contentId: this.reply.contentId,
                    value: vote,
                })
            },
            addFavorite() {
                this.$store.dispatch('threads/addFavorite', this.reply.contentId)
            },
            deleteFavorite() {
                this.$store.dispatch('threads/deleteFavorite', this.reply)
            },
        },
    }
</script>

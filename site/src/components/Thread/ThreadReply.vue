<template>
    <div v-if="newReply && author === undefined">Erreur: Vous n'ếtes pas connecté!</div>
    <div v-else class="flex items-start">
        <div class="flex flex-col shrink-0 gap-2 items-center p-3 -ml-5 w-32 text-lg">
            <UserPreview
                :username="author?.fullname ?? 'Anonyme'"
                :avatar="author?.avatar ?? defaultAvatar"
                mode="vertical"
                :img-size="14"
            />
        </div>

        <div class="p-2 w-full rounded-xl" :class="{ 'bg-2': !newReply }">
            <div class="p-1 text-base">
                <TipTapEditableRender
                    v-model:edit="showEditor"
                    v-model:content="currentBody"
                    :cancellable="closeable"
                    :emit-content="newReply"
                    @send="newReply ? $emit('send') : (updateReply($event), $emit('send'))"
                    @cancel="$emit('close')"
                />
            </div>
            <template v-if="!newReply">
                <div class="flex items-center mt-2">
                    <div class="flex gap-2.5 items-center py-2 px-3 mt-1 rounded-lg bg-3 text-2">
                        <!-- TODO: mobile-friendly: tap & hold to react -->
                        <font-awesome-icon
                            :icon="['fa', 'heart']"
                            class="text-xl hover:text-blue-500 cursor-pointer"
                            :class="{ 'text-green-600': reply.userVote === 1 }"
                            @click="reply.userVote === 1 ? sendVote(0) : sendVote(1)"
                        />
                        <!-- <div class="text-center">
                                    {{ reply.upvotes - reply.downvotes }}
                                </div> -->
                        <font-awesome-icon
                            :icon="['fa', 'heart-broken']"
                            class="text-xl hover:text-blue-500 cursor-pointer"
                            :class="{ 'text-red-500': reply.userVote === -1 }"
                            @click="reply.userVote === -1 ? sendVote(0) : sendVote(-1)"
                        />
                    </div>
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
            </template>
        </div>
    </div>
</template>

<script>
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
            body: {
                type: String,
                default: (props) => props.reply?.body ?? defaultTipTapText,
            },
            newReply: {
                type: Boolean,
                default: false,
            },
            closeable: {
                type: Boolean,
                default: true,
            },
        },
        emits: ['report', 'close', 'send', 'update:body'],
        data() {
            return {
                defaultAvatar,
                author: this.newReply ? this.$store.state.auth.user : this.reply.author,
                currentBody: this.body,
                onComment: false,
                showEditor: this.newReply,
            }
        },
        computed: {
            actionsMap() {
                return {
                    ...{
                        favorite: {
                            name: () => 'Favori',
                            icon: this.reply?.userFavorited ? 'star' : ['far', 'star'],
                            class: this.reply?.userFavorited
                                ? 'group-hover:text-yellow-600 text-yellow-500'
                                : 'group-hover:text-yellow-500',
                            action: () => {
                                this.reply.userFavorited ? this.deleteFavorite() : this.addFavorite()
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
                            icon: this.reply?.userReported ? 'flag' : ['far', 'flag'],
                            class: this.reply?.userReported
                                ? 'group-hover:text-red-600 text-red-500'
                                : 'group-hover:text-red-500',
                            action: () => {
                                this.reply?.userReported
                                    ? alert('Vous avez déjà signalé cette réponse.')
                                    : this.$emit('report', this.reply)
                            },
                        },
                    },
                    ...(this.reply.author.userId === this.$store.state.auth.user?.userId && {
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
                return this.reply.comments
            },
        },
        mounted() {
            if (this.reply) {
                watch(
                    () => this.reply.body,
                    (newBody) => {
                        this.currentBody = newBody
                    },
                )
            }

            watch(
                () => this.currentBody,
                (newBody) => {
                    this.$emit('update:body', newBody)
                },
            )

            this.$emitter.on('thread-action', () => (this.showEditor = false))
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

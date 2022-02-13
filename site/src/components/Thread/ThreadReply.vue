<template>
    <ThreadCommentable :content="reply">
        <template #content>
            <TipTapEditableRender
                v-model:edit="showEditor"
                v-model:content="currentBody"
                :cancellable="true"
                @send="updateReply($event), $emit('send')"
                @cancel="$emit('close')"
            />
            <div class="flex items-center mt-2">
                <!-- TODO: mobile-friendly: tap & hold to react -->
                <font-awesome-icon
                    :icon="['fa', 'heart']"
                    class="p-2 text-xl hover:text-blue-500 cursor-pointer"
                    :class="[reply.userVote === 1 ? 'text-green-600' : 'text-5']"
                    @click="reply.userVote === 1 ? sendVote(0) : sendVote(1)"
                />
                <!-- <div class="text-center">
                                    {{ reply.upvotes - reply.downvotes }}
                                </div> -->
                <font-awesome-icon
                    :icon="['fa', 'heart-broken']"
                    class="p-2 text-xl hover:text-blue-500 cursor-pointer"
                    :class="[reply.userVote === -1 ? 'text-red-500' : 'text-5']"
                    @click="reply.userVote === -1 ? sendVote(0) : sendVote(-1)"
                />
                <div
                    v-for="(action, _, i) in actionsMap"
                    :key="i"
                    class="group flex gap-1 items-center p-2 rounded-lg transition cursor-pointer text-5"
                    @click="action.action"
                >
                    <font-awesome-icon :icon="action.icon" :class="action.class" />
                    <p class="text-sm" :class="action.class">
                        {{ action.name() }}
                    </p>
                </div>
            </div>
        </template>
    </ThreadCommentable>
</template>

<script>
    import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'

    import { defaultTipTapText } from '@/utils/tiptap'
    import { watch } from 'vue'

    import ThreadCommentable from './ThreadCommentable.vue'

    export default {
        components: {
            TipTapEditableRender,
            ThreadCommentable,
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
                defaultTipTapText,
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
                                this.reply.userFavorited
                                    ? this.$store.dispatch('threads/deleteFavorite', this.reply)
                                    : this.$store.dispatch('threads/addFavorite', this.reply.contentId)
                            },
                        },
                        delete: {
                            name: () => 'Supprimer',
                            icon: 'trash-alt',
                            class: 'group-hover:text-red-600',
                            action: () => {
                                this.$store.dispatch('threads/deleteContent', this.reply.contentId)
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
        },
        methods: {
            resetReply() {
                this.currentBody = defaultTipTapText
            },
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
        },
    }
</script>

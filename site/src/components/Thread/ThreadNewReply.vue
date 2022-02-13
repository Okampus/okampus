<template>
    <div>
        <p class="mt-2 ml-6 label-title">Répondre à ce post</p>
        <div
            id="new-reply"
            class="flex shrink-0 gap-2 p-4 w-full text-lg rounded-none shadow-md md:rounded-lg bg-card-meta"
        >
            <UserAvatar :img-src="user.avatar" :username="user.fullname" />
            <div class="flex w-full triangle-before">
                <TipTapEditableRender
                    v-model:content="currentBody"
                    :edit="true"
                    class="w-full"
                    :cancellable="false"
                    :emit-content="true"
                    @send="sendReply()"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import TipTapEditableRender from '@/components/TipTap/TipTapEditableRender.vue'
    import UserAvatar from '../User/UserAvatar.vue'

    import { defaultTipTapText } from '@/utils/tiptap'

    export default {
        components: {
            TipTapEditableRender,
            UserAvatar,
        },
        props: {
            postParentId: {
                type: Number,
                required: true,
            },
        },
        emits: ['report', 'send'],
        data() {
            return {
                defaultTipTapText,
                author: this.$store.state.auth.user,
                currentBody: this.body,
                onComment: false,
                showEditor: this.newReply,
            }
        },
        computed: {
            user() {
                return this.$store.state.auth.user
            },
        },
        methods: {
            sendVote(vote) {
                this.$store.dispatch('threads/voteContent', {
                    contentId: this.reply.contentId,
                    value: vote,
                })
            },
            sendReply() {
                this.$store
                    .dispatch('threads/addReply', {
                        parentId: this.postParentId,
                        body: this.currentBody,
                    })
                    .then(() => {
                        this.currentBody = defaultTipTapText
                    })
                    .catch((err) => {
                        this.$emitter.emit('show-toast', {
                            text: `La réponse n'a pas pu être envoyée (${
                                err?.response?.data?.message ?? err.toString()
                            })`,
                            type: 'error',
                        })
                    })
            },
        },
    }
</script>

<style lang="scss">
    .triangle-before::before {
        width: 0;
        height: 0;
        margin-top: 0.6rem;
        vertical-align: middle;
        content: '';
        border-color: transparent #fff transparent transparent;
        border-style: solid;
        border-width: 0.6rem 0.9rem 0.6rem 0;

        :root.dark & {
            border-color: transparent #000 transparent transparent;
        }
    }
</style>

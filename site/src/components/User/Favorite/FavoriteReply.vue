<template>
    <div class="flex m-4 rounded-md bg-1 min-h-32">
        <div
            class="flex object-cover flex-col justify-center px-8 ml-4 border-l-2 border-dashed border-color-2-alt"
        >
            <font-awesome-icon icon="comment" class="hidden text-4xl text-center md:block text-2" />
        </div>
        <div class="flex w-full">
            <div class="flex flex-col justify-between my-2">
                <div>
                    <p class="text-5">
                        Publié par {{ reply.author.username }} {{ timeAgo(new Date(reply.createdAt)) }}
                    </p>
                    <router-link :to="`/posts/${reply.post.postId}`" class="mr-4 text-lg line-clamp-2 text-0">
                        {{ extractTextFromTipTapJSON(JSON.parse(reply.body)) }}
                    </router-link>
                </div>
                <div class="flex gap-2 items-center">
                    <div class="flex gap-2">
                        <div
                            class="flex items-center py-1.5 px-2 hover:bg-3-light hover:dark:bg-3-dark rounded cursor-pointer text-5"
                        >
                            <font-awesome-icon
                                class="block pl-1 tracking-tighter cursor-pointer"
                                :class="{ 'text-green-600': reply.currentVote === 1 }"
                                :icon="reply.currentVote === 1 ? 'thumbs-up' : ['far', 'thumbs-up']"
                                @click="reply.currentVote === 1 ? sendVote(0) : sendVote(1)"
                            />
                            <p class="block pl-1 ml-1 text-sm tracking-tighter text-2">
                                {{ reply.upvotes }}
                            </p>
                        </div>
                        <div
                            class="flex items-center py-1.5 px-2 hover:bg-3-light hover:dark:bg-3-dark rounded text-5"
                        >
                            <font-awesome-icon
                                class="pl-1 tracking-tighter cursor-pointer"
                                :icon="reply.currentVote === -1 ? 'thumbs-down' : ['far', 'thumbs-down']"
                                @click="reply.currentVote === -1 ? sendVote(0) : sendVote(-1)"
                            />
                            <p class="pl-1 ml-1 text-sm tracking-tighter">
                                {{ reply.downvotes }}
                            </p>
                        </div>
                    </div>
                    <div
                        v-for="(action, i) in actions"
                        :key="i"
                        class="flex items-center py-1.5 px-2 hover:bg-3-light hover:dark:bg-3-dark rounded text-5"
                        @click="actionsMap[action].action"
                    >
                        <font-awesome-icon :icon="actionsMap[action].icon" />
                        <p class="hidden pl-1 text-sm tracking-tighter md:block text-2">
                            {{ actionsMap[action].name() }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { extractTextFromTipTapJSON } from '@/utils/tiptap'
import { timeAgo } from '@/utils/timeAgo'

export default {
    components: {},
    props: {
        reply: {
            type: Object,
            default: () => {},
        },
        actions: {
            type: Array,
            default: function () {
                return ['viewComments', 'favorite', 'flag']
            },
        },
    },
    computed: {
        actionsMap() {
            // TODO: Actions
            return {
                viewComments: {
                    name: () => 'Commentaires',
                    icon: 'comments',
                    action: function () {
                        console.log('Commentaire')
                    },
                },
                favorite: {
                    name: () => 'Favori',
                    icon: this.reply?.favorited ? 'star' : ['far', 'star'],
                    class: this.reply?.favorited
                        ? 'hover:text-yellow-500 text-yellow-400'
                        : 'hover:text-yellow-400',
                    action: () => {
                        this.reply?.favorited ? this.deleteFavorite() : this.addFavorite()
                    },
                },
                flag: {
                    name: () => 'Signaler',
                    icon: 'flag',
                    action: function () {
                        console.log('Signaler')
                    },
                },
            }
        },
    },
    methods: {
        timeAgo,
        extractTextFromTipTapJSON,
        sendVote(vote) {
            this.$store.dispatch('users/voteReplyFav', {
                replyId: this.reply.replyId,
                value: vote,
            })
        },
        addFavorite() {
            this.$store.dispatch('users/addFavoriteReply', this.reply.replyId)
        },
        deleteFavorite() {
            this.$store.dispatch('users/deleteFavoriteReply', this.reply.replyId)
        },
    },
}
</script>
<style></style>

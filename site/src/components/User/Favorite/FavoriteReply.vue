<template>
    <div class="m-4 flex bg-1 min-h-32 rounded-md">
        <div class="flex border-dashed border-l-2 border-color-2-alt flex-col  justify-center object-cover ml-4 px-8 ">
            <font-awesome-icon
                icon="comment"
                class="text-2 text-4xl text-center hidden md:block"
            />
        </div>
        <div class="flex w-full">
            <div class="my-2 flex flex-col justify-between ">
                <div>
                    <p class="text-5">
                        Publié par {{ reply.author.username }} {{ timeAgo(new Date(reply.createdAt)) }}
                    </p>
                    <router-link
                        :to="`/posts/${reply.post.postId}`"
                        class="text-0 text-lg mr-4 line-clamp-2 "
                    >
                        {{ extractTextFromTipTapJSON(JSON.parse(reply.body)) }}
                    </router-link>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex gap-2">
                        <div class="flex items-center text-5 hover:bg-3-light hover:dark:bg-3-dark px-2 py-1.5 rounded cursor-pointer">
                            <font-awesome-icon
                                class="cursor-pointer tracking-tighter pl-1 block"
                                :class="{'text-green-600': reply.currentVote === 1}"
                                :icon="reply.currentVote === 1 ? 'thumbs-up' : ['far', 'thumbs-up']"
                                @click="reply.currentVote === 1 ? sendVote(0) : sendVote(1)"
                            />
                            <p class="text-2 text-sm ml-1 tracking-tighter pl-1 block">
                                {{ reply.upvotes }}
                            </p>
                        </div>
                        <div class="flex items-center text-5 hover:bg-3-light hover:dark:bg-3-dark px-2 py-1.5 rounded">
                            <font-awesome-icon
                                class="cursor-pointer tracking-tighter pl-1 "
                                :icon="reply.currentVote === -1 ? 'thumbs-down' : ['far', 'thumbs-down']"
                                @click="reply.currentVote === -1 ? sendVote(0) : sendVote(-1)"
                            />
                            <p class=" text-sm ml-1 tracking-tighter pl-1 ">
                                {{ reply.downvotes }}
                            </p>
                        </div>
                    </div>
                    <div
                        v-for="(action,i) in actions"
                        :key="i"
                        class="flex items-center text-5 hover:bg-3-light hover:dark:bg-3-dark px-2 py-1.5 rounded"
                        @click="actionsMap[action].action"
                    >
                        <font-awesome-icon
                            :icon="actionsMap[action].icon"
                        />
                        <p class="text-2 text-sm tracking-tighter pl-1 hidden md:block">
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
    components: {  },
    props: {
        reply: {
            type: Object,
            default: () => {}
        },
        actions: {
            type: Array,
            default: function () {
                return [
                    'viewComments',
                    'favorite',
                    'flag'
                ]
            }
        }
    },
    computed: {
        actionsMap () {
            // TODO: Actions
            return {
                viewComments: {
                    name: () => { return "Commentaires" },
                    icon: 'comments',
                    action: function () { console.log('Commentaire') }
                },
                favorite: {
                    name:()=> 'Favori',
                    icon: this.reply?.favorited ? 'star' : ['far', 'star'],
                    class: this.reply?.favorited ? 'hover:text-yellow-500 text-yellow-400' : 'hover:text-yellow-400',
                    action: () => { this.reply?.favorited ? this.deleteFavorite() : this.addFavorite() }
                },
                flag: {
                    name: () => { return 'Signaler' },
                    icon: 'flag',
                    action: function () { console.log('Signaler') }
                },
            }
        }
    },
    methods: {
        timeAgo,
        extractTextFromTipTapJSON,
        sendVote(vote) {
            this.$store.dispatch('users/voteReplyFav', {
                replyId: this.reply.replyId,
                value: vote
            })
        },
        addFavorite() {
            this.$store.dispatch('users/addFavoriteReply', this.reply.replyId)
        },
        deleteFavorite() {
            this.$store.dispatch('users/deleteFavoriteReply', this.reply.replyId)
        }
    }

}
</script>
<style >
</style>

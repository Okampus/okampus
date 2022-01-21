<template>
    <div class="m-4 flex bg-1 rounded-md">
        <div class="border-dashed border-l-2 border-color-2-alt ml-2 " />
        <div class="flex border-dashed border-l-2 border-color-2-alt flex-col  justify-center object-cover ml-2 px-8">
            <font-awesome-icon
                icon="comment"
                class="text-2 text-xl text-center hidden md:block"
            />
        </div>
        <div class="flex w-full">
            <div class="my-2 flex flex-col justify-between ">
                <div>
                    <p class="text-5">
                        Publié par {{ comment.author.username }} {{ timeAgo(new Date(comment.createdAt)) }}
                    </p>
                    <router-link
                        :to="`/posts/${comment.post.postId}`"
                        class="text-0 text-lg mr-4 line-clamp-2 "
                    >
                        {{ extractTextFromTipTapJSON(JSON.parse(comment.body)) }}
                    </router-link>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex gap-2">
                        <div class="flex items-center text-5 hover:bg-3-light hover:dark:bg-3-dark px-2 py-1.5 rounded">
                            <font-awesome-icon
                                class="cursor-pointer tracking-tighter pl-1 block"
                                :class="{'text-green-600': comment.currentVote === 1}"
                                :icon="comment.currentVote === 1 ? 'thumbs-up' : ['far', 'thumbs-up']"
                                @click="comment.currentVote === 1 ? sendVote(0) : sendVote(1)"
                            />
                            <p class=" text-sm ml-1 tracking-tighter pl-1 ">
                                {{ comment.upvotes }}
                            </p>
                        </div>
                    </div>
                    <div
                        v-for="(action,i) in actions"
                        :key="i"
                        class="flex items-center text-5 hover:bg-3-light hover:dark:bg-3-dark px-2 py-1.5 rounded cursor-pointer"
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

import { timeAgo } from '@/utils/timeAgo'
import { extractTextFromTipTapJSON } from '@/utils/tiptap'
export default {
    components: {  },
    props: {
        comment: {
            type: Object,
            default: () => {}
        },
        actions: {
            type: Array,
            default: function () {
                return [
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
                favorite: {
                    name: ()=> 'Favori',
                    icon: this.comment?.favorited ? 'star' : ['far', 'star'],
                    class: this.comment?.favorited ? 'hover:text-yellow-500 text-yellow-400' : 'hover:text-yellow-400',
                    action: () => { this.comment.favorited ? this.deleteFavorite() : this.addFavorite() }
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
            this.$store.dispatch('users/voteCommentFav', {
                commentId: this.comment.commentId,
                value: vote
            })
        },
        addFavorite() {
            this.$store.dispatch('users/addFavoriteComment', this.comment.commentId)
        },
        deleteFavorite() {
            this.$store.dispatch('users/deleteFavoriteComment', this.comment.commentId)
        }
    }

}
</script>
<style >
</style>

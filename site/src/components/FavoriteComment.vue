<template>
    <div class="m-4 flex bg-1 rounded-md">
        <div class="border-dashed border-l-2 border-color-2-alt ml-2 " />
        <div class="flex border-dashed border-l-2 border-color-2-alt flex-col  justify-center object-cover ml-2 px-8">
            <i class="ri-chat-4-line text-2 text-4xl text-center hidden md:block" />
        </div>
        <div class="flex w-full">
            <div class="my-2 flex flex-col justify-between ">
                <div>
                    <p class="text-5">
                        Publié par {{ comment.author.username }} {{ dateSince(new Date(comment.createdAt)) }}
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
                            <i
                                class=" cursor-pointer  ri-sm tracking-tighter pl-1 "
                                :class="[comment.currentVote === 1 ? 'ri-thumb-up-fill text-green-600' : 'ri-thumb-up-line']"
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
                        class="flex items-center text-5 hover:bg-3-light hover:dark:bg-3-dark px-2 py-1.5 rounded"
                        @click="actionsMap[action].action"
                    >
                        <i
                            :class="actionsMap[action].icon"
                            class="ri-md"
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
                favorite: { name:()=> 'Favoris', icon: this.comment.favorited ? 'ri-star-fill text-yellow-500' : 'ri-star-line', class: [this.comment.favorited ? 'hover:text-blue-500 text-yellow-500' : 'hover:text-yellow-500', 'cursor-pointer'],
                    action: () => { this.comment.favorited ? this.deleteFavorite() : this.addFavorite() } },
                flag: { name: () => { return 'Signaler' }, icon: 'ri-flag-line', action: function () { console.log('Signaler') } },
            }
        }
    },
    methods: {
        dateSince: (date) => {
            const formatter = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

            const DIVISIONS = [
                { amount: 60, name: 'seconds' },
                { amount: 60, name: 'minutes' },
                { amount: 24, name: 'hours' },
                { amount: 7, name: 'days' },
                { amount: 4.34524, name: 'weeks' },
                { amount: 12, name: 'months' },
                { amount: Number.POSITIVE_INFINITY, name: 'years' },
            ];
            let duration = (date - new Date()) / 1000;

            for (let i = 0; i <= DIVISIONS.length; i++) {
                const division = DIVISIONS[i];
                if (Math.abs(duration) < division.amount) {
                    return formatter.format(Math.round(duration), division.name);
                }
                duration /= division.amount;
            }
        },
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

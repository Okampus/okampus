<template>
    <div
        v-if="post!=undefined"
        class="m-4 flex bg-1 h-32 rounded-md"
    >
        <div class="flex flex-col text-white w-14 justify-center bg-gray-600 rounded-l-md">
            <button>
                <i
                    class="ri-arrow-up-s-fill ri-2x hover:text-blue-500 cursor-pointer"
                    :class="[post.currentVote === 1 ? 'text-orange-500' : '']"
                    @click="post.currentVote === 1 ? sendVote(0) : sendVote(1)"
                />
            </button>
            <div class="text-center mx-1">
                {{ post.upvotes - post.downvotes }}
            </div>
            <button>
                <i
                    class="ri-arrow-down-s-fill ri-2x hover:text-blue-500 cursor-pointer"
                    :class="[post.currentVote === -1 ? 'text-orange-500' : '']"
                    @click="post.currentVote === -1 ? sendVote(0) : sendVote(-1)"
                />
            </button>
        </div>
        <div class="mx-2 hidden md:block my-auto">
            <div v-if="1==1">
                <div class="flex flex-col justify-center object-cover h-24 w-32 bg-2 rounded">
                    <i class="ri-align-justify text-2 text-4xl text-center" />
                </div>
            </div>
            <div v-if="1==2">
                <div class="flex flex-col justify-center object-cover h-24 w-32 bg-2 rounded">
                    <i class="ri-links-line text-2 text-4xl text-center" />
                </div>
            </div>
        </div>
        <div class="my-2 flex ml-4 md:ml-0 flex-col justify-between w-full">
            <div>
                <div class="flex">
                    <router-link
                        :to="`/posts/${post.postId}`"
                        class="text-0 text-xl font-semibold mr-4 whitespace-nowrap "
                    >
                        {{ post.title }}
                    </router-link>
                    <TagsList
                        :tags="post.tags"
                    />
                </div>
                <p class="text-5">
                    Publié par {{ post.author.username }} {{ dateSince(new Date(post.createdAt)) }}, dernière mise à jour {{ dateSince(new Date(post.contentLastUpdatedAt)) }}
                </p>
            </div>
            <div class="flex items-center ri-lg gap-2">
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
</template>

<script>
import TagsList from '@/components/List/TagsList.vue'

export default {
    components: { TagsList },
    props: {
        post: {
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
            return {
                viewComments: { name: () => { return "Commentaires" }, icon: 'ri-chat-2-line', action: function () { console.log('Commentaire') } },
                favorite: { name:()=> 'Favoris', icon: this.post.favorited ? 'ri-star-fill text-yellow-500' : 'ri-star-line', class: [this.post.favorited ? 'hover:text-blue-500 text-yellow-500' : 'hover:text-yellow-500', 'cursor-pointer'],
                    action: () => { this.post.favorited ? this.deleteFavorite() : this.addFavorite() } },
                flag: { name: () => { return 'Signaler' }, icon: 'ri-flag-line', action: function () { console.log('Signaler') } },
            }
        }
    },
    mounted () {
        this.fetchPost()
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
        fetchPost() {
            console.log("fetch")
            this.$store.dispatch('thread/fetchThread', this.post.postId)
        },
        addFavorite() {
            this.$store.dispatch('users/addFavoritePost', this.post.postId)
        },
        deleteFavorite() {
            this.$store.dispatch('users/deleteFavoritePost', this.post.postId)
        },
        sendVote(vote) {
            this.$store.dispatch('users/votePostFav', {
                postId: this.post.postId,
                value: vote
            })
        }
    }

}
</script>
<style >
</style>

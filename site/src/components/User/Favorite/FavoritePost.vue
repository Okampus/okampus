<template>
    <div
        v-if="post!=undefined"
        class="m-4 flex bg-1 h-32 rounded-md"
    >
        <div class="flex flex-col text-white w-14 justify-center bg-gray-600 rounded-l-md">
            <button>
                <font-awesome-icon
                    icon="chevron-up"
                    class="hover:text-blue-500 cursor-pointer"
                    :class="[post.currentVote === 1 ? 'text-orange-500' : '']"
                    @click="post.currentVote === 1 ? sendVote(0) : sendVote(1)"
                />
            </button>
            <div class="text-center mx-1">
                {{ post.upvotes - post.downvotes }}
            </div>
            <button>
                <font-awesome-icon
                    icon="chevron-down"
                    class="hover:text-blue-500 cursor-pointer"
                    :class="[post.currentVote === -1 ? 'text-orange-500' : '']"
                    @click="post.currentVote === -1 ? sendVote(0) : sendVote(-1)"
                />
            </button>
        </div>
        <div class="mx-2 hidden md:block my-auto">
            <div class="flex flex-col justify-center object-cover h-24 w-32 bg-2 rounded">
                <font-awesome-icon
                    icon="bookmark"
                    class="text-2 text-xl text-center"
                />
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
                    <tag-list
                        :tags="post.tags"
                    />
                </div>
                <p class="text-5">
                    Publié par {{ post.author.username }} {{ timeAgo(new Date(post.createdAt)) }}, dernière mise à jour {{ timeAgo(new Date(post.contentLastUpdatedAt)) }}
                </p>
            </div>
            <div class="flex items-center gap-2">
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
</template>

<script>
import TagList from '@/components/List/TagList.vue'
import { timeAgo } from '@/utils/timeAgo'

export default {
    components: { TagList },
    props: {
        post: {
            type: Object,
            default: () => {}
        },
        actions: {
            type: Array,
            default: function () {
                return [
                    'viewReplies',
                    'favorite',
                    'flag'
                ]
            }
        }
    },
    computed: {
        actionsMap () {
            return {
                viewReplies: {
                    name: () => { return "Réponses" },
                    icon: ['far', 'comment-alt'],
                    class: 'group-hover:text-blue-500',
                    action: function () { console.log('Réponse') }
                },
                favorite: {
                    name: () => 'Favori',
                    icon: this.post?.favorited ? 'star' : ['far', 'star'],
                    class: this.post?.favorited ? 'hover:text-yellow-500 text-yellow-400' : 'hover:text-yellow-400',
                    action: () => { this.post.favorited ? this.deleteFavorite() : this.addFavorite() }
                },
                flag: {
                    name: () => { return 'Signaler' },
                    icon: 'flag',
                    action: function () { console.log('Signaler') }
                },
            }
        }
    },
    mounted () {
        this.fetchPost()
    },
    methods: {
        timeAgo,
        fetchPost() {
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

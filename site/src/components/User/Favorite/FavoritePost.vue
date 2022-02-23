<template>
    <div v-if="post != undefined" class="flex m-4 h-32 rounded-md bg-1">
        <div class="flex flex-col justify-center w-14 text-white bg-gray-600 rounded-l-md">
            <button>
                <font-awesome-icon
                    icon="chevron-up"
                    class="hover:text-blue-500 cursor-pointer"
                    :class="[post.userVote === 1 ? 'text-orange-500' : '']"
                />
            </button>
            <div class="mx-1 text-center">
                {{ post.upvotes - post.downvotes }}
            </div>
            <button>
                <font-awesome-icon
                    icon="chevron-down"
                    class="hover:text-blue-500 cursor-pointer"
                    :class="[post.userVote === -1 ? 'text-orange-500' : '']"
                />
            </button>
        </div>
        <div class="hidden my-auto mx-2 md:block">
            <div class="flex object-cover flex-col justify-center items-center w-24 h-24 rounded bg-2">
                <font-awesome-icon icon="bookmark" class="text-2xl text-center text-2" />
            </div>
        </div>
        <div class="flex flex-col justify-between my-2 ml-4 w-full md:ml-0">
            <div>
                <!-- TODO: Retrieve thread data -->
                <!-- <div class="flex">
                    <router-link
                        :to="`/threads/${post.postId}`"
                        class="mr-4 text-xl font-semibold whitespace-nowrap text-0"
                    >
                        {{ post.title }}
                    </router-link>
                    <TagList :tags="post.tags" />
                </div> -->
                <p class="text-5">
                    Publié par {{ post.author.fullname }} {{ timeAgo(new Date(post.createdAt)) }}, dernière
                    mise à jour {{ timeAgo(new Date(post.contentLastUpdatedAt)) }}
                </p>
            </div>
            <div class="flex gap-2 items-center">
                <div
                    v-for="(action, i) in actions"
                    :key="i"
                    class="flex items-center py-1.5 px-2 hover:bg-3-light hover:dark:bg-3-dark rounded cursor-pointer text-5"
                    @click="actionsMap[action].action"
                >
                    <font-awesome-icon :icon="actionsMap[action].icon" :class="actionsMap[action].class" />

                    <p
                        class="hidden pl-1 text-sm tracking-tighter md:block text-2"
                        :class="actionsMap[action].class"
                    >
                        {{ actionsMap[action].name() }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import TagList from '@/components/List/TagList.vue'
    import { timeAgo } from '@/utils/timeAgo'

    export default {
        // components: { TagList },
        props: {
            post: {
                type: Object,
                default: () => {},
            },
            actions: {
                type: Array,
                default: function () {
                    return ['viewReplies', 'favorite', 'flag']
                },
            },
        },
        computed: {
            actionsMap() {
                return {
                    viewReplies: {
                        name: () => 'Réponses',
                        icon: ['far', 'comment-alt'],
                        class: 'group-hover:text-blue-500',
                        action: function () {
                            console.log('Réponse')
                        },
                    },
                    favorite: {
                        name: () => 'Favori',
                        icon: 'star',
                        class: 'hover:text-yellow-600 text-yellow-500',
                        action: () => {
                            this.deleteFavorite()
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
            deleteFavorite() {
                this.$store.dispatch('user/deleteFavorite', this.post.contentId)
            },
        },
    }
</script>

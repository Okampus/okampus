<template>
    <div v-if="post != undefined" class="bg-1 m-4 flex h-32 rounded-md">
        <div class="flex w-14 flex-col justify-center rounded-l-md bg-gray-600 text-white">
            <button>
                <font-awesome-icon
                    icon="chevron-up"
                    class="cursor-pointer hover:text-blue-500"
                    :class="[post.userVote === 1 ? 'text-orange-500' : '']"
                />
            </button>
            <div class="mx-1 text-center">
                {{ post.upvotes - post.downvotes }}
            </div>
            <button>
                <font-awesome-icon
                    icon="chevron-down"
                    class="cursor-pointer hover:text-blue-500"
                    :class="[post.userVote === -1 ? 'text-orange-500' : '']"
                />
            </button>
        </div>
        <div class="my-auto mx-2 hidden md:block">
            <div class="bg-2 flex h-24 w-24 flex-col items-center justify-center rounded object-cover">
                <font-awesome-icon icon="bookmark" class="text-2 text-center text-2xl" />
            </div>
        </div>
        <div class="my-2 ml-4 flex w-full flex-col justify-between md:ml-0">
            <div>
                <!-- TODO: Retrieve thread data -->
                <!-- <div class="flex">
                    <router-link
                        :to="`/post/${post.postId}`"
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
            <div class="flex items-center gap-2">
                <div
                    v-for="(action, i) in actions"
                    :key="i"
                    class="text-5 flex cursor-pointer items-center rounded py-1.5 px-2 hover:bg-3-light hover:dark:bg-3-dark"
                    @click="actionsMap[action].action"
                >
                    <font-awesome-icon :icon="actionsMap[action].icon" :class="actionsMap[action].class" />

                    <p
                        class="text-2 hidden pl-1 text-sm tracking-tighter md:block"
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
                this.$store.dispatch('user/deleteFavorite', this.post.id)
            },
        },
    }
</script>

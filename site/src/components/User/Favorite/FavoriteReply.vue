<template>
    <div class="flex m-4 rounded-md bg-1 min-h-32">
        <div
            class="flex object-cover flex-col justify-center px-8 ml-4 border-l-2 border-dashed border-color-2-alt"
        >
            <font-awesome-icon icon="comment" class="hidden text-4xl text-center md:block" />
        </div>
        <div class="flex w-full">
            <div class="flex flex-col justify-between my-2">
                <div>
                    <p class="text-5">
                        Publié par {{ reply.author.fullname }} {{ timeAgo(new Date(reply.createdAt)) }}
                    </p>
                    <!-- TODO: find parent post to link it -->
                    <!-- <router-link :to="`/threads/${reply.post.postId}`" class="mr-4 text-lg line-clamp-2 text-0"> -->
                    {{ reply.body }}
                    <!-- </router-link> -->
                </div>
                <div class="flex gap-2 items-center">
                    <div class="flex gap-2">
                        <div
                            class="flex items-center py-1.5 hover:bg-3-light hover:dark:bg-3-dark rounded cursor-pointer text-5"
                        >
                            <font-awesome-icon
                                class="block pl-1 tracking-tighter cursor-pointer"
                                :class="{ 'text-green-600': reply.userVote === 1 }"
                            />
                            <p class="block pl-1 ml-1 text-sm tracking-tighter text-2">
                                {{ reply.upvotes }}
                            </p>
                        </div>
                        <div class="flex items-center py-1.5 hover:bg-3-light hover:dark:bg-3-dark rounded">
                            <font-awesome-icon
                                class="pl-1 tracking-tighter cursor-pointer"
                                :icon="reply.userVote === -1 ? 'thumbs-down' : ['far', 'thumbs-down']"
                                @click="reply.userVote === -1 ? sendVote(0) : sendVote(-1)"
                            />
                            <p class="pl-1 ml-1 text-sm tracking-tighter">
                                {{ reply.downvotes }}
                            </p>
                        </div>
                    </div>
                    <div
                        v-for="(action, i) in actions"
                        :key="i"
                        class="flex items-center py-1.5 px-2 hover:bg-3-light hover:dark:bg-3-dark rounded"
                        @click="actionsMap[action].action"
                    >
                        <font-awesome-icon
                            :icon="actionsMap[action].icon"
                            :class="actionsMap[action].class"
                        />
                        <p
                            class="hidden pl-1 text-sm tracking-tighter md:block"
                            :class="actionsMap[action].class"
                        >
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
                this.$store.dispatch('user/deleteFavorite', this.reply.contentId)
            },
        },
    }
</script>

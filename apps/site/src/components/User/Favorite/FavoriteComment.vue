<template>
    <div class="flex m-4 rounded-md bg-1">
        <div class="ml-2 border-l-2 border-dashed border-color-2-alt" />
        <div
            class="flex object-cover flex-col justify-center px-8 ml-2 border-l-2 border-dashed border-color-2-alt"
        >
            <font-awesome-icon icon="comment" class="hidden text-xl text-center md:block text-2" />
        </div>
        <div class="flex w-full">
            <div class="flex flex-col justify-between my-2">
                <div>
                    <p class="text-5">
                        Publié par {{ comment.author.fullname }} {{ timeAgo(new Date(comment.createdAt)) }}
                    </p>
                    <!-- TODO: find parent post to link it -->
                    <!-- <router-link
                        :to="`/threads/${comment.post.postId}`"
                        class="mr-4 text-lg line-clamp-2 text-0"
                    > -->
                    {{ comment.body }}
                    <!-- </router-link> -->
                </div>
                <div class="flex gap-6 items-center">
                    <div class="flex gap-2">
                        <div
                            class="flex items-center py-1.5 hover:bg-3-light hover:dark:bg-3-dark rounded text-5"
                        >
                            <font-awesome-icon
                                class="block pl-1 tracking-tighter cursor-pointer"
                                :class="{ 'text-green-600': comment.userVote === 1 }"
                                :icon="comment.userVote === 1 ? 'thumbs-up' : ['far', 'thumbs-up']"
                            />
                            <p class="pl-1 ml-1 text-sm tracking-tighter">
                                {{ comment.upvotes }}
                            </p>
                        </div>
                    </div>

                    <div
                        v-for="(action, i) in actions"
                        :key="i"
                        class="flex items-center py-1.5 hover:bg-3-light hover:dark:bg-3-dark rounded cursor-pointer text-5"
                        @click="actionsMap[action].action"
                    >
                        <font-awesome-icon
                            :icon="actionsMap[action].icon"
                            :class="actionsMap[action].class"
                        />
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
    </div>
</template>

<script>
    import { timeAgo } from '@/utils/timeAgo'
    export default {
        components: {},
        props: {
            comment: {
                type: Object,
                default: () => {},
            },
            actions: {
                type: Array,
                default: function () {
                    return ['favorite', 'flag']
                },
            },
        },
        computed: {
            actionsMap() {
                // TODO: Actions
                return {
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
                this.$store.dispatch('user/deleteFavorite', this.comment.contentId)
            },
        },
    }
</script>

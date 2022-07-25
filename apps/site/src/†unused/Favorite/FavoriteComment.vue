<template>
    <div class="bg-1 m-4 flex rounded-md">
        <div class="border-color-2-alt ml-2 border-l-2 border-dashed" />
        <div
            class="border-color-2-alt ml-2 flex flex-col justify-center border-l-2 border-dashed object-cover px-8"
        >
            <font-awesome-icon icon="comment" class="text-2 hidden text-center text-xl md:block" />
        </div>
        <div class="flex w-full">
            <div class="my-2 flex flex-col justify-between">
                <div>
                    <p class="text-5">
                        Publié par {{ comment.author.fullname }} {{ timeAgo(new Date(comment.createdAt)) }}
                    </p>
                    <!-- TODO: find parent post to link it -->
                    <!-- <router-link
                        :to="`/post/${comment.post.postId}`"
                        class="mr-4 text-lg line-clamp-2 text-0"
                    > -->
                    {{ comment.body }}
                    <!-- </router-link> -->
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex gap-2">
                        <div
                            class="text-5 flex items-center rounded py-1.5 hover:bg-3-light hover:dark:bg-3-dark"
                        >
                            <font-awesome-icon
                                class="block cursor-pointer pl-1 tracking-tighter"
                                :class="{ 'text-green-600': comment.userVote === 1 }"
                                :icon="comment.userVote === 1 ? 'thumbs-up' : ['far', 'thumbs-up']"
                            />
                            <p class="ml-1 pl-1 text-sm tracking-tighter">
                                {{ comment.upvotes }}
                            </p>
                        </div>
                    </div>

                    <div
                        v-for="(action, i) in actions"
                        :key="i"
                        class="text-5 flex cursor-pointer items-center rounded py-1.5 hover:bg-3-light hover:dark:bg-3-dark"
                        @click="actionsMap[action].action"
                    >
                        <font-awesome-icon
                            :icon="actionsMap[action].icon"
                            :class="actionsMap[action].class"
                        />
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
                this.$store.dispatch('user/deleteFavorite', this.comment.id)
            },
        },
    }
</script>

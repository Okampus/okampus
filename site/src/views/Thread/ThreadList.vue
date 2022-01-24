<template>
    <!-- TODO: add filtering, tab, info panel -->
    <div>
        <div class="absolute top-0 left-0 py-12 w-full h-52 hero">
            <h3 class="px-10 text-4xl font-bold text-0">Liste des Posts</h3>
        </div>
        <div class="flex relative flex-col mt-32 mb-10">
            <div v-if="!loggedIn" class="ml-32 text-2xl text-0">Vous n'êtes pas connecté !</div>
            <template v-for="(post, i) in posts" v-else-if="posts.length" :key="i">
                <PostCard class="mx-2/24 mb-2" :post="post" />
            </template>
            <div v-else class="ml-32 text-2xl text-0">Aucun post ne correspond à ces critères.</div>
        </div>
    </div>
</template>

<script lang="js">
import { watch } from 'vue'
import PostCard from '@/components/App/Card/PostCard.vue'

export default {
    components: { PostCard },
    data () {
        return { posts: this.$store.state.posts.posts }
    },
    computed: {
        loggedIn () {
            return this.$store.state.auth.status.loggedIn
        },
    },
    mounted () {
        this.emitter.on('login', () => {
            this.refreshPosts()
        })

        this.emitter.on('logout', () => {
            this.$store.dispatch('posts/refreshPosts')
        })

        watch(() => this.$store.getters['posts/getPosts'], (posts) => {
            this.posts = posts
        })

        if (this.loggedIn) {
            this.$store.dispatch('posts/newFetchPosts')
        }
    },
    methods: {
        refreshPosts () {
            this.$store.dispatch('posts/newFetchPosts')
        },
        loadPosts () {
            if (this.$store.state.posts.page === 0) {
                this.$store.dispatch('posts/fetchPosts')
            }
        },
    },
}
</script>

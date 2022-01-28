<template>
    <!-- TODO: add filtering, tab, info panel -->
    <div>
        <div class="absolute top-0 left-0 py-12 w-full h-52 hero">
            <h3 class="px-10 text-4xl font-bold text-0">Liste des Posts</h3>
        </div>
        <div class="flex relative flex-col mt-32 mb-10">
            <div v-if="!loggedIn" class="ml-32 text-2xl text-0">Vous n'êtes pas connecté !</div>
            <template v-for="(thread, i) in threads" v-else-if="threads.length" :key="i">
                <ThreadPreviewCard class="mx-2/24 mb-2" :thread="thread" />
            </template>
            <div v-else class="ml-32 text-2xl text-0">Aucun post ne correspond à ces critères.</div>
        </div>
    </div>
</template>

<script lang="js">
    import ThreadPreviewCard from '@/components/App/Card/ThreadPreviewCard.vue'
    import { watch } from 'vue'

    export default {
        components: { ThreadPreviewCard },
        data() {
            return { threads: this.$store.getters['threads/getThreads'] }
        },
        computed: {
            loggedIn () {
                return this.$store.state.auth.loggedIn
            },
        },
        mounted () {
            if (this.loggedIn) {
                this.refreshThreads()
            }

            watch(() => this.$store.getters['threads/getThreads'], (threads) => {
                this.threads = threads
            })

            this.$emitter.on('login', () => {
                this.refreshThreads()
            })

            this.$emitter.on('logout', () => {
                this.$store.commit('threads/refreshThreads')
            })
        },
        methods: {
            refreshThreads () {
                this.$store.commit('threads/refreshThreads')
                this.$store.dispatch('threads/getThreads')
            },
        },
    }
</script>

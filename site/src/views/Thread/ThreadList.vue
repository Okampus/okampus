<template>
    <!-- TODO: add filtering, tab, info panel -->
    <ListPage>
        <template v-if="threads.length && loggedIn">
            <template v-for="(thread, i) in threads" :key="i">
                <ThreadPreviewCard :thread="thread" />
            </template>
        </template>
        <div v-else class="ml-32 text-2xl text-0">
            {{ loggedIn ? 'Aucun post ne correspond à ces critères.' : "Vous n'êtes pas connecté !" }}
        </div>
    </ListPage>
</template>

<script>
    import ThreadPreviewCard from '@/components/App/Card/ThreadPreviewCard.vue'
    import { watch } from 'vue'
    import ListPage from '../App/ListPage.vue'

    export default {
        components: { ThreadPreviewCard, ListPage },
        data() {
            return {
                threads: this.$store.getters['threads/getThreads'],
            }
        },
        computed: {
            loggedIn() {
                return this.$store.state.auth.loggedIn
            },
        },
        mounted() {
            if (this.loggedIn) {
                this.refreshThreads()
            }

            watch(
                () => this.$store.getters['threads/getThreads'],
                (threads) => {
                    this.threads = threads
                },
            )

            this.$emitter.on('login', () => {
                this.refreshThreads()
            })

            this.$emitter.on('logout', () => {
                this.$store.commit('threads/refreshThreads')
            })
        },
        methods: {
            refreshThreads() {
                this.$store.commit('threads/refreshThreads')
                this.$store.dispatch('threads/getThreads')
            },
        },
    }
</script>

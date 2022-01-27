<template>
    <!-- TODO: Solve unexpected overflow! -->
    <div>
        <div class="absolute top-0 left-0 py-12 w-full h-52 hero" />
        <div class="relative mx-auto mt-12 mb-10 w-11/12">
            <div class="flex mx-auto space-x-2">
                <button
                    v-for="tab in Object.keys(tabColumns)"
                    :key="tab"
                    class="w-full uppercase button"
                    @click="currentTab = tab"
                >
                    <p>{{ tab }}</p>
                </button>
            </div>

            <template v-for="column in Object.keys(tabColumns)" :key="column">
                <div :class="column === currentTab ? 'block' : 'hidden'">
                    <DashboardCore :columns="tabColumns[column][0]" :items="tabColumns[column][1]" />
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="js">
    // import { users } from '@/fake/users'
    // import { posts } from '@/fake/posts'
    import postTypeEnum from '@/shared/types/post-types.enum'
    import { watch } from 'vue'
    import DashboardCore from './DashboardCore.vue'
    export default {
        components: { DashboardCore },
        data () {
            return {
                currentTab: 'posts',
                tabColumns: {
                    reports: [{
                        user: {
                            attrs: (report) => ({
                                username: report.user.fullname,
                                avatar: report.user.avatar,
                                reputation: report.user.reputation,
                            }),
                            slot: () => {},
                            value: (report) => report.user.fullname,
                            comp: ['user-preview', '@/components/User/UserPreview.vue'],
                            name: 'User signalé',
                        },
                        reason: {
                            attrs: (report) => ({ 'content': report.reason }),
                            slot: () => {},
                            value: (report) => report.reason,
                            comp: ['tip-tap-renderer', '@/components/TipTap/TipTapRenderer.vue'],
                            name: 'Raison',
                        },
                        contentId: {
                            attrs: (report) => ({ 'content': report.content.body }),
                            slot: () => {},
                            value: (report) => report.content.body,
                            comp: ['tip-tap-renderer', '@/components/TipTap/TipTapRenderer.vue'],
                            name: 'Contenu lié',
                        },
                        date: {
                            attrs: (report) => ({ dateString: report.createdAt }),
                            slot: (report) => report.createdAt,
                            value: (report) => report.createdAt,
                            comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                            name: 'Fait',
                        },
                    }, []],
                    posts: [{
                        votes: {
                            attrs: () => {},
                            slot: (thread) => thread.post.upvotes - thread.post.downvotes,
                            value: (thread) => thread.post.upvotes - thread.post.downvotes,
                            comp: ['div'],
                            name: 'Votes',
                        },
                        status: {
                            attrs: () => {},
                            slot: (thread) => thread.state,
                            value: (thread) => thread.state,
                            comp: ['div'],
                            name: 'État',
                        },
                        title: {
                            attrs: () => {},
                            slot: (thread) => thread.title,
                            value: (thread) => thread.title,
                            comp: ['div'],
                            name: 'Titre',
                        },
                        user: {
                            attrs: (thread) => ({
                                username: thread.post.author.fullname,
                                avatar: thread.post.author.avatar,
                                reputation: thread.post.author.reputation,
                            }),
                            slot: () => {},
                            value: (thread) => thread.post.author.fullname,
                            comp: ['user-preview', '@/components/User/UserPreview.vue'],
                            name: 'OP',
                        },
                        lastActivity: {
                            attrs: (thread) => ({ dateString: thread.post.contentLastUpdatedAt }),
                            slot: (thread) => thread.post.contentLastUpdatedAt,
                            value: () => '',
                            comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                            name: 'Dernière activité',
                        },
                        createdAt: {
                            attrs: (thread) => ({ dateString: thread.post.createdAt }),
                            slot: (thread) => thread.post.createdAt,
                            value: () => '',
                            comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                            sort: 0,
                            name: 'Date de création',
                        },
                        type: {
                            attrs: () => {},
                            slot: (thread) => postTypeEnum[thread.type][this.$i18n.locale],
                            value: () => '',
                            comp: ['div'],
                            name: 'Type',
                        },
                        // tags: {
                        //     attrs: (thread) => ({ tags: thread.tags }),
                        //     slot: () => {},
                        //     value: (thread) => thread.tags,
                        //     comp: ['tags-list', '@/components/List/TagsList.vue'],
                        //     name: 'Tags',
                        // },
                        actions: {
                            attrs: () => {},
                            slot: () => 'Show',
                            value: () => '',
                            comp: ['div'],
                            name: 'Actions',
                        },
                        // TODO: Actions
                    }, []],
                    utilisateurs: [{
                        user: {
                            attrs: (user) => ({
                                username: user.fullname,
                                avatar: user.avatar,
                                reputation: user.reputation,
                            }),
                            slot: () => {},
                            value: (user) => user.fullname,
                            comp: ['user-preview', '@/components/User/UserPreview.vue'],
                            name: 'Utilisateur',
                        },
                        email: {
                            attrs: () => {},
                            slot: (user) => user.email,
                            value: (user) => user.email,
                            comp: ['div'],
                            name: 'Email',
                        },
                        createdAt: {
                            attrs: (user) => ({ dateString: user.createdAt }),
                            slot: (user) => user.createdAt,
                            value: () => '',
                            comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                            sort: 0,
                            name: 'Créé',
                        },
                        lastUpdate: {
                            attrs: (user) => ({ dateString: user.updatedAt }),
                            slot: (user) => user.updatedAt,
                            value: () => '',
                            comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                            name: 'Dernière mise à jour',
                        },
                    }, []],
                },
            }
        },
        async mounted() {
            watch(() => this.$store.getters['threads/getThreadList'], (newThreads) => {
                this.tabColumns.posts[1] = newThreads
            })

            watch(() => this.$store.getters['users/getUserList'], (newUsers) => {
                this.tabColumns.utilisateurs[1] = newUsers
            })

            watch(() => this.$store.getters['reports/getReportList'], (newReports) => {
                this.tabColumns.reports[1] = newReports
            })

            this.$store.commit('threads/refreshThreadList')
            await this.$store.dispatch('threads/getThreadList')
            this.$store.commit('users/refreshUserList')
            await this.$store.dispatch('users/getUserList')
            this.$store.commit('reports/refreshReportList')
            await this.$store.dispatch('reports/getReportList')
        },
    }
</script>

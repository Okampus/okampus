<template>
    <!-- TODO: Solve unexpected overflow! -->
    <AppTabs v-model:tab="currentTab" :tabs="tabs" class="absolute top-32 w-full card" route-base="/admin">
        <template v-for="(tabColumns, i) in dashboardTabs" #[getSlot(i)] :key="i">
            <div :class="i === currentTab ? 'block' : 'invisible'">
                <DashboardCore :columns="tabColumns" :items="dashboardData[i]" />
            </div>
        </template>
    </AppTabs>
</template>

<script>
    import postTypeEnum from '@/shared/types/post-types.enum'
    import { ref, watch } from 'vue'
    import DashboardCore from '../../components/Dashboard/DashboardCore.vue'
    import AppTabs from '@/components/App/AppTabs.vue'

    const tabs = [
        {
            id: 'reports',
            name: 'Signalements',
            icon: 'flag',
        },
        {
            id: 'posts',
            name: 'Posts',
            icon: 'newspaper',
        },
        {
            id: 'users',
            name: 'Utilisateurs',
            icon: 'users',
        },
    ]
    export default {
        components: { DashboardCore, AppTabs },
        setup() {
            const dashboardData = ref([[], [], []])
            return { dashboardData }
        },
        data() {
            return {
                currentTab: tabs.findIndex((t) => t.id === this.$route.params.component),
                tabs,
                dashboardTabs: [
                    {
                        user: {
                            attrs: (report) => ({
                                username: report?.user?.fullname,
                                avatar: report?.user?.avatar,
                                reputation: report?.user?.reputation,
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
                    },
                    {
                        votes: {
                            attrs: () => {},
                            slot: (thread) => thread?.post?.upvotes - thread?.post?.downvotes,
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
                                username: thread?.post?.author?.fullname,
                                avatar: thread?.post?.author?.avatar,
                                reputation: thread?.post?.author?.reputation,
                            }),
                            slot: () => {},
                            value: (thread) => thread.post.author.fullname,
                            comp: ['user-preview', '@/components/User/UserPreview.vue'],
                            name: 'OP',
                        },
                        lastActivity: {
                            attrs: (thread) => ({ dateString: thread?.post?.contentLastUpdatedAt }),
                            slot: (thread) => thread.post.contentLastUpdatedAt,
                            value: () => '',
                            comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                            name: 'Dernière activité',
                        },
                        createdAt: {
                            attrs: (thread) => ({ dateString: thread?.post?.createdAt }),
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
                    },
                    {
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
                    },
                ],
            }
        },
        async mounted() {
            // TODO: Create admin specific store
            watch(
                () => this.$store.getters['reports/getReportList'],
                (newReports) => {
                    this.dashboardData[0].push(
                        ...newReports.filter((report) => !(report in this.dashboardData[0])),
                    )
                },
            )

            watch(
                () => this.$store.getters['threads/getThreads'],
                (newThreads) => {
                    this.dashboardData[1].push(
                        ...newThreads.filter((thread) => !(thread in this.dashboardData[1])),
                    )
                },
            )

            watch(
                () => this.$store.getters['profiles/getUsers'],
                (newUsers) => {
                    this.dashboardData[2].push(...newUsers.filter((user) => !(user in this.dashboardData[2])))
                },
            )

            this.$store.commit('threads/refreshThreads')
            await this.$store.dispatch('threads/getThreads')
            this.$store.commit('profiles/refreshUsers')
            await this.$store.dispatch('profiles/getUsers')
            this.$store.commit('reports/refreshReportList')
            await this.$store.dispatch('reports/getReportList')
        },
        methods: {
            getSlot(i) {
                return this.tabs[i].id
            },
        },
    }
</script>

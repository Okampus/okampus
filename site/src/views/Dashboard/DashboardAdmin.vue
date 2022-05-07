<template>
    <!-- TODO: Solve unexpected overflow! -->
    <CardPage>
        <AppTabs v-model:tab="currentTab" :tabs="tabs" route-base="/admin">
            <template v-for="(tabColumns, tabName, i) in dashboardTabs" #[tabName] :key="i">
                <div :class="tabs[currentTab].id === tabName ? 'block' : 'invisible'">
                    <DashboardCore :columns="tabColumns" :items="dashboardData[tabName]" />
                </div>
            </template>
        </AppTabs>
    </CardPage>
</template>

<script setup>
    import DashboardCore from '@/components/Dashboard/DashboardCore.vue'
    import AppTabs from '@/components/App/AppTabs.vue'
    import CardPage from '@/views/App/CardPage.vue'

    import threadTypes from '@/shared/types/thread-types.enum'

    import { computed } from 'vue'
    import { useThreadsStore } from '@/store/threads.store'
    import { useReportsStore } from '@/store/reports.store'
    import { useRoute } from 'vue-router'
    import { i18n } from '@/shared/modules/i18n'

    // TODO: router: redirect unknown tabs to 404
    // TODO: add tab for user (and tabs for other contents)
    const tabs = [
        {
            id: 'reports',
            name: 'Signalements',
            icon: 'flag',
        },
        {
            id: 'threads',
            name: 'Threads',
            icon: 'newspaper',
        },
        // {
        //     id: 'users',
        //     name: 'Utilisateurs',
        //     icon: 'users',
        // },
    ]

    const route = useRoute()
    const currentTab = computed({
        get: () => tabs.findIndex((t) => t.id === route.params.tab),
        set: (v) => v,
    })

    const dashboardTabs = {
        // users: {
        //     user: {
        //         attrs: (user) => ({
        //             user: user?.post?.author,
        //             imgSize: 2,
        //         }),
        //         slot: () => {},
        //         value: (user) => user.fullname,
        //         comp: ['user-preview', '@/components/App/Preview/UserPreview.vue'],
        //         name: 'Utilisateur',
        //     },
        //     email: {
        //         attrs: () => {},
        //         slot: (user) => user.email,
        //         value: (user) => user.email,
        //         comp: ['div'],
        //         name: 'Email',
        //     },
        //     createdAt: {
        //         attrs: (user) => ({ date: user.createdAt }),
        //         slot: (user) => user.createdAt,
        //         value: () => '',
        //         comp: ['date-preview', '@/components/App/Preview/DatePreview.vue'],
        //         sort: 0,
        //         name: 'Créé',
        //     },
        //     lastUpdate: {
        //         attrs: (user) => ({ date: user.updatedAt }),
        //         slot: (user) => user.updatedAt,
        //         value: () => '',
        //         comp: ['date-preview', '@/components/App/Preview/DatePreview.vue'],
        //         name: 'Dernière mise à jour',
        //     },
        // },
        threads: {
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
                    user: thread?.post?.author,
                    imgSize: 2.5,
                }),
                slot: () => {},
                value: (thread) => thread.post.author.fullname,
                comp: ['user-preview', '@/components/App/Preview/UserPreview.vue'],
                name: 'Auteur',
            },
            lastActivity: {
                attrs: (thread) => ({ date: thread?.post?.lastEdit?.createdAt }),
                slot: (thread) => thread.post.lastEdit.createdAt,
                value: () => '',
                comp: ['date-preview', '@/components/App/Preview/DatePreview.vue'],
                name: 'Dernière activité',
            },
            createdAt: {
                attrs: (thread) => ({ date: thread?.post?.createdAt }),
                slot: (thread) => thread.post.createdAt,
                value: () => '',
                comp: ['date-preview', '@/components/App/Preview/DatePreview.vue'],
                sort: 0,
                name: 'Date de création',
            },
            type: {
                attrs: () => {},
                slot: (thread) => threadTypes[thread.type][i18n.global.locale],
                value: () => '',
                comp: ['div'],
                name: 'Type',
            },
            // tags: {
            //     attrs: (thread) => ({ tags: thread.tags }),
            //     slot: () => {},
            //     value: (thread) => thread.tags,
            //     comp: ['tags-list', '@/components/List/TagList.vue'],
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
        reports: {
            user: {
                attrs: (report) => ({
                    user: report.user,
                    imgSize: 2.5,
                }),
                slot: () => {},
                value: (report) => report.user.fullname,
                comp: ['user-preview', '@/components/App/Preview/UserPreview.vue'],
                name: 'Utilisateur signalé',
            },
            reason: {
                attrs: (report) => ({ 'content': report.reason }),
                slot: () => {},
                value: (report) => report.reason,
                comp: ['md-renderer', '@/components/App/Editor/MdRenderer.vue'],
                name: 'Raison',
            },
            contentId: {
                attrs: (report) => ({ 'content': report?.content?.body }),
                slot: () => {},
                value: (report) => report.content.body,
                comp: ['md-renderer', '@/components/App/Editor/MdRenderer.vue'],
                name: 'Contenu lié',
            },
            date: {
                attrs: (report) => ({ date: report.createdAt }),
                slot: (report) => report.createdAt,
                value: (report) => report.createdAt,
                comp: ['date-preview', '@/components/App/Preview/DatePreview.vue'],
                name: 'Fait',
            },
        },
    }

    const threads = useThreadsStore()
    const reports = useReportsStore()

    const dashboardData = computed(() => ({
        reports: reports.reports,
        threads: threads.threads,
    }))

    // TODO: multipage support & query lazily
    threads.getThreads({ page: 1 })
    reports.getReports({ page: 1 })
</script>

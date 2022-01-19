<template>
    <!-- TODO: Solve unexpected overflow! -->
    <div>
        <div
            class="absolute py-12 hero h-52 w-full top-0 left-0"
        />
        <div class="relative mt-12 mb-10 mx-auto w-11/12 ">
            <div class="flex mx-auto space-x-2">
                <button
                    v-for="tab in Object.keys(tabColumns)"
                    :key="tab"
                    class="uppercase button w-full"
                    @click="currentTab = tab"
                >
                    <p>{{ tab }}</p>
                </button>
            </div>
            <template
                v-for="column in Object.keys(tabColumns)"
                :key="column"
            >
                <div :class="column === currentTab ? 'block' : 'hidden'">
                    <DashboardCore
                        :columns="tabColumns[column][0]"
                        :items="tabColumns[column][1]"
                    />
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="js">
import { users } from '@/fake/users'
import { posts } from '@/fake/posts'

import DashboardCore from './DashboardCore.vue'
export default {
    components: {
        DashboardCore
    },
    data () {
        return {
            currentTab: 'posts',
            tabColumns: {
                posts: [{
                    votes: { attrs: () => {},
                        slot: (post) => post.upvotes - post.downvotes,
                        value: (post) => post.upvotes - post.downvotes,
                        comp: ['div'],
                        name: 'Votes' },
                    status: { attrs: () => {},
                        slot: (post) => post.state,
                        value: (post) => post.state,
                        comp: ['div'],
                        name: 'État' },
                    title: { attrs: () => {},
                        slot: (post) => post.title,
                        value: (post) => post.title,
                        comp: ['div'],
                        name: 'Titre' },
                    user: { attrs: (post) => { return {username: post.author.username, avatar: post.author.avatar, reputation: post.author.reputation }},
                        slot: () => {},
                        value: (post) => post.author.username,
                        comp: ['user-preview', '@/components/User/UserPreview.vue'],
                        name: 'OP' },
                    lastActivity: { attrs: (post) => { return {dateString: post.contentLastUpdatedAt} },
                        slot: (post) => post.contentLastUpdatedAt,
                        value: () => "",
                        comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                        name: 'Dernière activité' },
                    createdAt: { attrs: (post) => { return {dateString: post.createdAt} },
                        slot: (post) => post.createdAt,
                        value: () => "",
                        comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                        sort: 0,
                        name: 'Date de création' },
                    type: { attrs: () => {},
                        slot: (post) => post.type,
                        value: () => "",
                        comp: ['div'],
                        name: 'Type' },
                    tags: { attrs: (post) => {return {tags: post.tags}},
                        slot: () => {},
                        value: (post) => post.tags,
                        comp: ['tags-list', '@/components/List/TagsList.vue'],
                        name: 'Tags' },
                    actions: { attrs: () => {},
                        slot: () => 'Show',
                        value: () => "",
                        comp: ['div'],
                        name: 'Actions' }
                    // TODO: Actions
                }, posts],
                utilisateurs: [{
                    user: { attrs: (user) => { return {username: user.username, avatar: user.avatar, reputation: user.reputation }},
                        slot: () => {},
                        value: (user) => user.username,
                        comp: ['user-preview', '@/components/User/UserPreview.vue'],
                        name: 'Utilisateur' },
                    email: { attrs: () => {},
                        slot: (user) => user.email,
                        value: (user) => user.email,
                        comp: ['div'],
                        name: 'Email' },
                    createdAt: { attrs: (user) => { return {dateString: user.createdAt} },
                        slot: (user) => user.createdAt,
                        value: () => "",
                        comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                        sort: 0,
                        name: 'Créé' },
                    lastUpdate: { attrs: (user) => { return {dateString: user.updatedAt} },
                        slot: (user) => user.updatedAt,
                        value: () => "",
                        comp: ['date-preview', '@/components/Dashboard/DatePreview.vue'],
                        name: 'Dernière mise à jour' },
                }, users]
            }
        }
    }
}
</script>

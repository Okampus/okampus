<template>
    <CardPage>
        <HorizontalTabs v-model:tab="currentTab" :tabs="tabs" route-base="/me">
            <template #profile>
                <SettingsModal />
            </template>
            <template #socials>
                <SettingsSocials />
            </template>
            <template #clubs>
                <SettingsClubs />
            </template>
        </HorizontalTabs>
    </CardPage>
</template>

<script setup>
    import CardPage from '@/views/App/CardPage.vue'
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'

    import SettingsClubs from '@/components/User/Settings/SettingsClubs.vue'
    import SettingsModal from '@/components/User/Settings/SettingsModal.vue'
    import SettingsSocials from '@/components/User/Settings/SettingsSocials.vue'

    import { useRoute } from 'vue-router'
    import { ref } from 'vue'

    const route = useRoute()
    const tabs = [
        {
            id: 'profile',
            name: 'Profil',
            icon: 'address-card',
        },
        {
            id: 'socials',
            name: 'Contacts',
            icon: 'mail-bulk',
        },
        {
            id: 'clubs',
            name: 'Mes associations',
            icon: 'user',
        },
    ]
    let currentTab = ref(tabs.findIndex((t) => t.id === route.params.tab))

    // const accounts = [
    //     {
    //         name: 'Mail',
    //         icon: 'envelope',
    //     },
    //     {
    //         name: 'LinkedIn',
    //         icon: ['fab', 'linkedin'],
    //     },
    //     {
    //         name: 'Discord',
    //         icon: ['fab', 'discord'],
    //     },
    //     {
    //         name: 'Instagram',
    //         icon: ['fab', 'instagram'],
    //     },
    //     {
    //         name: 'GitHub',
    //         icon: ['fab', 'github'],
    //     },
    // ]
</script>

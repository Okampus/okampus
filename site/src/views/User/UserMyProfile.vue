<template>
    <CardPage>
        <AppTabs v-model:tab="currentTab" :tabs="tabs" route-base="/me">
            <template #profile>
                <ProfileModal />
            </template>
            <template #socials>
                <ExternalAccount />
            </template>
            <template #clubs>
                <ProfileClubs />
            </template>
            <template #profile-settings>
                <ProfileSettings />
            </template>
        </AppTabs>
    </CardPage>
</template>

<script setup>
    import CardPage from '@/views/App/CardPage.vue'
    import AppTabs from '@/components/App/AppTabs.vue'
    import ProfileClubs from '@/components/User/MyProfile/ProfileClubs.vue'
    import ProfileModal from '@/components/User/MyProfile/ProfileModal.vue'
    import ProfileSettings from '@/components/User/MyProfile/ProfileSettings.vue'
    import ExternalAccount from '@/components/User/MyProfile/ProfileSocials.vue'
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
        {
            id: 'profile-settings',
            name: 'Accessibilité',
            icon: 'universal-access',
        },
    ]
    let currentTab = ref(tabs.findIndex((t) => t.id === route.params.component))

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

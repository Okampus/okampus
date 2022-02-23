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

<script>
    import AppTabs from '@/components/App/AppTabs.vue'
    import ProfileClubs from '@/components/User/MyProfile/ProfileClubs.vue'
    import ProfileModal from '@/components/User/MyProfile/ProfileModal.vue'
    import ProfileSettings from '@/components/User/MyProfile/ProfileSettings.vue'
    import ExternalAccount from '@/components/User/MyProfile/ProfileSocials.vue'
    import CardPage from '../App/CardPage.vue'

    const tabs = [
        {
            id: 'profile',
            name: 'Profil',
            icon: 'address-card',
        },
        {
            id: 'socials',
            name: 'Discord',
            icon: ['fab', 'discord'],
        },
        {
            id: 'clubs',
            name: 'Associations',
            icon: 'user',
        },
        {
            id: 'profile-settings',
            name: 'Accessibilité',
            icon: 'universal-access',
        },
    ]

    export default {
        components: {
            ProfileModal,
            ExternalAccount,
            ProfileSettings,
            AppTabs,
            ProfileClubs,
            CardPage,
        },
        inheritAttrs: false,
        data() {
            return {
                currentTab: tabs.findIndex((t) => t.id === this.$route.params.component),
                tabs,
                accounts: [
                    {
                        name: 'Mail',
                        icon: 'envelope',
                    },
                    {
                        name: 'LinkedIn',
                        icon: ['fab', 'linkedin'],
                    },
                    {
                        name: 'Discord',
                        icon: ['fab', 'discord'],
                    },
                    {
                        name: 'Instagram',
                        icon: ['fab', 'instagram'],
                    },
                    {
                        name: 'GitHub',
                        icon: ['fab', 'github'],
                    },
                ],
            }
        },
    }
</script>

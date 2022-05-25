<template>
    <div class="flex flex-col gap-6 m-10">
        <HorizontalTabs v-model="currentTab" :tabs="tabs" route-base="/me" route-name="me" />
        <div class="grow justify-center">
            <keep-alive>
                <component :is="currentComponent" />
            </keep-alive>
        </div>
    </div>
</template>

<script setup>
    import HorizontalTabs from '@/components/UI/Tabs/HorizontalTabs.vue'

    import AppSuspense from '../App/AppSuspense.vue'

    import SettingsAccount from '@/components/User/Settings/SettingsAccount.vue'
    import SettingsClubs from '@/components/User/Settings/SettingsClubs.vue'
    import SettingsSocials from '@/components/User/Settings/SettingsSocials.vue'

    import { computed, ref, h } from 'vue'

    const PROFILE = 'profile'
    const CLUBS = 'clubs'
    const SOCIALS = 'socials'

    const tabs = [
        {
            id: PROFILE,
            name: 'Profil',
            icon: 'address-card',
        },
        {
            id: CLUBS,
            name: 'Mes associations',
            icon: 'user',
        },
        {
            id: SOCIALS,
            name: 'Contacts',
            icon: 'mail-bulk',
        },
    ]

    const DEFAULT_TAB = tabs[0]

    const components = {
        [PROFILE]: h(AppSuspense, { key: PROFILE }, { default: () => h(SettingsAccount) }),
        [CLUBS]: h(AppSuspense, { key: CLUBS }, { default: () => h(SettingsClubs) }),
        [SOCIALS]: h(AppSuspense, { key: SOCIALS }, { default: () => h(SettingsSocials) }),
    }

    const currentTab = ref(null)
    const currentComponent = computed(() => components[currentTab.value ?? DEFAULT_TAB.id])

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

<template>
    <div class="m-0 text-2">
        <div class="absolute top-0 left-0 py-12 m-0 w-full h-52 hero">
            <h3 class="mb-8 text-4xl font-bold text-0">Paramètres</h3>
        </div>

        <AppTabs v-model:tab="tab" :tabs="tabs" class="absolute top-32 w-full card">
            <template #profile>
                <ProfileModal />
            </template>
            <template #socials>
                <ExternalAccount />
            </template>
            <template #clubs>
                <ProfileClubs />
            </template>
            <template #ProfileSettings>
                <ProfileSettings />
            </template>
        </AppTabs>

        <!-- <div class="min-h-20 relative mt-32 mb-10 text-0 md:w-9/12 sm:rounded-lg p-0 bg-1 w-full mx-auto">
            <div class="mt-2 flex-shrink-0">
                <ul class="py-2 flex">
                    <template
                        v-for="link of links"
                        :key="link"
                    >
                        <li
                            class="h-12 py-2 pl-8  w-full  bg-mouse-brand cursor-pointer hover:text-blue-500"
                            :class="currentComponent === link.component ? 'text-blue-500' : ''"
                        >
                            <router-link
                                class="flex gap-2 items-center"
                                :to="`/me/${link.component}`"
                                @click="currentComponent = link.component"
                            >
                                <font-awesome-icon
                                    :icon="link.icon"
                                />
                                <span class="hidden lg:block">{{ link.text }}</span>
                            </router-link>
                        </li>
                    </template>
                </ul>
            </div>

            <div class=" border-t-2 border-color-2-alt w-full">
                <component :is="currentComponent" />
            </div>
        </div> -->
    </div>
</template>

<script lang="js">
    import AppTabs from '@/components/App/AppTabs.vue'
    import ProfileClubs from '@/components/User/MyProfile/ProfileClubs.vue'
    import ProfileModal from '@/components/User/MyProfile/ProfileModal.vue'
    import ProfileSettings from '@/components/User/MyProfile/ProfileSettings.vue'
    import ExternalAccount from '@/components/User/MyProfile/ProfileSocials.vue'

    export default {
        components: {
            ProfileModal,
            ExternalAccount,
            ProfileSettings,
            AppTabs,
            ProfileClubs,
        },
        inheritAttrs: false,
        data () {
            return {
                currentComponent: this.$route.params.component,
                tab: 0,
                tabs: [
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
                        id: 'ProfileSettings',
                        name: 'Accessibilité',
                        icon: 'universal-access',
                    },
                ],
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
        created() {
            this.$store.dispatch('auth/redirectIfNotLoggedIn')
        },
    }
</script>

<template>
    <div class="m-0 text-2">
        <div class="m-0 absolute py-12 hero h-52 w-full top-0 left-0">
            <h3
                class="text-4xl font-bold mb-8 text-0"
                style="padding-left: 5%; padding-right: 5%"
            >
                Paramètres
            </h3>
        </div>

        <div class="min-h-20 relative mt-32 mb-10 text-0 md:w-9/12 sm:rounded-lg p-0 bg-1 w-full mx-auto">
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
                                :to="`/users/me/${link.component}`"
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
        </div>
    </div>
</template>

<script lang="js">
import Profile from '@/components/User/MyProfile/ProfileModal.vue'
import ExternalAccount from '@/components/User/MyProfile/ProfileSocials.vue'
import ProfileClub from '@/components/User/MyProfile/ProfileClubs.vue'
import Accessibility from '@/components/User/MyProfile/ProfileSettings.vue'
// import AppLoader from '@/components/App/AppLoader.vue'
export default {
    components: {
        Profile,
        ExternalAccount,
        ProfileClub,
        Accessibility
        // AppLoader
    },
    inheritAttrs: false,
    data () {
        return {
            currentComponent: this.$route.params.component,
            links: [
                { text: 'Profil', icon: 'address-card', component: 'Profile' },
                { text: 'Discord', icon: ['fab', 'discord'], component: 'Settings' },
                { text: 'Associations', icon: 'user', component: 'ProfileClub' },
                { text: 'Accessibilité', icon: 'universal-access', component: 'Accessibility' }
            ],
            accounts : [
                { name: 'Mail', icon: 'envelope'},
                { name: 'LinkedIn', icon: ['fab', 'linkedin']},
                { name: 'Discord', icon: ['fab', 'discord']},
                { name: 'Instagram', icon: ['fab', 'instagram']},
                { name: 'GitHub', icon: ['fab', 'github']},
            ]
        }
    }
}
</script>

<style lang="scss">

.height {
  min-height: 24rem;
}

</style>

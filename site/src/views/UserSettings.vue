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
        <div
            class="
        height
        relative
        mt-32
        mb-10
        text-0
        sm:shadow-md
        sm:rounded-lg
        p-0
        bg-1
        w-full
        sm:w-11/12
        mx-auto
        sm:flex
      "
        >
            <div class="mt-2 flex-shrink-0">
                <ul class="py-2 flex sm:block">
                    <template
                        v-for="link of links"
                        :key="link"
                    >
                        <li
                            class="
                h-12
                py-2
                pl-8
                sm:pr-20
                flex
                w-full
                space-x-2
                items-center
                bg-mouse-brand
                cursor-pointer
              "
                            :class="{ active: currentComponent === link.component }"
                            @click="currentComponent = link.component"
                        >
                            <i
                                class="ri-xl"
                                :class="link.icon"
                            />
                            <span class="hidden lg:block">{{ link.text }}</span>
                        </li>
                    </template>
                </ul>
            </div>

            <div class="sm:border-l-2 sm:border-0 border-t-2 border-footer w-full">
                <component :is="currentComponent" />
            </div>
        </div>
    </div>
</template>

<script lang="js">
import Profile from '@/components/Settings/UserProfile.vue'
import BadgeSettings from '@/components/Settings/BadgeSettings.vue'
import ExternalAccount from '@/components/Settings/ExternalAccount.vue'
import AssociationSettings from '@/components/Settings/AssociationSettings.vue'
import AccessibilitySettings from '@/components/Settings/AccessibilitySettings.vue'
export default {
    components: {
        Profile,
        BadgeSettings,
        ExternalAccount,
        AssociationSettings
    },
    inheritAttrs: false,
    data () {
        return {
            currentComponent: 'Profile',
            links: [
                { text: 'Profil', icon: 'ri-profile-line', component: 'Profile' },
                { text: 'Intégration Discord', icon: 'ri-discord-fill', component: 'Discord' },
                { text: 'Badges', icon: 'ri-medal-line', component: BadgeSettings },
                { text: 'Compte lié', icon: 'ri-links-line', component: ExternalAccount },
                { text: 'Assos', icon: 'ri-team-fill', component: AssociationSettings },
                { text: 'Accessibilité', icon: 'ri-hand-heart-fill', component: AccessibilitySettings }
                // TODO: { text: "Rôles Ef'Réussite", icon: 'ri-book-mark-line', component: 'Roles' }
            ],
            accounts : [
                { name:'Mail', icon: 'ri-mail-line'},
                { name:'LinkedIn', icon: 'ri-linkedin-fill'},
                { name:'Discord', icon: 'ri-discord-fill'},
                { name:'Instagram', icon: 'ri-instagram-fill'},
                { name:'GitHub', icon: 'ri-github-fill'},
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

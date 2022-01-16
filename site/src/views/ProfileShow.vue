<template>
    <div v-if="user === undefined || user === null">
        Impossible de charger l'utilisateur
    </div>
    <div v-else>
        <div
            class="mx-auto pb-6 text-1"
        >
            <div
                class="card rounded-b-none p-0 pb-6"
            >
                <div class="relative h-48 w-full">
                    <div class="banner w-full h-full" />
                    <!-- <div class="flex absolute top-0 bg-gray-500 opacity-50 rounded items-center justify-center w-full h-full">
                    Changer votre banniere
                  </div> -->
                    <img
                        :src="user.avatar ? user.avatar : default_avatar"
                        class="absolute left-10 -bottom-1/4 h-32 w-32 rounded-full"
                    >
                </div>
                <div class="mt-20 px-4 w-full">
                    <div class="flex flex-col pr-8 space-y-4 mb-4 ">
                        <div>
                            <div>
                                <div class="inline-block text-2xl">
                                    {{ user.username }} {{ user.username.toUpperCase() }}
                                </div>
                                <div class="text-gray-500 inline-block ml-2 mb-4">
                                    {{ 'M2-F' }}
                                </div>
                            </div>
                            <div>{{ user.description }}</div>
                        </div>
                        <div v-if="userClubs != 0">
                            <div class="text-lg">
                                Associations
                            </div>
                            <div
                                v-for="club in userClubs"
                                :key="club"
                                class="flex mt-2"
                            >
                                <p>
                                    <img
                                        :src="club.icon ? club.icon : default_avatar"
                                        alt="#"
                                        class="h-16 w-16"
                                    >
                                </p>
                                <div class="ml-2">
                                    <div class="text-lg font-bold">
                                        {{ clubs.filter(a => a.clubId === club.club.clubId)[0].name }}
                                    </div>
                                    {{ club.role }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md:flex">
            <div class=" md:w-1/2 lg:w-2/3 mt-0 m-4 space-y-4">
                <div class="flex flex-col card flex-grow space-y-4">
                    <div class="text-xl">
                        Activité
                    </div>
                    <post-card
                        v-for="activity in activitys"
                        :key="activity.index"
                        :post="activity"
                    />
                </div>
            </div>
            <div class="flex flex-col space-y-4 md:w-1/2 lg:w-1/3">
                <div
                    v-if="connected.userId == user.userId"
                    class="card"
                >
                    <a href="#/settings">Modifier le Profil</a>
                </div>
                <div class="card">
                    Badges
                    <div class="flex mt-2 space-x-1">
                        <i class="ri-medal-line ri-xl" />
                        <i class="ri-medal-line ri-xl" />
                        <i class="ri-medal-line ri-xl" />
                        <i class="ri-medal-line ri-xl" />
                    </div>
                </div>
                <div class="card">
                    Comptes
                    <div class="flex flex-col space-y-2 mt-2">
                        <div
                            v-if="user.email"
                            class="flex space-x-2"
                        >
                            <i class="ri-mail-fill ri-md" />
                            <div>{{ user.email }}</div>
                        </div>
                        <div v-if="socialsAccounts === undefined || socialsAccounts === null">
                            Problème dans les comptes des réseaux sociaux
                        </div>
                        <div
                            v-for="social in socialsAccounts"
                            v-else
                            :key="social"
                        >
                            <div class="flex space-x-2">
                                <i
                                    class="ri-md"
                                    :class=" socials.filter(a=> a.socialId === social.social.socialId)[0].icon"
                                />
                                <a :href="social.link">{{ social.pseudo }}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { posts } from '@/fake/posts'
import PostCard from '../components/Card/PostCard.vue'
import default_avatar from '@/assets/img/default_avatars/user.png'

export default {
    components: {
        PostCard
    },
    data () {
        return {
            activitys: posts,
            default_avatar : default_avatar
        }
    },
    computed: {
        user() {
            console.log(this.$store.state.users.user)
            return this.$store.state.users.user
        },
        connected() {
            return this.$store.state.auth.user
        },
        socialsAccounts() {
            return this.$store.state.users.socialsAccounts
        },
        socials() {
            return this.$store.state.users.socials
        },
        clubs() {
            console.log("clubsmounted",this.$store.state.users.clubs)
            return this.$store.state.users.clubs
        },
        userClubs() {
            console.log(this.$store.state.users.userClubs)
            return this.$store.state.users.userClubs
        }
    },
    mounted(){
        const userId = this.$route.params.userId
        this.$store.dispatch('users/getUserById',userId )
        this.$store.dispatch('users/getUserClubs', userId)
        this.$store.dispatch('users/getUserSocials',userId)
        this.$store.dispatch('users/getSocials')
        this.$store.dispatch('users/getClubs')
    }

}
</script>

<style lang="scss">
.banner {
  background-color: #771250;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='96' viewBox='0 0 60 96'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2335313c' fill-opacity='0.44'%3E%3Cpath d='M36 10a6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-12 0 6 6 0 0 0-6-6 6 6 0 0 1-6-6V10a6 6 0 1 1 12 0 6 6 0 0 0 12 0zm24 78a6 6 0 0 1-6-6 6 6 0 0 0-6-6 6 6 0 0 1-6-6V58a6 6 0 1 1 12 0 6 6 0 0 0 6 6v24zM0 88V64a6 6 0 0 0 6-6 6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-6 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>

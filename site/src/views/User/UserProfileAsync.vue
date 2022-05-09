<template>
    <div>
        <div class="pb-2 mx-auto text-1">
            <div class="p-0 pb-6 rounded-b-none card">
                <div class="relative w-full h-48">
                    <div class="w-full h-full banner" />
                    <div class="absolute -bottom-8 left-8">
                        <UserAvatar
                            :img-src="user.avatar"
                            size="4.5"
                            :username="user.firstname + ' ' + user.lastname"
                        />
                    </div>
                </div>
                <div class="px-4 mt-8 w-full">
                    <div class="flex flex-col pr-8 mb-4 space-y-4">
                        <div>
                            <div class="flex">
                                <div class="text-2xl">{{ user.firstname }} {{ user.lastname }}</div>
                                <div class="my-auto ml-2 text-gray-500">
                                    {{ 'M2-F' }}
                                </div>
                                <router-link
                                    v-if="me.userId === user.userId"
                                    to="/me/profile"
                                    class="my-auto ml-8"
                                >
                                    <div
                                        class="flex items-center py-1.5 px-2 hover:bg-3-light hover:dark:bg-3-dark rounded"
                                    >
                                        <i class="fas fa-pen-alt" />
                                    </div>
                                </router-link>
                            </div>
                            <div>{{ user.description }}</div>
                        </div>
                        <div v-if="clubs != 0">
                            <div class="text-lg">Associations</div>
                            <div class="flex flex-wrap mt-2">
                                <div v-for="club in clubs.items" :key="club" class="flex mr-4 mb-4 h-16">
                                    <p class="my-auto">
                                        <UserAvatar
                                            :img-src="club.team.avatar"
                                            :alt="`${club.team.name} Logo`"
                                            :username="club.team.name"
                                            size="4"
                                            class="rounded-full shadow-inner"
                                        ></UserAvatar>
                                    </p>
                                    <div class="my-auto ml-2 w-32">
                                        <div class="-mb-1 text-lg font-bold truncate last:text-clip">
                                            {{ club.team.name }}
                                        </div>
                                        <div class="-mb-1">
                                            <!-- {{ Object.keys(roles).find((role) => roles[role] === club.role) }} -->
                                            {{ club.role }}
                                        </div>
                                        <div class="text-sm truncate text-5">
                                            {{ club.roleLabel }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row">
            <div class="order-2 mt-0 mb-4 space-y-4 md:order-1 md:mr-4 md:ml-2 md:w-1/2 lg:w-2/3">
                <div class="flex flex-col grow space-y-4 card">
                    <div class="text-xl">Activité</div>
                    <div v-if="activities">
                        <ThreadPreviewCard
                            v-for="activity in activities"
                            :key="activity.index"
                            :post="activity"
                        />
                    </div>
                    <div v-else class="">Pas d'activité pour cet utilisateur</div>
                </div>
            </div>
            <div class="flex flex-col order-1 mb-4 space-y-2 md:order-2 md:w-1/2 lg:w-1/3">
                <div class="card">
                    Comptes
                    <div class="flex flex-col mt-2 space-y-2">
                        <div v-if="user.email" class="flex space-x-2">
                            <i class="fas fa-enveloppe" />
                            <div>{{ user.email }}</div>
                        </div>
                        <div v-if="contacts === undefined || contacts === null">
                            Problème dans les comptes des réseaux sociaux
                        </div>
                        <div v-for="contact in contacts" v-else :key="contact">
                            <div class="flex space-x-2">
                                <i class="fas" :class="`fa-${contact.contact.icon}`" />
                                <a :href="contact.link">{{ contact.pseudo }}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // import ThreadPreviewCard from '@/components/App/Card/ThreadPreviewCard.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import { useRoute } from 'vue-router'
    import { watch, ref, nextTick } from 'vue'
    import { useProfilesStore } from '@/store/profile.store'
    import { emitter } from '@/shared/modules/emitter'
    import { getStatus } from '@/utils/errors'
    import { useAuthStore } from '@/store/auth.store'

    const route = useRoute()
    const profiles = useProfilesStore()
    const auth = useAuthStore()
    const user = ref(null)
    const contacts = ref(null)
    const clubs = ref(null)
    const me = ref(null)

    const loadProfile = async () => {
        if (route.name === 'profile') {
            const userId = route.params.userId
            await profiles
                .getUser(userId)
                .then((res) => {
                    user.value = res
                    nextTick(() => {
                        if (route.hash) {
                            emitter.emit('scroll-to-anchor', route.hash)
                        }
                    })
                })
                .catch((err) => {
                    emitter.emit('error-route', { code: getStatus(err.response) })
                })
        }
    }

    const loadContacts = async () => {
        if (route.name === 'profile') {
            const userId = route.params.userId
            await profiles
                .getContacts(userId)
                .then((res) => {
                    contacts.value = res
                    nextTick(() => {
                        if (route.hash) {
                            emitter.emit('scroll-to-anchor', route.hash)
                        }
                    })
                })
                .catch((err) => {
                    emitter.emit('error-route', { code: getStatus(err.response) })
                })
        }
    }

    const loadClubs = async () => {
        if (route.name === 'profile') {
            const userId = route.params.userId
            await profiles
                .getClubs(userId)
                .then((res) => {
                    clubs.value = res
                    nextTick(() => {
                        if (route.hash) {
                            emitter.emit('scroll-to-anchor', route.hash)
                        }
                    })
                })
                .catch((err) => {
                    emitter.emit('error-route', { code: getStatus(err.response) })
                })
        }
    }

    const loadMe = async () => {
        await auth
            .getMe()
            .then((res) => {
                me.value = res
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    // const roles = {
    //     'Président': 'president',
    //     'Vice-Président': 'vice-president',
    //     'Secretaire': 'secretary',
    //     'Trésorier': 'treasurer',
    //     'Manager': 'manager',
    //     'Membre': 'member',
    // }

    await loadProfile()
    await loadContacts()
    await loadClubs()
    await loadMe()
    // await loadContacts()
    watch(() => route.params.userId, loadProfile)
</script>

<style lang="scss">
    .banner {
        background-color: #771250;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='96' viewBox='0 0 60 96'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2335313c' fill-opacity='0.44'%3E%3Cpath d='M36 10a6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-12 0 6 6 0 0 0-6-6 6 6 0 0 1-6-6V10a6 6 0 1 1 12 0 6 6 0 0 0 12 0zm24 78a6 6 0 0 1-6-6 6 6 0 0 0-6-6 6 6 0 0 1-6-6V58a6 6 0 1 1 12 0 6 6 0 0 0 6 6v24zM0 88V64a6 6 0 0 0 6-6 6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-6 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
</style>

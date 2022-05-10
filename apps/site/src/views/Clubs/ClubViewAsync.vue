<template>
    <div>
        <div class="p-0 pb-2 mx-auto rounded-b-none text-1 card">
            <div class="">
                <div class="relative w-full h-48">
                    <div class="w-full h-full bg-blue-200" />
                    <div class="absolute -bottom-8 left-8">
                        <UserAvatar :img-src="club.avatar" size="4.5" :username="club.name" />
                    </div>
                </div>
                <div class="px-4 pb-6 mt-8 w-full shadow-lg">
                    <div class="flex flex-col pr-8 mb-4 space-y-4">
                        <div>
                            <div class="flex">
                                <div class="text-2xl font-bold">{{ club.name }}</div>
                                <div class="my-auto ml-2 text-gray-500">
                                    {{ club.category }}
                                </div>
                                <div class="my-auto ml-2 text-gray-500">
                                    {{ club.members.length }}
                                    <i class="fas fa-users"> </i>
                                </div>
                            </div>
                            <div>{{ club.description }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-4">
                <h1 class="mt-4 mb-2 text-xl">Le Bureau</h1>
                <div class="flex gap-4">
                    <div
                        class="flex flex-col flex-wrap justify-between items-center p-4 mb-4 w-48 h-48 rounded-lg shadow-md bg-2"
                    >
                        <UserAvatar
                            :img-src="club.members.find((member) => member.role === 'owner').avatar"
                            size="6"
                            :username="
                                club.members.find((member) => member.role === 'owner').user.firstname +
                                ' ' +
                                club.members.find((member) => member.role === 'owner').user.lastname
                            "
                        />
                        <div class="text-center">
                            <p class="leading-none line-clamp-2">
                                {{
                                    club.members.find((member) => member.role === 'owner').user.firstname +
                                    ' ' +
                                    club.members.find((member) => member.role === 'owner').user.lastname
                                }}
                            </p>
                            <p class="text-gray-400">Président</p>
                        </div>
                    </div>
                </div>
                <h1 class="mt-4 mb-2 text-xl">Les dernières activités</h1>
                <div class="flex gap-4">
                    <!-- <div
                        class="flex flex-col flex-wrap justify-between items-center p-4 mb-4 w-48 h-48 rounded-lg shadow-md bg-2"
                    >
                        <UserAvatar
                            :img-src="club.members.find((member) => member.role === 'owner').avatar"
                            size="6"
                            :username="
                                club.members.find((member) => member.role === 'owner').user.firstname +
                                ' ' +
                                club.members.find((member) => member.role === 'owner').user.lastname
                            "
                        />
                        <div class="text-center">
                            <p class="leading-none line-clamp-2">
                                {{
                                    club.members.find((member) => member.role === 'owner').user.firstname +
                                    ' ' +
                                    club.members.find((member) => member.role === 'owner').user.lastname
                                }}
                            </p>
                            <p class="text-gray-400">Président</p>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>

        <!-- <div class="flex flex-col md:flex-row">
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
        </div> -->
    </div>
</template>

<script setup>
    // import ThreadPreviewCard from '@/components/App/Card/ThreadPreviewCard.vue'
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import { useRoute } from 'vue-router'
    import { ref, nextTick } from 'vue'
    import { useClubsStore } from '@/store/clubs.store'
    import { emitter } from '@/shared/modules/emitter'
    import { getStatus } from '@/utils/errors'

    const route = useRoute()
    const clubStore = useClubsStore()
    const club = ref(null)

    const loadClub = async () => {
        const clubId = route.params.clubId
        await clubStore
            .getClub(clubId)
            .then((res) => {
                club.value = res
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

    // const loadMe = async () => {
    //     await auth
    //         .getMe()
    //         .then((res) => {
    //             me.value = res
    //         })
    //         .catch((err) => {
    //             emitter.emit('error-route', { code: getStatus(err.response) })
    //         })
    // }

    // const roles = {
    //     'Président': 'president',
    //     'Vice-Président': 'vice-president',
    //     'Secretaire': 'secretary',
    //     'Trésorier': 'treasurer',
    //     'Manager': 'manager',
    //     'Membre': 'member',
    // }

    await loadClub()
    // await loadContacts()
    // watch(() => route.params.clubId, loadClub)
</script>

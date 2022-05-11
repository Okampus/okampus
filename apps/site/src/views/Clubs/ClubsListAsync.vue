<template>
    <AppView>
        <div>
            <h3 class="pl-10 mb-8 text-4xl font-bold text-0">Liste des associations</h3>
            <!-- grid 3 columns for each clubs centered-->
<<<<<<< HEAD
            <div class="flex flex-wrap gap-8 justify-center w-full">
=======
            <div class="grid grid-cols-1 gap-y-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
>>>>>>> Advance in Club Settings
                <!-- <ClubCard v-for="club in clubs" :key="club.id" :club="club" /> -->
                <div v-for="club in clubList.items" :key="club.teamId">
                    <div
                        class="flex flex-col justify-between items-center pb-4 w-[22em] text-black rounded-lg shadow-xl bg-1"
                    >
                        <div class="flex flex-col items-center w-full">
                            <div class="w-full h-24 bg-blue-200 rounded-t-lg"></div>
                            <div class="p-1 -mt-8 rounded-full bg-1">
                                <UserAvatar :img-src="club.avatar" size="4.5" :username="club.name" />
                            </div>
                            <h3 class="text-lg font-bold truncate text-1">
                                {{ club.name }}
                            </h3>
                            <p class="text-gray-400 text-md">Entraide</p>
                        </div>
                        <div
                            class="grid grid-cols-3 gap-4 justify-items-center items-center px-4 pt-2 mt-6 w-full border-t-2 border-gray-400 text-1"
                        >
                            <div class="flex gap-2 items-center">
                                {{ club.memberCount }}
                                <i class="fas fa-users"></i>
                            </div>
                            <!-- <a
                                class="p-2 w-44 text-base text-center text-white bg-blue-500 rounded-md"
                                :href="'#/clubs/' + club.teamId"
                            >
                                Plus d'informations
                            </a> -->
                            <button
                                class="p-2 w-fit text-base text-center text-white bg-green-500 rounded-md"
                                @click="() => joinClub(club.teamId)"
                            >
                                Rejoindre
                            </button>
                            <a :href="'#/clubs/' + club.teamId">Plus d'info</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showPopUp">
            <JoinPopUp v-model="showPopUp" :show="showPopUp" :request="joinRequest" @close="closePopUp" />
        </div>
        <AppToast
            v-model:active="showReport"
            message="Vous avez déjà émis une requête pour rejoindre cette association."
            type="error"
        >
        </AppToast>
    </AppView>
</template>

<script setup>
    import AppView from '@/views/App/AppView.vue'
    import { useClubsStore } from '@/store/clubs.store'
    import { ref } from 'vue'
    import { emitter } from '@/shared/modules/emitter'
    import { getStatus } from '@/utils/errors'
    import UserAvatar from '@/components/User/UserAvatar.vue'
    import JoinPopUp from '@/components/Clubs/JoinPopUp.vue'
    import { useAuthStore } from '@/store/auth.store'
    import AppToast from '@/components/App/AppToast.vue'

    const clubs = useClubsStore()
    const clubList = ref([])
    const showPopUp = ref(false)
    const auth = useAuthStore()
    const me = ref(null)
    const joinRequest = ref(null)
    const showReport = ref(false)
    //load clubs
    const loadClubList = async () => {
        await clubs
            .getClubs()
            .then((res) => {
                clubList.value = res
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
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

    const joinClub = async (teamId) => {
        await clubs
            .postMembershipRequest(teamId)
            .then((res) => {
                joinRequest.value = res
                showPopUp.value = true
            })
            .catch(() => {
                showReport.value = true
            })
    }

    const closePopUp = () => {
        showPopUp.value = false
    }

    await loadClubList()
    await loadMe()
</script>

<!-- <style lang="scss"></style> -->

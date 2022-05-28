<template>
    <div class="flex flex-col">
        <!-- <p class="text-lg">V1</p>
        <div class="flex p-4 w-full h-40 rounded-lg shadow-md bg-2">
            <div class="flex flex-col justify-center items-center mr-4">
                <i class="text-[7rem] text-gray-500 fas fa-calendar-days"></i>
            </div>
            <div class="flex flex-col w-full h-full">
                <div class="flex gap-8 items-center p-2 mb-4 w-full h-12 bg-gray-300 rounded-md">
                    <div class="flex gap-2 items-center">
                        <i class="text-xl fas fa-calendar"></i>
                        <p>16/04/2022</p>
                    </div>
                    <div class="flex gap-2 items-center">
                        <i class="text-xl fas fa-location-dot"></i>
                        <p>Campus République</p>
                    </div>
                    <div class="flex gap-2 items-center">
                        <i class="text-xl fas fa-clock-rotate-left"></i>
                        <p>2h30</p>
                    </div>
                </div>
                <div class="flex justify-between w-full h-full">
                    <div class="flex flex-col h-full">
                        <h3 class="text-2xl font-bold">Rézal</h3>
                        <p>Lan Multijoueur au campus république</p>
                    </div>
                    <div class="flex flex-col mr-16">
                        <button class="py-2 px-4 mt-2 font-bold text-white bg-blue-500 rounded-full">
                            Plus d'informations
                        </button>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- <ProfileAvatar :name="props.event.team.name"></ProfileAvatar> -->
        <div class="flex flex-col gap-2">
            <div class="flex flex-col w-[26rem] h-80 rounded-lg bg-2">
                <p class="pt-4">
                    <span class="font-bold">{{ props.event.team.name }}</span> organise un évenement
                </p>
                <div class="flex gap-8 items-center p-2 w-full h-12 rounded-t-lg bg-2">
                    <div class="flex gap-2 items-center">
                        <i class="text-xl fas fa-calendar"></i>
                        <div>
                            Du
                            <span class="font-bold">
                                {{
                                    new Date(props.event.start).toLocaleDateString() +
                                    ' ' +
                                    new Date(props.event.start).toISOString().substr(11, 5)
                                }}
                            </span>
                            au
                            <span class="font-bold"
                                >{{
                                    new Date(props.event.end).toLocaleDateString() +
                                    ' ' +
                                    new Date(props.event.end).toISOString().substr(11, 5)
                                }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="w-full h-24 bg-blue-400"></div>
                <div class="flex gap-2 justify-end items-center py-1 px-2 -mt-4 ml-4 w-fit rounded-full bg-1">
                    <i class="text-md fas fa-location-dot"></i>
                    <p class="text-sm">{{ props.event.place }}</p>
                </div>
                <div class="p-4">
                    <div class="flex flex-col">
                        <h3 class="text-2xl font-bold">{{ props.event.shortDescription }}</h3>
                        <p>{{ props.event.longDescription }}</p>
                    </div>
                    <div class="flex gap-2 mt-4 w-full">
                        <button class="py-2 px-4 mt-2 w-1/2 font-bold text-white bg-blue-500 rounded-full">
                            Plus d'informations
                        </button>
                        <button
                            class="py-2 px-4 mt-2 w-1/2 font-bold text-white bg-green-500 rounded-full"
                            @click="joinEvent"
                        >
                            S'inscrire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useClubsStore } from '@/store/clubs.store'
    import ProfileAvatar from '../Profile/ProfileAvatar.vue'
    import { emitter } from '@/shared/modules/emitter'

    const props = defineProps({
        event: {
            type: Object,
            required: true,
        },
    })

    const clubs = useClubsStore()

    const joinEvent = async () => {
        await clubs
            .joinEvent(props.event.teamEventId)
            .then(() =>
                emitter.emit('show-toast', {
                    message: "Vous avez bien rejoint l'évenement.",
                    type: 'success',
                }),
            )
            .catch(
                emitter.emit('show-toast', {
                    message: "Erreur lors de l'opération",
                    type: 'failure',
                }),
            )
    }
</script>

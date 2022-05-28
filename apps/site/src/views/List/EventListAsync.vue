<template>
    <div class="p-4 text-0">
        <h1 class="text-4xl font-bold">Evenements recents</h1>
        <div class="flex gap-2 items-center mt-8 h-fit">
            <button class="w-16 h-80 bg-blue-500 rounded-l-lg" @click="scrollLeft">
                <i class="text-2xl font-bold text-white fas fa-chevron-left"></i>
            </button>
            <div
                ref="carousselContainer"
                class="flex overflow-x-hidden flex-row flex-nowrap gap-2 items-center scroll-smooth"
            >
                <div v-for="event in events" :key="event">
                    <ClubEventCard :event="event"></ClubEventCard>
                </div>
            </div>
            <button class="w-16 h-80 bg-blue-500 rounded-r-lg" @click="scrollRight">
                <i class="text-2xl font-bold text-white fas fa-chevron-right"></i>
            </button>
        </div>
        <h1 class="mt-16 text-4xl font-bold">Liste des Evenements</h1>
        <div class="flex flex-row flex-wrap gap-4 justify-center items-center mt-8">
            <div v-for="event in events" :key="event">
                <ClubEventCard :event="event"></ClubEventCard>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useClubsStore } from '@/store/clubs.store'
    import { onMounted, ref } from 'vue'
    import ClubEventCard from '@/components/Club/ClubEventCard.vue'

    const carousselContainer = ref(null)

    onMounted(() => {
        carousselContainer.value.focus()
    })

    const clubs = useClubsStore()
    const events = ref([])

    const scrollLeft = () => {
        carousselContainer.value.scrollLeft -= 200
    }
    const scrollRight = () => {
        carousselContainer.value.scrollLeft += 200
    }

    const loadEvents = async () => {
        await clubs
            .getEvents()
            .then((res) => (events.value = res.items))
            .catch((err) => console.error(err))
    }

    await loadEvents()
</script>

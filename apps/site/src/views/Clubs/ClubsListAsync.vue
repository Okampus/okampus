<template>
    <div class="flex gap-2 my-6 mx-4 max-w-6xl md:gap-6 xl:mx-auto">
        <VerticalTabs
            v-model="currentTab"
            :tabs="tabs"
            base-route="/clubs"
            route-name="search-clubs"
            class="sticky top-6"
        />
        <div v-if="currentClubs.length === 0" class="w-full text-center text-0">
            <EmojiSad class="mb-3 text-3xl" />
            <div class="text-2xl font-bold">Aucune association ne correspond à ces critères.</div>
            <div class="text-lg">
                Regardez la
                <router-link to="/clubs" class="link-blue">liste de tous les associations</router-link>.
            </div>
        </div>
        <div v-else class="flex flex-wrap gap-6 w-fit h-fit">
            <ClubCard v-for="club in currentClubs" :key="club.teamId" :club="club" />
        </div>
    </div>
</template>

<script setup>
    import VerticalTabs from '@/components/UI/Tabs/VerticalTabs.vue'
    import ClubCard from '@/components/App/ListCard/ClubCard.vue'
    import EmojiSad from '@/icons/Emoji/EmojiSad.vue'

    import { clubTypes, linkToClubType } from '@/shared/types/club-types.enum'

    import { computed, ref } from 'vue'
    import { emitter } from '@/shared/modules/emitter'
    import { getStatus } from '@/utils/errors'

    import { useClubsStore } from '@/store/clubs.store'
    import { groupBy } from 'lodash'

    const clubs = useClubsStore()
    const currentTab = ref(null)
    const tabs = [
        {
            id: 'all',
            title: 'Les assos',
            tabs: [
                {
                    id: 'all',
                    route: '/clubs',
                    name: 'Toutes les assos',
                },
                {
                    id: 'my-clubs',
                    name: 'Mes associations',
                },
            ],
        },
        {
            id: 'categories',
            title: 'Catégories',
            tabs: [],
        },
    ]

    const ALL = 0
    const CATEGORIES = 1

    const clubList = ref([])
    const clubListByCategory = ref({})
    const categories = ref([])

    const currentClubs = computed(() =>
        currentTab.value === 'all'
            ? clubList.value
            : categories.value.includes(linkToClubType[currentTab.value])
            ? clubListByCategory.value[linkToClubType[currentTab.value]]
            : [],
    )

    // const showPopUp = ref(false)
    // const joinRequest = ref(null)
    // const showReport = ref(false)
    // load clubs

    const loadClubList = async () => {
        await clubs
            .getClubs()
            .then((res) => {
                clubList.value = res
                clubListByCategory.value = groupBy(res, 'category')

                tabs[ALL].tabs[ALL].amount = res.length

                categories.value = Object.keys(clubListByCategory.value)
                tabs[CATEGORIES].tabs = Object.entries(clubListByCategory.value).map((category) => ({
                    id: clubTypes[category[0]].link,
                    name: category[0],
                    amount: category[1].length,
                }))
            })
            .catch((err) => {
                emitter.emit('error-route', { code: getStatus(err.response) })
            })
    }

    await loadClubList()
</script>

<template>
    <div class="flex flex-col gap-4 my-8 mx-auto w-23/24">
        <div class="grid grid-cols-4 gap-4 w-full text-center">
            <div
                v-for="(n, i) in [
                    {
                        text: `associations`,
                        color: 'blue',
                        icon: 'fa-people-group',
                        val: 52,
                        change: 10,
                    },
                    {
                        text: `% d'insertion`,
                        color: 'sky',
                        icon: 'fa-arrows-down-to-people',
                        val: 82,
                        change: 9.3,
                    },
                    {
                        text: `nb evenement`,
                        color: 'emerald',
                        icon: 'fa-calendar-day',
                        val: 56,
                        change: -10.9,
                    },
                    {
                        text: 'utilisateurs',
                        color: 'indigo',
                        icon: 'fa-user',
                        val: 5983,
                        change: -5.4,
                    },
                ]"
                :key="i"
                class="flex justify-around items-center card"
            >
                <div
                    class="flex grow-0 shrink-0 p-3 rounded-full"
                    :class="`bg-${n.color}-300 text-${n.color}-600`"
                >
                    <i class="fa-solid" :class="n.icon"></i>
                </div>
                <div class="flex flex-col justify-center">
                    <div class="flex relative gap-2 justify-center items-center">
                        <div class="text-2xl">{{ n.val }}</div>
                        <div
                            class="p-0.5 text-xs rounded-full"
                            :class="[
                                n.change >= 0 ? 'text-green-400 bg-green-200' : 'text-red-400 bg-red-200',
                            ]"
                        >
                            {{ n.change >= 0 ? '+' : '' }}{{ n.change }} %
                        </div>
                    </div>
                    <div class="text-xs text-gray-400 uppercase">{{ n.text }}</div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4 w-full">
            <div class="flex flex-col card">
                <div class="mb-2 text-xl border-b">Evenement en attentes</div>
                <div class="flex overflow-scroll flex-col gap-4 h-full">
                    <div
                        v-for="(club, i) in clubStore.clubs.slice(0, 5)"
                        :key="i"
                        class="flex gap-2 justify-between"
                    >
                        <div class="flex gap-2 items-center">
                            <img class="w-5 h-5" :src="club.avatar" :alt="club.name" />
                            <div>Evenement {{ i }}</div>
                            <div class="text-xs text-gray-400">{{ club.name }}</div>
                        </div>

                        <div class="flex gap-2 items-center">
                            <div
                                class="flex justify-center items-center p-2 w-8 h-8 text-green-400 hover:text-green-500 bg-green-200 hover:bg-green-300 rounded-full cursor-pointer"
                            >
                                <i class="fa-solid fa-check"></i>
                            </div>

                            <div
                                class="flex justify-center items-center p-2 w-8 h-8 text-red-400 hover:text-red-500 bg-red-200 hover:bg-red-300 rounded-full cursor-pointer"
                            >
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col card">
                <div class="text-xl border-b">Evenements</div>
                <LineChart :chart-data="testDataA" :options="optionsA"></LineChart>
            </div>
            <div class="flex flex-col card">
                <div class="text-xl border-b">Evenements</div>
                <LineChart :chart-data="testDataB" :options="optionsB"></LineChart>
            </div>
            <div class="flex flex-col gap-2 card">
                <div class="w-full text-center border-b">Alertes</div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-amber-500 fa-solid fa-triangle-exclamation"></i>

                    <div>Association 1</div>
                    <div class="text-sm text-gray-500">Passation pas encore faite</div>
                </div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-amber-500 fa-solid fa-triangle-exclamation"></i>

                    <div>Association 2</div>
                    <div class="text-sm text-gray-500">Passation pas encore faite</div>
                </div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-red-500 fa-solid fa-circle-exclamation"></i>

                    <div>Association 3</div>
                    <div class="text-sm text-gray-500">Budjet depassé</div>
                </div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-amber-500 fa-solid fa-triangle-exclamation"></i>

                    <div>Association 4</div>
                    <div class="text-sm text-gray-500">Passation pas encore faite</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { LineChart } from 'vue-chart-3'
    import { Chart, registerables } from 'chart.js'
    import { useClubsStore } from '@/store/clubs.store'
    import AppTable from '@/components/App/AppTable.vue'
    const clubStore = useClubsStore()
    clubStore.getClubs()

    Chart.register(...registerables)

    const testDataA = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                data: [130, 70, 60, 70, 50, 130, 190],
                label: null,

                borderColor: '#0ea5e9',

                backgroundColor: '#bae6fd',
                fill: true,
            },
        ],
    }

    const testDataB = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                data: [130, 70, 60, 70, 50, 130, 190],
                label: null,

                borderColor: '#0ea5e9',

                backgroundColor: '#bae6fd',
                fill: true,
            },
        ],
    }

    const optionsA = {
        responsive: true,
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
        },
    }

    const optionsB = {
        responsive: true,
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
        },
    }
</script>

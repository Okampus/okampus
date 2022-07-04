<template>
    <div class="flex flex-col gap-4 my-8 mx-auto w-23/24">
        <div class="grid grid-cols-4 gap-4 w-full text-center">
            <div
                v-for="(n, i) in [
                    {
                        text: `associations`,
                        color: 'blue',
                        icon: 'fa-people-group',
                        val: metricsStore.clubCount[metricsStore.clubCount.length - 1]?.value,
                        change: metricsStore.clubCount[0]?.value,
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
                        val: metricsStore.eventCount[metricsStore.eventCount.length - 1]?.value,
                        change: metricsStore.eventCount[0]?.value,
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
                            :class="{
                                'text-green-400 bg-green-200': (n.val - n.change) / n.val > 0,
                                'text-red-400 bg-red-200': (n.val - n.change) / n.val < 0,
                                'text-gray-400 bg-gray-200': (n.val - n.change) / n.val === 0 || n.val === 0,
                            }"
                        >
                            <template v-if="(n.val - n.change) / n.val > 0">+</template>
                            <template v-if="(n.val - n.change) / n.val === 0 || n.val === 0">~</template>
                            {{ n.val !== 0 ? ((n.val - n.change) / n.val).toFixed(1) : 0 }} %
                        </div>
                    </div>
                    <div class="text-xs text-gray-400 uppercase">{{ n.text }}</div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4 w-full">
            <div class="flex flex-col card">
                <div class="pb-2 mb-2 text-xl border-b">Evenement en attentes</div>
                <div class="flex overflow-y-scroll flex-col gap-4 h-full scrollbar-none">
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
                <div class="flex justify-between items-center pb-2 border-b">
                    <div class="text-xl">Evenements</div>
                    <SelectInput
                        v-model="eventChartType"
                        :choices="['Année', 'Semestre', 'Mois', 'Jour']"
                        :values="['year', 'semester', 'month', 'day']"
                    ></SelectInput>
                </div>

                <LineChart
                    :chart-data="{
                        datasets: [
                            {
                                data: metricsStore.createdEventCount,
                                label: null,
                                borderColor: '#0ea5e9',
                                backgroundColor: '#bae6fd',
                                fill: true,
                            },
                        ],
                    }"
                    :options="chartOptions"
                ></LineChart>
            </div>
            <div class="flex flex-col card">
                <div class="flex justify-between items-center pb-2 border-b">
                    <div class="text-xl">Activité sur la platforme</div>
                    <SelectInput
                        v-model="activityChartType"
                        :choices="['Année', 'Semestre', 'Mois', 'Jour']"
                        :values="['year', 'semester', 'month', 'day']"
                    ></SelectInput>
                </div>
                <LineChart
                    :chart-data="{
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
                    }"
                    :options="chartOptions"
                ></LineChart>
            </div>
            <div class="flex flex-col gap-2 card">
                <div class="pb-2 text-xl border-b">Alertes</div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-amber-400 fa-lg fa-solid fa-triangle-exclamation"></i>

                    <div class="text-gray-400">Association 1</div>
                    <div class="">Passation pas encore faite</div>
                </div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-amber-400 fa-lg fa-solid fa-triangle-exclamation"></i>

                    <div class="text-gray-400">Association 2</div>
                    <div class="">Passation pas encore faite</div>
                </div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-red-400 fa-lg fa-solid fa-circle-exclamation"></i>

                    <div class="text-gray-400">Association 3</div>
                    <div class="">Budjet depassé</div>
                </div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-amber-400 fa-lg fa-solid fa-triangle-exclamation"></i>

                    <div class="text-gray-400">Association 4</div>
                    <div class="">Passation pas encore faite</div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="overflow-x-scroll snap-x snap-proximity">
                <AppTable
                    class="w-max"
                    :items="clubStore.clubs"
                    table-layout="auto"
                    :headers="[
                        {
                            name: 'name',
                            text: 'Nom',
                            class: 'p-2 z-10 border-b border-gray-300 bg-1',
                            sortable: true,
                        },
                        {
                            name: 'owner',
                            text: 'Président',
                            class: 'p-2 border-b border-gray-300',
                        },
                        {
                            name: 'secretary',
                            text: 'Secrétaire',
                            class: 'p-2 border-b border-gray-300',
                        },
                        {
                            name: 'treasurer',
                            text: 'Trésorier',
                            class: 'p-2  border-b border-gray-300',
                        },
                        {
                            name: 'members',
                            text: 'Membres',
                            class: 'p-2 z-10 border-b border-gray-300 bg-1',
                            sortable: true,
                        },
                        {
                            name: 'budget',
                            text: 'Budget',
                            class: 'p-2  border-b border-gray-300',
                            sortable: true,
                        },
                        {
                            name: 'shortDescription',
                            text: 'Description',
                            class: 'p-2  border-b border-gray-300',
                        },
                    ]"
                    :first-column-fixed="true"
                >
                    <template #name="{ avatar, name, category, teamId }">
                        <router-link
                            :to="`/club/${teamId}`"
                            class="flex gap-1 items-center max-w-sm h-full bg-1"
                        >
                            <img :src="avatar" :alt="name" />
                            <div>{{ name }}</div>
                            <div class="text-xs text-gray-400">{{ category }}</div>
                        </router-link>
                    </template>
                    <template #owner="{ owner }">
                        <router-link
                            :to="`/user/${owner.userId}`"
                            class="flex gap-1 items-center cursor-pointer"
                        >
                            <ProfileAvatar
                                :name="fullname(owner)"
                                :avatar="owner.avatar"
                                :size="2.5"
                            ></ProfileAvatar>
                            <div>{{ fullname(owner) }}</div>
                        </router-link>
                    </template>
                    <template #secretary="{ secretary }">
                        <router-link
                            v-if="secretary"
                            :to="`/user/${secretary.userId}`"
                            class="flex gap-1 items-center cursor-pointer"
                        >
                            <ProfileAvatar
                                :name="fullname(secretary)"
                                :avatar="secretary.avatar"
                            ></ProfileAvatar>
                            <div>{{ fullname(secretary) }}</div>
                        </router-link>
                    </template>
                    <template #treasurer="{ treasurer }">
                        <router-link
                            v-if="treasurer"
                            :to="`/user/${treasurer.userId}`"
                            class="flex gap-1 items-center cursor-pointer"
                        >
                            <ProfileAvatar
                                :name="fullname(treasurer)"
                                :avatar="treasurer.avatar"
                            ></ProfileAvatar>
                            <div>{{ fullname(treasurer) }}</div>
                        </router-link>
                    </template>
                    <template #shortDescription="{ shortDescription }">
                        <div class="max-w-lg text-sm">
                            {{ shortDescription }}
                        </div>
                    </template>
                </AppTable>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { LineChart } from 'vue-chart-3'
    import { Chart, registerables } from 'chart.js'
    import { useClubsStore } from '@/store/clubs.store'
    import AppTable from '@/components/App/AppTable.vue'
    import ProfileAvatar from '@/components/Profile/ProfileAvatar.vue'
    import { fullname } from '@/utils/users'
    import SelectInput from '@/components/Input/SelectInput.vue'
    import { ref, watch } from 'vue'
    import { useMetricsStore } from '@/store/metrics.store'
    import * as dayjs from 'dayjs'
    import duration from 'dayjs/plugin/duration'
    import 'chartjs-adapter-date-fns'

    Chart.register(...registerables)

    const chartOptions = {
        locale: 'fr-FR',
        responsive: true,
        parsing: {
            xAxisKey: 'createdAt',
            yAxisKey: 'value',
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    displayFormats: {
                        year: 'DD/MM',
                        month: 'DD/MM',
                        week: 'DD/MM',
                        day: 'DD/MM',
                        hour: 'HH:mm',
                    },
                    tooltipFormat: 'HH:mm dd/MM/yy',
                },
            },
            y: { min: 0 },
        },
        plugins: {
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
        },
    }

    const eventChartType = ref('month')
    const activityChartType = ref('month')

    const intervalTable = {
        year: { unit: 'weeks', count: 1 },
        semester: { unit: 'days', count: 3 },
        month: { unit: 'days', count: 1 },
        week: { unit: 'hours', count: 2 },
        day: { unit: 'minutes', count: 15 },
    }

    dayjs.extend(duration)

    const clubStore = useClubsStore()
    clubStore.getClubs()

    const metricsStore = useMetricsStore()

    const lastWeek = dayjs()
        .subtract(dayjs.duration({ days: 6, hours: 23, minutes: 30 }))
        .toDate()

    const weekDuration = dayjs.duration({ days: 7, hours: 23, minutes: 30 }).asSeconds()

    metricsStore.getClubCount(lastWeek, null, weekDuration)
    metricsStore.getEventCount(lastWeek, null, weekDuration)
    metricsStore.getMembershipCount(lastWeek, null, weekDuration)
    metricsStore.getCreatedEventCount(
        dayjs().subtract(dayjs.duration(1, eventChartType.value)).toDate(),
        null,
        dayjs
            .duration(intervalTable[eventChartType.value].count, intervalTable[eventChartType.value].unit)
            .asSeconds(),
    )

    watch(eventChartType, () => {
        metricsStore.getCreatedEventCount(
            dayjs().subtract(dayjs.duration(1, eventChartType.value)).toDate(),
            null,
            dayjs
                .duration(intervalTable[eventChartType.value].count, intervalTable[eventChartType.value].unit)
                .asSeconds(),
        )
    })

    watch(activityChartType, () => {})
</script>

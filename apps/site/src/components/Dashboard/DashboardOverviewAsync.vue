<template>
    <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4 w-full text-center md:grid-cols-4">
            <div
                v-for="(el, i) in [
                    {
                        text: `associations`,
                        color: 'blue',
                        icon: 'fa-people-group',
                        val: metricsStore.clubCount[metricsStore.clubCount.length - 1]?.value ?? 0,
                        change: metricsStore.clubCount[0]?.value ?? 0,
                    },
                    {
                        text: `% d'insertion`,
                        color: 'sky',
                        icon: 'fa-arrows-down-to-people',
                        val:
                            metricsStore.uniqueMembershipCount[metricsStore.clubCount.length - 1] !== 0?.value
                                ? metricsStore.userCount[metricsStore.userCount.length - 1]?.value /
                                  metricsStore.uniqueMembershipCount[metricsStore.clubCount.length - 1]?.value
                                : 0,
                        change:
                            metricsStore.uniqueMembershipCount[0]?.value !== 0
                                ? metricsStore.userCount[0]?.value /
                                  metricsStore.uniqueMembershipCount[0]?.value
                                : 0,
                    },
                    {
                        text: `evenements`,
                        color: 'emerald',
                        icon: 'fa-calendar-day',
                        val: metricsStore.eventCount[metricsStore.eventCount.length - 1]?.value ?? 0,
                        change: metricsStore.eventCount[0]?.value ?? 0,
                    },
                    {
                        text: 'utilisateurs',
                        color: 'indigo',
                        icon: 'fa-user',
                        val: metricsStore.userCount[metricsStore.userCount.length - 1]?.value ?? 0,
                        change: metricsStore.userCount[0]?.value ?? 0,
                    },
                ]"
                :key="i"
                class="flex justify-around items-center card"
            >
                <div
                    class="flex grow-0 shrink-0 p-3 rounded-full"
                    :class="`bg-${el.color}-300 text-${el.color}-600`"
                >
                    <i class="fa-solid" :class="el.icon"></i>
                </div>
                <div class="flex flex-col justify-center">
                    <div class="flex relative gap-2 justify-center items-center">
                        <div class="text-2xl">{{ el.val }}</div>
                        <div
                            class="p-0.5 text-xs rounded-full"
                            :class="{
                                'text-green-400 bg-green-200': (el.val - el.change) / el.val > 0,
                                'text-red-400 bg-red-200': (el.val - el.change) / el.val < 0,
                                'text-gray-400 bg-gray-200':
                                    (el.val - el.change) / el.val === 0 || el.val === 0,
                            }"
                        >
                            <template v-if="(el.val - el.change) / el.val > 0">+</template>
                            <template v-if="(el.val - el.change) / el.val === 0 || el.val === 0">~</template>
                            {{ el.val !== 0 ? ((el.val - el.change) / el.val).toFixed(1) : 0 }} %
                        </div>
                    </div>
                    <div class="text-xs text-gray-400 uppercase">{{ el.text }}</div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-4 w-full md:grid-cols-2">
            <div class="flex flex-col card">
                <div class="pb-2 mb-2 text-xl border-b">Evenement en attentes</div>
                <div class="flex overflow-y-scroll flex-col gap-4 h-full scrollbar-none">
                    <div
                        v-for="(event, i) in clubStore.events.filter((el) => el.state === 'published')"
                        :key="i"
                        class="flex gap-2 justify-between"
                    >
                        <div class="flex gap-2 items-center">
                            <img :src="event.team.avatar" :alt="event.team.name" />
                            <div>{{ event.name }}</div>
                            <div class="text-sm text-gray-400">{{ event.team.name }}</div>
                        </div>
                        <div class="flex gap-2 items-center">
                            <div
                                class="flex justify-center items-center p-2 w-8 h-8 text-green-400 hover:text-green-500 bg-green-200 hover:bg-green-300 rounded-full cursor-pointer"
                                @click="clubStore.patchEvents(event.teamEventId, { state: 'approved' })"
                            >
                                <i class="fa-solid fa-check"></i>
                            </div>
                            <div
                                class="flex justify-center items-center p-2 w-8 h-8 text-red-400 hover:text-red-500 bg-red-200 hover:bg-red-300 rounded-full cursor-pointer"
                                @click="clubStore.patchEvents(event.teamEventId, { state: 'rejected' })"
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
                        v-model="eventChartRange"
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
                        v-model="activityChartRange"
                        :choices="['Année', 'Semestre', 'Mois', 'Jour']"
                        :values="['year', 'semester', 'month', 'day']"
                    ></SelectInput>
                </div>
                <LineChart
                    :chart-data="{
                        datasets: [{ data: [] }],
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
    </div>
</template>

<script setup>
    import { LineChart } from 'vue-chart-3'
    import { Chart, registerables } from 'chart.js'
    import { useClubsStore } from '@/store/clubs.store'

    import SelectInput from '@/components/Input/SelectInput.vue'
    import { ref, watchEffect } from 'vue'
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
                        year: 'dd/MM',
                        month: 'dd/MM',
                        week: 'dd/MM',
                        day: 'dd/MM',
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

    const eventChartRange = ref('month')
    const activityChartRange = ref('month')

    const intervalTable = {
        year: { unit: 'weeks', count: 1 },
        semester: { unit: 'days', count: 3 },
        month: { unit: 'days', count: 1 },
        week: { unit: 'hours', count: 2 },
        day: { unit: 'minutes', count: 15 },
    }

    dayjs.extend(duration)

    const clubStore = useClubsStore()
    await clubStore.getClubs()
    await clubStore.getEvents({ state: 'published' })

    const metricsStore = useMetricsStore()

    const lastWeek = dayjs()
        .subtract(dayjs.duration({ days: 6, hours: 10, minutes: 30 }))
        .toDate()

    const weekDuration = dayjs.duration({ days: 6, hours: 23, minutes: 45 }).asSeconds()

    const getMetrics = async () => {
        metricsStore.getClubCount(lastWeek, null, dayjs.duration({ minutes: 15 }).asSeconds())
        metricsStore.getEventCount(lastWeek, null, weekDuration)
        metricsStore.getMembershipCount(lastWeek, null, weekDuration)
        metricsStore.getUserCount(lastWeek, null, weekDuration)
        metricsStore.getUniqueMembershipCount(lastWeek, null, weekDuration)
    }

    await getMetrics()

    watchEffect(async () => {
        await metricsStore.getCreatedEventCount(
            dayjs().subtract(dayjs.duration(1, eventChartRange.value)).toDate(),
            null,
            dayjs
                .duration(
                    intervalTable[eventChartRange.value].count,
                    intervalTable[eventChartRange.value].unit,
                )
                .asSeconds(),
        )
    })

    watchEffect(activityChartRange, () => {})
</script>

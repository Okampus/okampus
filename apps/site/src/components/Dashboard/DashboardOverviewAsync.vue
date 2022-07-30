<template>
    <div class="flex flex-col gap-4">
        <div class="grid w-full grid-cols-2 gap-4 text-center md:grid-cols-4">
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
                class="card flex items-center justify-around"
            >
                <div
                    class="flex shrink-0 grow-0 rounded-full p-3"
                    :class="`bg-${el.color}-300 text-${el.color}-600`"
                >
                    <i class="fa-solid" :class="el.icon"></i>
                </div>
                <div class="flex flex-col justify-center">
                    <div class="relative flex items-center justify-center gap-2">
                        <div class="text-2xl">{{ el.val }}</div>
                        <div
                            class="rounded-full p-0.5 text-xs"
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
                    <div class="text-xs uppercase text-gray-400">{{ el.text }}</div>
                </div>
            </div>
        </div>
        <div class="grid w-full auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2">
            <div
                v-if="clubStore.events.filter((el) => el.state === 'published').length"
                class="card flex flex-col"
            >
                <div class="mb-2 border-b pb-2 text-xl">Evénements en attente</div>
                <div class="scrollbar-none flex h-full flex-col gap-4 overflow-y-scroll">
                    <div
                        v-for="(event, i) in clubStore.events.filter((el) => el.state === 'published')"
                        :key="i"
                        class="flex justify-between gap-2"
                    >
                        <TeamActivity :team="event.team" :custom-string="event.name" />
                        <div class="flex items-center gap-2">
                            <div
                                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-200 p-2 text-green-400 hover:bg-green-300 hover:text-green-500"
                                @click="clubStore.patchEvents(event.id, { state: 'approved' })"
                            >
                                <i class="fa-solid fa-check"></i>
                            </div>
                            <div
                                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-200 p-2 text-red-400 hover:bg-red-300 hover:text-red-500"
                                @click="clubStore.patchEvents(event.id, { state: 'rejected' })"
                            >
                                <i class="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card flex flex-col">
                <div class="flex items-center justify-between border-b pb-2">
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
            <div class="card flex flex-col">
                <div class="flex items-center justify-between border-b pb-2">
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
            <div class="card flex flex-col gap-2">
                <div class="border-b pb-2 text-xl">Alertes</div>
                <div class="flex w-full items-center gap-2">
                    <i class="fa-lg fa-solid fa-triangle-exclamation text-amber-400"></i>

                    <div class="text-gray-400">Association 1</div>
                    <div class="">Passation pas encore faite</div>
                </div>
                <div class="flex w-full items-center gap-2">
                    <i class="fa-lg fa-solid fa-triangle-exclamation text-amber-400"></i>

                    <div class="text-gray-400">Association 2</div>
                    <div class="">Passation pas encore faite</div>
                </div>
                <div class="flex w-full items-center gap-2">
                    <i class="fa-lg fa-solid fa-circle-exclamation text-red-400"></i>

                    <div class="text-gray-400">Association 3</div>
                    <div class="">Budjet depassé</div>
                </div>
                <div class="flex w-full items-center gap-2">
                    <i class="fa-lg fa-solid fa-triangle-exclamation text-amber-400"></i>

                    <div class="text-gray-400">Association 4</div>
                    <div class="">Passation pas encore faite</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import SelectInput from '@/components/Input/SelectInput.vue'
    import TeamActivity from '@/components/App/General/TeamActivity.vue'

    import { LineChart } from 'vue-chart-3'
    import { Chart, registerables } from 'chart.js'
    import { useClubsStore } from '@/store/clubs.store'

    import { ref, watchEffect } from 'vue'
    import { useMetricsStore } from '@/store/metrics.store'
    import 'chartjs-adapter-date-fns'

    import dayjs from '@/shared/modules/dayjs'

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

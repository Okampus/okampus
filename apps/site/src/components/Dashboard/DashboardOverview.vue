<template>
    <GraphQLQuery
        :query="getAllMetrics"
        :variables="{ before: now.toISOString(), after: nowMinusOneMonth.toISOString(), interval: 'PT1H' }"
        :update="(data) => metricsByName(data?.metrics)"
    >
        <template #default="{ data: allMetrics }">
            <!-- <div v-for="(name, metrics) in allMetrics" :key="name" class="text-0">
                {{ name }} : {{ JSON.stringify(metrics) }}
            </div> -->
            <div class="flex flex-col items-center gap-4">
                <h2 class="text-0 my-4 font-semibold">
                    Évolution sur la période {{ getDateRangeStringShort(nowMinusOneMonth, now) }}
                </h2>
                <div class="grid w-full grid-cols-2 gap-4 text-center md:grid-cols-3">
                    <div
                        v-for="(metric, i) in metricSummary(allMetrics)"
                        :key="i"
                        class="card-2 flex flex-col items-center justify-center gap-0.5"
                    >
                        <div class="text-4 text-base uppercase">{{ metric.text }}</div>
                        <div class="text-2xl font-bold">{{ metric.value }}</div>
                        <div
                            class="flex gap-2 p-0.5 text-sm"
                            :class="{
                                'text-green-500': metric.change > 0,
                                'text-red-500 ': metric.change < 0,
                                'text-gray-500': !metric.change || !metric.value,
                            }"
                        >
                            <i v-if="metric.change < 0" class="fa fa-arrow-trend-down pt-0.5 text-xs" />
                            <i v-if="metric.change > 0" class="fa fa-arrow-trend-up pt-0.5 text-xs" />
                            {{ metric.diff }}
                            ({{ `${metric.change > 0 ? '+' : ''}${metric.change.toFixed(2) * 100}` }}%)
                        </div>
                    </div>
                </div>
                <div class="flex w-full flex-col gap-4 md:flex-row">
                    <div class="card-2 relative w-full">
                        <h4 class="text-0 mt-2">Nombre d'utilisateurs</h4>
                        <h6 class="text-2 text-sm">Vue par heure</h6>
                        <h4 class="mt-4 mb-1">
                            {{ last(allMetrics.UserCount).value }} utilisateur{{
                                last(allMetrics.UserCount).value > 0 ? 's' : ''
                            }}
                        </h4>
                        <Line
                            :chart-data="{
                                datasets: [
                                    {
                                        data: allMetrics.UserCount,
                                        borderColor: '#0ea5e9',
                                        backgroundColor: '#bae6fd',
                                        fill: true,
                                    },
                                ],
                            }"
                            :chart-options="chartOptions"
                        />
                    </div>
                    <div class="card-2 relative w-full">
                        <h4 class="text-0 mt-2">Nombre d'événements</h4>
                        <h6 class="text-2 text-sm">Vue par heure</h6>
                        <h4 class="mt-4 mb-1">
                            {{ last(allMetrics.ClubEventCount).value }} événement{{
                                last(allMetrics.ClubEventCount).value > 0 ? 's' : ''
                            }}
                        </h4>
                        <Line
                            :chart-data="{
                                datasets: [
                                    {
                                        data: allMetrics.ClubEventCount,
                                        label: null,
                                        borderColor: '#0ea5e9',
                                        backgroundColor: '#bae6fd',
                                        fill: true,
                                    },
                                ],
                            }"
                            :chart-options="chartOptions"
                        />
                    </div>
                </div>
                <!--
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
                </div> -->
            </div>
        </template>
    </GraphQLQuery>
</template>

<script setup>
    import GraphQLQuery from '@/components/App/GraphQLQuery.vue'
    import { Line } from 'vue-chartjs'

    import { getAllMetrics } from '@/graphql/queries/metrics/getMetrics.js'
    import { groupBy, last, mapValues } from 'lodash'
    import { getDateRangeStringShort } from '@/utils/dateUtils'

    import 'chartjs-adapter-date-fns'
    import { Chart, registerables } from 'chart.js'
    import { fr } from 'date-fns/locale'

    Chart.register(...registerables)

    const now = new Date()
    const nowMinusOneMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const calculateChange = ({ before, now }) => (before === 0 ? 0 : (now - before) / before)
    const getSummary = (records) => ({ now: last(records).value, before: records[0].value })

    const metricsByName = (metrics) =>
        mapValues(groupBy(metrics, 'name'), (metrics) =>
            metrics.sort((m1, m2) => new Date(m1.createdAt).getTime() - new Date(m2.createdAt).getTime()),
        )

    const absDiff = ({ before, now }) => Math.abs(now - before)

    const metricSummary = (metricsBy) => {
        const userCount = getSummary(metricsBy.UserCount)
        const clubUniqueMembershipCount = getSummary(metricsBy.ClubUniqueMembershipCount)
        const insertionRate = {
            now: ((clubUniqueMembershipCount.now / userCount.now) * 100).toFixed(2),
            before: ((clubUniqueMembershipCount.before / userCount.before) * 100).toFixed(2),
        }
        const clubEventCount = getSummary(metricsBy.ClubEventCount)
        const clubCreatedEventCount = getSummary(metricsBy.ClubCreatedEventCount)
        const clubCount = getSummary(metricsBy.ClubCount)

        return [
            {
                text: "% d'Insertion",
                value: `${insertionRate.now} %`,
                change: calculateChange(insertionRate),
                diff: `${absDiff(insertionRate)} %`,
            },
            {
                text: "Membres d'assos",
                value: userCount.now,
                change: calculateChange(userCount),
                diff: absDiff(userCount),
            },
            {
                text: 'Utilisateurs',
                value: userCount.now,
                change: calculateChange(userCount),
                diff: absDiff(userCount),
            },
            {
                text: 'Événements crées',
                value: clubEventCount.now,
                change: calculateChange(clubEventCount),
                diff: absDiff(clubEventCount),
            },
            {
                text: 'Événements',
                value: clubCreatedEventCount.now,
                change: calculateChange(clubCreatedEventCount),
                diff: absDiff(clubCreatedEventCount),
            },
            {
                text: 'Associations',
                value: clubCount.now,
                change: calculateChange(clubCount),
                diff: absDiff(clubCount),
            },
        ]
    }

    const chartOptions = {
        locale: 'fr-FR',
        aspectRatio: 2.5,
        parsing: {
            xAxisKey: 'createdAt',
            yAxisKey: 'value',
        },
        scales: {
            x: {
                adapters: {
                    date: {
                        locale: fr,
                    },
                },
                type: 'time',
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                },
                time: {
                    displayFormats: {
                        hour: 'd MMM H:mm',
                    },
                    tooltipFormat: 'd MMM à HH:mm',
                    unit: 'hour',
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
</script>

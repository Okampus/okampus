<template>
    <div class="flex flex-col gap-4 my-8 mx-auto w-21/24">
        <div class="grid grid-cols-4 gap-4 w-full text-center">
            <div
                v-for="(n, i) in [
                    {
                        text: `Nombre d'associations`,
                        color: 'blue',
                        icon: 'fa-people-group',
                        val: 52,
                        change: 10,
                    },
                    {
                        text: `% d'insertion`,
                        color: 'cyan',
                        icon: 'fa-arrows-down-to-people',
                        val: 82,
                        change: 10,
                    },
                    {
                        text: `nb evenement`,
                        color: 'teal',
                        icon: 'fa-calendar-day',
                        val: 56,
                        change: -10,
                    },
                    { text: 'Nouveaux utilisateurs', color: 'amber', icon: 'fa-user', val: 5983, change: -5 },
                ]"
                :key="i"
                class="flex justify-around items-center card"
            >
                <i
                    class="grow-0 p-3 rounded-full fa-solid"
                    :class="`bg-${n.color}-300 text-${n.color}-600 ${n.icon}`"
                ></i>

                <div class="flex flex-col justify-center">
                    <div class="flex relative gap-2 justify-center items-center">
                        <div class="text-2xl">{{ n.val }}</div>
                        <div
                            class="p-0.5 text-xs rounded-full"
                            :class="[
                                n.change >= 0 ? 'text-green-600 bg-green-300' : 'text-red-600 bg-red-300',
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
             <div class="card">
                <table class="w-full">
                    <thead class="border-b">
                        <tr>
                            <th>Associations</th>
                        </tr>
                    </thead>
                    <tbody class="space-y-2">
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24">
                                <i class="text-red-500 fa-solid fa-circle-exclamation"></i>
                            </td>
                            <td>Association 1</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Président</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Trésorier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Secrétaire</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24"><i class="text-green-500 fa-solid fa-check"></i></td>
                            <td>Association 2</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Président</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Trésorier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Secrétaire</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24"><i class="text-green-500 fa-solid fa-check"></i></td>
                            <td>Association 3</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Président</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Trésorier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Secrétaire</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24">
                                <i class="text-green-500 fa-solid fa-check"></i>
                            </td>
                            <td>Association 4</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Président</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Trésorier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Secrétaire</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24">
                                <i class="text-red-500 fa-solid fa-circle-exclamation"></i>
                            </td>
                            <td>Association 5</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Président</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Trésorier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Secrétaire</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card">
                <LineChart :chart-data="testData" :options="optionsA"></LineChart>
            </div>
             <div class="card">
                <LineChart :chart-data="testData" :options="optionsB"></LineChart>
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

    Chart.register(...registerables)

    const testData = {
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
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Nombre d'adherents",
            },
        },
    }

    const optionsB = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Nombre d'events",
            },
        },
    }
</script>

<template>
    <div class="flex flex-col gap-4 my-8 mx-auto w-21/24">
        <div class="grid grid-cols-4 gap-4 w-full text-center">
            <div
                v-for="(n, i) in [
                    { text: `% d'eleve dans une associations`, val: 10 },
                    { text: 'Truc important', val: 10 },
                    { text: 'Truc important', val: 120 },
                    { text: 'Truc important', val: 11000 },
                ]"
                :key="i"
                class="flex flex-col justify-center items-center card"
            >
                <div class="text-sm">{{ n.text }}</div>
                <div class="text-xl">{{ n.val }}</div>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4 w-full">
            <div class="flex flex-col gap-2 card">
                <div class="w-full text-center border-b">Alertes</div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-amber-500 fa-solid fa-triangle-exclamation"></i>

                    <div>Horizon</div>
                    <div class="text-sm text-gray-500">Passation pas encore faite</div>
                </div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-amber-500 fa-solid fa-triangle-exclamation"></i>

                    <div>Horizon</div>
                    <div class="text-sm text-gray-500">Passation pas encore faite</div>
                </div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-red-500 fa-solid fa-circle-exclamation"></i>

                    <div>Horizon</div>
                    <div class="text-sm text-gray-500">Budjet depassé</div>
                </div>
                <div class="flex gap-2 items-center w-full">
                    <i class="text-amber-500 fa-solid fa-triangle-exclamation"></i>

                    <div>Horizon</div>
                    <div class="text-sm text-gray-500">Passation pas encore faite</div>
                </div>
            </div>
            <div class="card">
                <LineChart :chart-data="testData" :options="optionsA"></LineChart>
            </div>
            <div class="card">
                <LineChart :chart-data="testData" :options="optionsB"></LineChart>
            </div>
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
                            <td class="">Horizon 1</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24"><i class="text-green-500 fa-solid fa-check"></i></td>
                            <td>Horizon 1</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24"><i class="text-green-500 fa-solid fa-check"></i></td>
                            <td>Horizon 1</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24">
                                <i class="text-green-500 fa-solid fa-check"></i>
                            </td>
                            <td>Horizon 1</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24">
                                <i class="text-red-500 fa-solid fa-circle-exclamation"></i>
                            </td>
                            <td>Horizon 1</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="flex gap-2 items-center">
                            <td class="w-1/24">
                                <i class="text-red-500 fa-solid fa-circle-exclamation"></i>
                            </td>
                            <td>Horizon 1</td>
                            <td class="grid grow grid-cols-3 gap-2 items-center text-xs text-gray-400">
                                <div class="flex gap-1 items-center">
                                    <i class="fas fa-star"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-sack-dollar"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                                <div class="flex gap-1 items-center">
                                    <i class="fa-solid fa-pen-nib"></i>
                                    <div class="truncate">Ivan Lasnier</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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

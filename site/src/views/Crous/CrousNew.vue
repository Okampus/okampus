<template>
    <CardPage>
        <div class="flex flex-col gap-6">
            <div class="flex justify-between items-center">
                <div class="flex gap-4 items-center">
                    <img class="w-16 h-16" :src="crousLogo" />
                    <h3 class="ml-4 text-xl font-bold">Gestion du Crous</h3>
                </div>
                <div>
                    <input v-model="date" class="input" type="date" />
                </div>
            </div>
            <div class="flex gap-6 items-center">
                <div>Informations</div>
                <input
                    v-model="daily.info"
                    type="text"
                    class="w-full input"
                    placeholder="Informations du jour..."
                />
            </div>

            <div class="flex justify-between">
                <div v-if="daily.menu === null" class="flex gap-4">
                    <div>Pas de menu pour ce jour !</div>
                    <button class="text-sm text-blue-500" @click="initMenu()">+ Ajouter un menu</button>
                </div>
                <template v-for="(dishType, _, i) in FOOD_TYPES" v-else :key="i">
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-2 items-center">
                            <span>{{ dishType[i18n.global.locale] + 's' }}</span>
                            <button
                                class="text-sm text-blue-500"
                                @click="daily.menu[dishType.key].push(null)"
                            >
                                + Ajouter un{{
                                    i18n.global.locale === 'fr' && dishType.frFeminine ? 'e' : ''
                                }}
                                {{ dishType[i18n.global.locale] }}
                            </button>
                        </div>

                        <SelectInput
                            v-for="(__, j) in daily.menu[dishType.key]"
                            :key="j"
                            v-model="daily.menu[dishType.key][j]"
                            :choices="crous.getFoodType(i).map((dish) => dish.name)"
                            :values="crous.getFoodType(i).map((dish) => dish.foodId)"
                        />
                    </div>
                </template>
            </div>
            <button class="button" @click="sendDaily">
                <span>Enregistrer</span>
            </button>
        </div>
    </CardPage>
</template>

<script setup>
    import CardPage from '../App/CardPage.vue'
    import crousLogo from '@/assets/img/crous/crous_logo.png'

    import { useRestaurantStore } from '@/store/restaurant.store'
    import { FOOD_TYPES, FOOD_TYPES_KEYS } from '@/shared/types/food-types.enum'
    import { i18n } from '@/shared/modules/i18n'
    import { ref, watch } from 'vue'

    import SelectInput from '@/components/Input/SelectInput.vue'
    import { getDateFromDatetime, getTodayDate } from '@/utils/dateUtils'

    import { isNil, pick } from 'lodash'
    import { emitter } from '@/shared/modules/emitter'

    const crous = useRestaurantStore()

    const date = ref(getTodayDate())

    const daily = ref({
        info: '',
        menu: null,
        infoExists: false,
        menuExists: false,
    })

    const initMenu = () => {
        daily.value.menu = FOOD_TYPES_KEYS.reduce((acc, curr) => ((acc[curr] = []), acc), {})
    }
    const updateDate = (date) =>
        crous.getDate(date).then((data) => {
            daily.value.info = data.info?.content ?? ''
            daily.value.menu = isNil(data.menu) ? null : pick(data.menu, FOOD_TYPES_KEYS)
            if (!isNil(daily.value.menu)) {
                FOOD_TYPES_KEYS.forEach((key) => {
                    daily.value.menu[key] = daily.value.menu[key].map((food) => food.foodId)
                })
            }
            daily.value.infoExists = !isNil(data.info)
            daily.value.menuExists = !isNil(data.menu)
        })

    // Query foods THEN get daily
    crous.getItems('food').then(() => {
        updateDate(date.value)
    })

    const isValidMenu = () => {
        const menu = daily.value.menu

        if (isNil(menu)) return false
        return FOOD_TYPES_KEYS.every(
            (foodType) => menu[foodType].length > 0 && menu[foodType].every((food) => food !== null),
        )
    }

    const sendDaily = () => {
        const promises = []
        const dateString = getDateFromDatetime(date.value)
        if (daily.value.info.length) {
            promises.push(
                daily.value.infoExists
                    ? crous.updateItem('info', {
                          date: dateString,
                          content: daily.value.info,
                      })
                    : crous.addItem('info', {
                          date: dateString,
                          content: daily.value.info,
                      }),
            )
        }

        if (isValidMenu()) {
            promises.push(
                daily.value.menuExists
                    ? crous.updateItem('menu', { ...daily.value.menu, date: dateString })
                    : crous.addItem('menu', { ...daily.value.menu, date: dateString }),
            )
        }

        Promise.all(promises)
            .then(() => {
                emitter.emit('show-toast', {
                    message: 'Données enregistrées avec succès !',
                    type: 'success',
                })
            })
            .catch((err) => {
                emitter.emit('show-toast', {
                    message: `Une erreur est survenue lors de l'enregistrement des données ! (${err})`,
                    type: 'error',
                })
            })
    }

    watch(() => date.value, updateDate)
</script>

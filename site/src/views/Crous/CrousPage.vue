<template>
    <div class="flex gap-4 mx-auto">
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-4 card">
                <div class="flex items-center w-full">
                    <img class="w-16 h-16" :src="crousLogo" />
                    <h3 class="ml-4 text-xl font-bold">Menu du Crous</h3>
                </div>
                <template v-if="!isEmpty(dishes)">
                    <div v-for="(dishList, type, i) in dishes" :key="i" class="flex flex-col gap-2">
                        <span class="uppercase">{{ FOOD_TYPES[type][i18n.global.locale] + 's' }}</span>
                        <div class="flex gap-4">
                            <span v-for="(dish, j) in dishList" :key="j"> {{ dish.name }}</span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div>Pas de menu pour ce jour !</div>
                </template>
            </div>

            <div class="flex flex-col gap-4 card">
                <div class="flex items-center w-full">
                    <img class="w-16 h-16" :src="crousLogo" />
                    <h3 class="ml-4 text-xl font-bold">Formules et Tarifs</h3>
                </div>
                <img class="w-full" :src="crousMenu" />
            </div>
        </div>

        <div class="flex flex-col gap-4 card">
            <div class="">
                <h3 class="text-xl font-bold">Horaires</h3>
                <div>Du Lundi au Vendredi :</div>
                <div class="ml-4">
                    <div>Cantine : 12h-14h30</div>
                    <div>Cafétéria : 8h-18h</div>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-4 card">
            <h3 class="text-xl font-bold">Dernières informations</h3>
            <div v-if="dayCrous.info?.content">{{ dayCrous.info?.content }}</div>
            <div v-else>Pas d'informations pour ce jour !</div>
        </div>
    </div>
</template>

<script setup>
    import { computed, reactive, ref, watch } from 'vue'
    import crousLogo from '@/assets/img/crous/crous_logo.png'
    import crousMenu from '@/assets/img/crous/crous_menu.jpg'
    import { useRestaurantStore } from '@/store/restaurant.store'
    import { useRoute } from 'vue-router'
    import { emitter } from '@/shared/modules/emitter'
    import { getStatus } from '@/utils/errors'
    import { isNil, isEmpty } from 'lodash'

    import { i18n } from '@/shared/modules/i18n'

    import { FOOD_TYPES } from '@/shared/types/food-types.enum'
    import { errorCodes } from '@/shared/errors/app-exceptions.enum'

    const START_DATE = new Date('2022-02-25')

    const crous = useRestaurantStore()
    const route = useRoute()

    const dayCrous = reactive({ menu: null, info: null })
    const dishes = computed(() => {
        if (isNil(dayCrous.menu)) {
            return []
        }

        const dishesDetails = {}

        Object.keys(FOOD_TYPES).forEach((type) => {
            dishesDetails[type] = dayCrous.menu[FOOD_TYPES[type].key].map((dish) =>
                crous.food.find((food) => food.foodId === dish.foodId),
            )
        })

        return dishesDetails
    })

    const loadDayCrous = async () => {
        if (route.name === 'crous') {
            try {
                const date = ref(route.params.date === 'today' ? new Date() : new Date(route.params.date))
                if (date.value < START_DATE) {
                    throw new Error('No records before ' + START_DATE.toLocaleDateString())
                } else {
                    crous
                        .getDate(date.value.toISOString().split('T').shift())
                        .then((data) => {
                            dayCrous.menu = data.menu
                            dayCrous.info = data.info
                        })
                        // TODO: globally improve status error catching
                        .catch((err) => {
                            emitter.emit('error-route', { code: getStatus(err.response) })
                        })
                }
            } catch (e) {
                // TODO: globally improve status error catching
                emitter.emit('error-route', { code: errorCodes.NOT_FOUND })
            }
        }
    }

    await loadDayCrous()
    watch(() => route.params.date, loadDayCrous)
</script>

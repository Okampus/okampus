import { defineStore } from 'pinia'

import $axios from '../shared/config/axios.config'

import { onData, onItems, sameByIdFunc } from '@/utils/store'
import { isNil } from 'lodash'
import { DESSERT, DISH, STARTER } from '@/shared/types/food-types.enum'

const types = {
    food: {
        endpoint: 'food',
        idKey: 'foodId',
    },
    menu: {
        endpoint: 'daily-menus',
        idKey: 'date',
    },
    info: {
        endpoint: 'daily-info',
        idKey: 'date',
    },
}

const dishTypes = ['starters', 'dishes', 'desserts']

export const useRestaurantStore = defineStore('restaurant', {
    state: () => ({ food: [], menu: [], info: [] }),

    actions: {
        getFoodType(type) {
            if (type === STARTER) {
                return this.getStarters
            } else if (type === DISH) {
                return this.getDishes
            } else if (type === DESSERT) {
                return this.getDesserts
            }
        },

        replaceItems({ type, items }) {
            if (Object.keys(types).includes(type)) {
                this[type] = items
            } else {
                throw 'Invalid type'
            }
        },
        replaceItem({ type, data }) {
            if (Object.keys(types).includes(type)) {
                const index = this[type].findIndex(sameByIdFunc(data, types[type].idKey))
                if (index !== -1) {
                    this[type][index] = data
                } else {
                    this[type].push(data)
                }
            } else {
                throw 'Invalid type'
            }
        },
        removeItem({ type, item }) {
            if (Object.keys(types).includes(type)) {
                this[type] = this[type].filter(sameByIdFunc(item, types[type].idKey))
            } else {
                throw 'Invalid type'
            }
        },
        async getFoodsIfNeeded(foods) {
            return await Promise.all(
                foods
                    .filter((food) => this.food.findIndex(sameByIdFunc(food, 'foodId')) === -1)
                    .map((food) =>
                        $axios
                            .get(`restaurant/food/${food.foodId}`)
                            .then(onData(this.replaceItem, { type: 'food' })),
                    ),
            )
        },
        async getDate(date) {
            const { data } = await $axios.get(`/restaurant/date?date=${date}`)

            const foods = isNil(data.menu) ? [] : [...new Set(dishTypes.map((key) => data.menu[key]).flat())]

            await this.getFoodsIfNeeded(foods)

            this.replaceItem({ type: 'menu', data: { menuId: null, ...data.menu } })
            this.replaceItem({ type: 'info', data: { infoId: null, ...data.info } })

            return data
        },
        async getItems(type, query) {
            return await $axios
                .get(`/restaurant/${types[type].endpoint}`, { params: query })
                .then(onItems(this.replaceItems, { type }))
        },
        async getItem(type, id) {
            return await $axios
                .get(`/restaurant/${types[type].endpoint}/${id}`)
                .then(onData(this.replaceItem, { type }))
        },
        async addItem(type, item) {
            return await $axios
                .post(`/restaurant/${types[type].endpoint}`, item)
                .then(onData(this.replaceItem, { type }))
        },
        async updateItem(type, item) {
            const { [types[type].idKey]: id, ...updatedItem } = item
            return await $axios
                .patch(`/restaurant/${types[type].endpoint}/${id}`, updatedItem)
                .then(onData(this.replaceItem, { type }))
        },
        async deleteItem(type, id) {
            return await $axios
                .delete(`/restaurant/${types[type].endpoint}/${id}`)
                .then(onData(this.removeItem, { type }))
        },
    },
    getters: {
        getStarters(state) {
            return state.food.filter((food) => food.type === STARTER)
        },
        getDishes(state) {
            return state.food.filter((food) => food.type === DISH)
        },
        getDesserts(state) {
            return state.food.filter((food) => food.type === DESSERT)
        },
    },
})

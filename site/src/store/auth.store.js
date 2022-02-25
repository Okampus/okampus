import { defineStore } from 'pinia'

import $axios from '../shared/config/axios.config'

import { onData } from '@/utils/store'

import { isEmpty } from 'lodash'

import { useLocalStorage } from '@vueuse/core'
import { useCookies } from 'vue3-cookies'

import logOutOnExpire from '@/utils/logOutOnExpire'

export const useAuthStore = defineStore('auth', {
    state: () => ({ user: useLocalStorage('user', {}) }),

    actions: {
        updateUser(user) {
            this.user = { ...user, fullname: user.firstname.split(' ')[0] + ' ' + user.lastname }
            return user
        },
        async getMe() {
            return await $axios.get('auth/me').then(onData(this.updateUser))
        },
        async logIn(user) {
            return await $axios.post('auth/login', user).then(
                onData((data) => {
                    this.updateUser(data)
                    logOutOnExpire()
                }),
            )
        },
        async logOut() {
            this.user = {}

            const cookies = useCookies().cookies
            cookies.remove('accessTokenExpiresAt')
            cookies.remove('refreshTokenExpiresAt')

            return await $axios.get('auth/logout')
        },
    },

    getters: {
        loggedIn: (state) => !isEmpty(state.user),
    },
})

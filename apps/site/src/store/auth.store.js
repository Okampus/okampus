import { defineStore } from 'pinia'

import $axios from '@/shared/config/axios.config'
import { emitter } from '@/shared/modules/emitter'

import { onData } from '@/utils/store'
import { isEmpty } from 'lodash'

import { useLocalStorage } from '@vueuse/core'

import logOutOnExpire from '@/utils/logOutOnExpire'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: useLocalStorage('user', {}),
        agreedToTerms: useLocalStorage('agreedToTerms', false),
    }),

    actions: {
        agreeToTerms() {
            this.agreedToTerms = true
            emitter.emit('show-toast', {
                message: "Vous avez accepté les conditions d'utilisation de la bêta d'Okampus !",
                type: 'success',
            })
        },
        updateUser(user) {
            this.user = { ...this.user, ...user }
            return user
        },
        async getMe() {
            return await $axios.get('auth/me').then(onData(this.updateUser))
        },
        async logIn(user) {
            return await $axios.post('auth/login', user).then(
                onData((data) => {
                    this.updateUser(data)
                    logOutOnExpire(data)
                }),
            )
        },
        async logOut() {
            this.user = {}
            return await $axios.get('auth/logout')
        },
    },

    getters: {
        loggedIn: (state) => !isEmpty(state.user),
    },
})

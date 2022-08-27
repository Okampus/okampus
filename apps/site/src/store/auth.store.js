import { defineStore } from 'pinia'

import $axios from '@/shared/config/axios.config'

import { onData } from '@/utils/store'
import { isEmpty } from 'lodash'

import { useLocalStorage } from '@vueuse/core'

import { showSuccessToast } from '@/utils/toast'
import { apolloClient } from '@/shared/modules/apollo.client'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: useLocalStorage('user', {}),
        agreedToTerms: useLocalStorage('agreedToTerms', false),
        expiresAt: useLocalStorage('expiresAt', 0),
    }),

    actions: {
        agreeToTerms() {
            this.agreedToTerms = true
            showSuccessToast("Bienvenue sur la bêta d'Okampus 🎉 !")
        },
        updateUser(user) {
            this.user = { ...this.user, ...user }
            return user
        },
        async getMe() {
            return await $axios.get('auth/me').then(onData(this.updateUser))
        },
        async logOut() {
            await $axios.get('auth/logout').then(() => {
                this.user = {}
            })
            apolloClient.cache.reset()
        },
    },

    getters: {
        loggedIn: (state) => !isEmpty(state.user),
    },
})

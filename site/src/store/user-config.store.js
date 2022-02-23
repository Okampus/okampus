import { defineStore } from 'pinia'

export const useUserConfigStore = defineStore('userConfig', {
    state: () => {
        if (
            localStorage.getItem('darkMode') === null ||
            !['light', 'dark'].includes(localStorage.getItem('darkMode'))
        ) {
            localStorage.setItem(
                'darkMode',
                !(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
                    ? 'dark'
                    : 'light',
            )
        }

        return {
            darkMode: localStorage.getItem('darkMode') !== 'light',
        }
    },
    actions: {
        switchDarkMode() {
            this.darkMode = !this.darkMode
            localStorage.setItem('darkMode', this.darkMode ? 'dark' : 'light')
        },
    },
})

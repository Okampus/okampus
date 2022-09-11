import { isAccessTokenExpired } from '@/utils/logOutOnExpire'
import { useLocalStorage } from '@vueuse/core'
import { isEmpty } from 'lodash'
import { computed, ref } from 'vue'

const initDarkMode =
    localStorage.getItem('darkMode') === null || !['light', 'dark'].includes(localStorage.getItem('darkMode'))
        ? !(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
            ? 'dark'
            : 'light'
        : localStorage.getItem('darkMode')

const me = useLocalStorage('me', {})
export default ref({
    me,
    loggedIn: computed(() => !isAccessTokenExpired() && !isEmpty(me.value)),
    darkMode: useLocalStorage('darkMode', initDarkMode),
    agreedToTerms: useLocalStorage('agreedToTerms', false),
    wantedUrl: useLocalStorage('wantedUrl', null),
    autoAnonymise: true,
    sendRGDPDump: false,
})

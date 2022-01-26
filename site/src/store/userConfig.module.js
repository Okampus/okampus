const theme = JSON.parse(localStorage.getItem('themePreference'))
const initialState = { theme: theme === 'dark' ? 'dark' : 'light' }

export const userConfig = {
    namespaced: true,
    state: initialState,
    getters: {
        getTheme(state) {
            return state.theme
        },
    },
    actions: {
        switchTheme({ state, commit }) {
            commit('setTheme', state.theme === 'dark' ? 'light' : 'dark')
        },
    },
    mutations: {
        setTheme(state, theme) {
            state.theme = theme
            localStorage.setItem('themePreference', JSON.stringify(theme))
        },
    },
}

import router from '@/router'
import AuthService from '@/services/auth.service'
import { settleQuery } from './constants'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = {
    loggedIn: !!user,
    user: user,
}

export function redirectToHome() {
    if (router.currentRoute.value.fullPath !== '/') {
        router.push('/')
    }
}

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        redirectIfNotLoggedIn({ state }) {
            if (!state.loggedIn) {
                redirectToHome()
            }
        },
        getMe: ({ commit }) => settleQuery({ commit, mutation: 'getUserSuccess' }, AuthService.getMe()),
        login: ({ commit }, user) =>
            settleQuery({ commit, mutation: 'getUserSuccess' }, AuthService.logIn(user)),
        logout: ({ commit }) => settleQuery({ commit, mutation: 'logOutSuccess' }, AuthService.logOut()),
    },
    mutations: {
        getUserSuccess(state, user) {
            state.loggedIn = true
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        updateUserSuccess(state, newUser) {
            state.user = newUser
        },
        logOutSuccess(state) {
            state.loggedIn = false
            state.user = null
            localStorage.removeItem('user')
            redirectToHome()
        },
    },
}

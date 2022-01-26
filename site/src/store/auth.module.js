import router from '@/router'
import AuthService from '../services/auth.service'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
    ? {
          status: { loggedIn: true },
          user,
      }
    : {
          status: { loggedIn: false },
          user: null,
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
            if (!state.status.loggedIn) {
                redirectToHome()
            }
        },
        login({ commit }, user) {
            return AuthService.login(user).then(
                (user) => {
                    commit('loginSuccess', user)
                    return Promise.resolve(user)
                },
                (error) => {
                    commit('loginFailure')
                    return Promise.reject(error)
                },
            )
        },
        logout({ commit }) {
            AuthService.logout()
            commit('logoutSuccess')
        },
        getUser({ commit }) {
            return AuthService.getUser().then(
                (response) => {
                    commit('getSuccess', response)
                    return Promise.resolve(response)
                },
                (error) => Promise.reject(error),
            )
        },
    },
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        loginFailure(state) {
            state.status.loggedIn = false
            state.user = null
            localStorage.removeItem('user')
        },
        logoutSuccess(state) {
            state.status.loggedIn = false
            redirectToHome()
            state.user = null
            localStorage.removeItem('user')
        },
        getSuccess(state, user) {
            state.me = user
        },
    },
}

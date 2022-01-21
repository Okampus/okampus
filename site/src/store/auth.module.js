import AuthService from '../services/auth.service'
import router from '@/router'

const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
    ? { status: { loggedIn: true }, user }
    : { status: { loggedIn: false }, user: null }

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login ({ commit }, user) {
            return AuthService.login(user).then(
                user => {
                    commit('loginSuccess', user)
                    return Promise.resolve(user)
                },
                error => {
                    commit('loginFailure')
                    return Promise.reject(error)
                }
            )
        },
        logout ({ commit }) {
            AuthService.logout()
            commit('logoutSuccess')
        },
        register ({ commit }, user) {
            return AuthService.register(user).then(
                response => {
                    commit('registerSuccess')
                    return Promise.resolve(response.data)
                },
                error => {
                    commit('registerFailure')
                    return Promise.reject(error)
                }
            )
        },
        getUser ({ commit }) {
            return AuthService.getUser().then(
                response => {
                    commit('fetchSuccess',response)
                    return  Promise.resolve(response)
                },
                error => {
                    return Promise.reject(error)
                }
            )

        }
    },
    mutations: {
        loginSuccess (state, user) {
            state.status.loggedIn = true
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        loginFailure (state) {
            state.status.loggedIn = false
            state.user = null
            localStorage.removeItem('user')
        },
        logoutSuccess (state) {
            state.status.loggedIn = false
            // TODO: Redirect any user-restricted route to '/'
            console.log(router.currentRoute.value.fullPath)
            if (router.currentRoute.value.fullPath !== '/') {
                router.push('/')
            }
            state.user = null
            localStorage.removeItem('user')
        },
        registerSuccess (state) {
            state.status.loggedIn = false
        },
        registerFailure (state) {
            state.status.loggedIn = false
        },
        fetchSuccess (state, user) {
            state.me = user
        }
    }
}

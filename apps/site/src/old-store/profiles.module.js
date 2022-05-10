import ProfilesService from '@/services/profiles.service'
import { uniqBy } from 'lodash'
import { ITEMS_PER_PAGE, settleQuery } from './constants'

const initialState = {
    currentUser: {
        user: null,
        socials: [],
        socialsPage: 1,
        clubs: [],
        clubsPage: 1,
    },
    users: [],
    usersPage: 1,
}

export const profiles = {
    namespaced: true,
    state: initialState,
    getters: { getUsers: (state) => state.users },
    actions: {
        getUsers: ({ commit, state }, query) =>
            settleQuery(
                { commit, mutation: 'getUsersSuccess' },
                ProfilesService.getUsers({
                    page: state.usersPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
            ),

        getCurrentUserProfile: async ({ dispatch }, userId) => {
            await Promise.all([
                dispatch('getCurrentUser', userId),
                dispatch('getCurrentUserSocials', { userId }),
                dispatch('getCurrentUserClubs', { userId }),
            ])
        },

        getCurrentUser: ({ commit }, userId) =>
            settleQuery({ commit, mutation: 'getCurrentUserSucces' }, ProfilesService.getUser(userId)),
        getCurrentUserClubs: ({ commit, state }, { userId, query = {} }) =>
            settleQuery(
                { commit, mutation: 'getCurrentUserClubsSuccess' },
                ProfilesService.getUserClubs(userId, {
                    page: state.clubsPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
            ),
        getCurrentUserSocials: ({ commit, state }, { userId, query = {} }) =>
            settleQuery(
                { commit, mutation: 'getCurrentUserSocialsSuccess' },
                ProfilesService.getUserSocials(userId, {
                    page: state.currentUser.socialsPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
            ),
    },
    mutations: {
        refreshUsers(state) {
            state.users = []
            state.usersPage = 1
        },
        getUsersSuccess(state, users) {
            state.users = uniqBy([...state.users, ...users], 'userId')
            state.usersPage++
        },

        refreshCurrentUser(state) {
            state.currentUser = {
                user: null,
                socials: [],
                socialsPage: 1,
                clubs: [],
                clubsPage: 1,
                favorites: [],
                favoritesPage: 1,
            }
        },
        getCurrentUserSucces(state, user) {
            state.currentUser.user = user
        },

        getCurrentUserClubsSuccess(state, clubs) {
            state.currentUser.clubs = uniqBy([...state.currentUser.clubs, ...clubs], 'clubId')
            state.currentUser.clubsPage++
        },
        getCurrentUserSocialsSuccess(state, socials) {
            state.currentUser.socials = uniqBy([...state.currentUser.socials, ...socials], 'socialId')
            state.currentUser.socialsPage++
        },
    },
}

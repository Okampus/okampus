// import { uniqBy } from 'lodash'
import UserService from '../services/user.service'
import ProfilesService from '@/services/profiles.service'
import { ITEMS_PER_PAGE, settleQuery } from './constants'
import { uniqBy } from 'lodash'

const initialState = {
    theme: JSON.parse(localStorage.getItem('themePreference')) === 'dark' ? 'dark' : 'light',
    enumClubs: [],
    enumSocials: [],
    clubs: [],
    clubsPage: 1,
    clubsLoaded: false,
    favorites: [],
    favoritesPage: 1,
    socialAccounts: [],
    socialAccountsPage: 1,
}

export const user = {
    namespaced: true,
    state: initialState,
    getters: {
        getTheme(state) {
            return state.theme
        },
        getEnumSocials: (state) => state.enumSocials,
        getCurrentUser: (state) => state.currentUser,
    },
    actions: {
        switchTheme({ state, commit }) {
            commit('setTheme', state.theme === 'dark' ? 'light' : 'dark')
        },

        getProfile: async ({ dispatch }) => {
            await Promise.all([
                dispatch('getEnumClubs'),
                dispatch('getEnumSocials'),
                dispatch('getClubs'),
                dispatch('getFavorites'),
                dispatch('getSocialAccounts'),
            ])
        },

        getEnumClubs: ({ commit }) =>
            settleQuery({ commit, mutation: 'getEnumClubsSuccess' }, UserService.getEnumClubs()),
        getEnumSocials: ({ commit }) =>
            settleQuery({ commit, mutation: 'getEnumSocialsSuccess' }, UserService.getEnumSocials()),

        updateUser: ({ commit }, newUser) =>
            settleQuery({ commit, mutation: 'auth/updateUserSuccess' }, UserService.updateUser(newUser)),

        getClubs: ({ commit, state, rootState }) =>
            settleQuery(
                { commit, mutation: 'getClubsSuccess' },
                ProfilesService.getUserClubs(rootState.auth.user.userId, {
                    page: state.clubsPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                }),
            ),

        getClubMembers: ({ commit, state }, clubId) =>
            settleQuery(
                { commit, mutation: 'getClubMembersSuccess' },
                UserService.getClubMembers(clubId, {
                    page: state.clubs.find((club) => club.clubId === clubId).membersPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                }),
            )
                ? state.clubs.find((club) => club.clubId === clubId)
                : null,

        addClubMember: ({ commit }, { clubId, userId }) =>
            settleQuery(
                { commit, mutation: 'addClubMemberSuccess' },
                UserService.addClubMember(clubId, userId),
            ),
        updateClubMember: ({ commit }, { clubId, userId, role }) =>
            settleQuery(
                { commit, mutation: 'updateClubMemberSuccess' },
                UserService.updateClubMember(clubId, userId, role),
            ),
        deleteClubMember: ({ commit }, { clubId, userId }) =>
            settleQuery(
                { commit, mutation: 'deleteClubMemberSuccess' },
                UserService.deleteClubMember({ clubId, userId }),
            ),

        getFavorites: ({ commit, state }) =>
            settleQuery(
                { commit, mutation: 'getFavoritesSuccess' },
                UserService.getFavorites({
                    page: state.favoritesPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                }),
            ),
        deleteFavorite: ({ commit }, favoriteId) =>
            settleQuery(
                { commit, mutation: 'deleteFavoriteSuccess' },
                UserService.deleteFavorite(favoriteId),
            ),

        getSocialAccounts: ({ commit, state, rootState }) =>
            settleQuery(
                { commit, mutation: 'getSocialAccountsSuccess' },
                ProfilesService.getUserSocials(rootState.auth.user.userId, {
                    page: state.socialAccountsPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                }),
            ),
        addSocialAccount: ({ commit }, { userId, socialId, pseudo, link }) =>
            settleQuery(
                { commit, mutation: 'addUserSocialSuccess' },
                UserService.addSocialAccount(userId, socialId, pseudo, link),
            ),
        updateSocialAccount: ({ commit }, { accountId, pseudo, link }) =>
            settleQuery(
                { commit, mutation: 'updateUserSocialSuccess' },
                UserService.updateSocialAccount(accountId, pseudo, link),
            ),
        deleteSocialAccount: ({ commit }, { accountId }) =>
            settleQuery(
                { commit, mutation: 'deleteUserSocialSuccess' },
                UserService.deleteSocialAccount(accountId),
            ),
    },
    mutations: {
        setTheme(state, theme) {
            state.theme = theme
            localStorage.setItem('themePreference', JSON.stringify(theme))
        },

        refreshClubs(state) {
            state.clubs = []
            state.clubsPage = 1
            state.clubsLoaded = false
        },
        getClubsSuccess(state, clubs) {
            state.clubsLoaded = true
            state.clubs = uniqBy(
                [
                    ...state.clubs,
                    ...clubs.map((club) => ({
                        ...club,
                        members: [],
                        membersPage: 1,
                    })),
                ],
                'clubId',
            )
            state.clubsPage++
        },

        getEnumClubsSuccess(state, clubs) {
            state.enumClubs = clubs
        },
        getEnumSocialsSuccess(state, socials) {
            state.enumSocials = socials
        },

        getFavoritesSuccess(state, favorites) {
            state.favorites = uniqBy([...state.favorites, ...favorites], 'favoriteId')
            state.favoritesPage++
        },
        deleteFavoriteSuccess(state, favoriteId) {
            state.favorites = state.favorites.filter((favorite) => favorite.favoriteId !== favoriteId)
        },

        addClubMemberSuccess(state, { clubId, user }) {
            const club = state.clubs.find((club) => club.clubId === clubId)
            club.members = uniqBy([...club.members, user], 'userId')
        },
        getClubMembersSuccess(state, { clubId, members }) {
            const club = state.clubs.find((club) => club.clubId === clubId)
            club.members = uniqBy([...club.members, ...members], 'userId')
            club.membersPage++
        },
        updateClubMemberSuccess(state, { clubId, user }) {
            const club = state.clubs.find((club) => club.clubId === clubId)
            const memberIndex = club.members.findIndex((member) => member.userId === user.userId)
            club.members[memberIndex] = user
        },
        deleteClubMemberSuccess(state, { clubId, userId }) {
            const club = state.clubs.find((club) => club.clubId === clubId)
            club.members = club.members.filter((member) => member.userId !== userId)
        },

        getSocialAccountsSuccess(state, socialAccounts) {
            state.socialAccounts = uniqBy([...state.socialAccounts, ...socialAccounts], 'socialId')
            state.socialAccountsPage++
        },
        addSocialAccountSuccess(state, socialAccount) {
            state.socialAccounts = uniqBy([...state.socialAccounts, socialAccount], 'socialId')
        },
        updateSocialAccountSuccess(state, socialAccount) {
            const socialAccountIndex = state.socialAccounts.findIndex(
                (social) => social.socialAccountId === socialAccount.socialAccountId,
            )
            if (socialAccountIndex !== -1) {
                state.socialAccounts[socialAccountIndex] = socialAccount
            }
        },
        deleteSocialAccountSuccess(state, socialAccountId) {
            state.socialAccounts = state.socialAccounts.filter(
                (socialAccount) => socialAccount.socialAccountId != socialAccountId,
            )
        },
    },
}

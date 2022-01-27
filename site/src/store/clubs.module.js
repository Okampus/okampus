// import { uniqBy } from 'lodash'
import ClubsService from '../services/clubs.service'
import { ITEMS_PER_PAGE, settleQuery } from './constants'

const initialState = {
    clubMemberList: {},
    clubList: [],
    userClubList: [],
    clubMembers: [],
}

export const clubs = {
    namespaced: true,
    state: initialState,
    actions: {
        getClubList: ({ commit, state }, query) =>
            settleQuery(
                { commit, mutation: 'getClubListSuccess' },
                ClubsService.getClubList({
                    page: state.threadListPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
            ),

        getClubMemberList: ({ commit, state }, query) =>
            settleQuery(
                { commit, mutation: 'getClubMemberListSuccess' },
                ClubsService.getClubMemberList({
                    page: state.threadListPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
            ),

        addClubMember: ({ commit }, { clubId, userId }) =>
            settleQuery(
                { commit, mutation: 'addClubMemberSuccess' },
                ClubsService.addClubMember(clubId, userId),
            ),

        updateClubMember: ({ commit }, { clubId, userId, role }) =>
            settleQuery(
                { commit, mutation: 'updateClubMemberSuccess' },
                ClubsService.updateClubMember(clubId, userId, role),
            ),

        deleteClubMember: ({ commit }, { clubId, userId }) =>
            settleQuery(
                { commit, mutation: 'deleteClubMemberSuccess' },
                ClubsService.deleteClubMember({ clubId, userId }),
            ),
    },
    mutations: {
        getClubListSuccess(state, clubs) {
            state.clubs = clubs
        },
        getUserClubListSuccess(state, userClubs) {
            state.userClubs = userClubs
        },
        getClubMemberListSuccess(state, success) {
            state.clubMembers = success
        },
        addClubMemberSuccess(state, success) {
            state.userClubs = [...state.userClubs, success]
        },
        deleteClubMemberSuccess(state, { clubId, userId }) {
            state.clubMembers = state.clubMembers.filter((a) => {
                if (a.user.userId != userId || a.club.clubId != clubId) {
                    return a
                }
            })
        },
        updateRoleSuccess(state, success) {
            state.clubMembers = state.clubMembers.map((a) =>
                a.clubMemberId === success.clubMemberId ? success : a,
            )
        },
        leaveClubSuccess(state, clubId) {
            state.userClubs = state.userClubs.filter((a) => {
                if (a.club.clubId !== clubId) {
                    return a
                }
            })
        },
    },
}

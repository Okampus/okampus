import { onData, onItems } from '@/utils/store'
import { defineStore } from 'pinia'
import $axios from '../shared/config/axios.config'

export const useClubsStore = defineStore('clubs', {
    state: () => ({
        clubs: [],
        userMemberships: [],
        userMembershipRequests: [],
        club: {},
    }),
    actions: {
        replaceClubs(clubs) {
            this.clubs = clubs
            return clubs
        },

        replaceUserMemberships(clubs) {
            this.userMemberships = clubs
            return clubs
        },

        replaceUserMembershipRequests(clubs) {
            this.userMembershipRequests = clubs
            return clubs
        },

        replaceClub(club) {
            this.club = club
            return club
        },

        async getClubs() {
            return await $axios
                .get('teams/teams', { params: { itemsPerPage: 100 } })
                .then(onItems(this.replaceClubs))
        },

        async getMembershipsOf(user) {
            return await $axios
                .get(`teams/memberships/${user.userId}`, { params: { itemsPerPage: 100 } })
                .then(onItems(this.replaceUserMemberships))
        },

        async getMembershipRequestsOf(user) {
            return await $axios
                .get(`teams/memberships/${user.userId}/requests`, { params: { itemsPerPage: 100 } })
                .then(onItems(this.replaceUserMembershipRequests))
        },

        async getClub(clubId) {
            return await $axios.get(`teams/teams/${clubId}`).then(onData(this.replaceClub))
        },

        async patchClub(clubId, props) {
            return await $axios.patch(`teams/teams/${clubId}`, props).then(onData(this.replaceClub))
        },

        async postMembershipRequest(clubId, data) {
            return await $axios.post(`teams/requests/${clubId}`, data).then((res) => res.data)
        },

        async patchMembership(teamId, userId, props) {
            return await $axios.patch(`teams/members/${teamId}/${userId}`, props).then((res) => res.data)
        },
    },
})

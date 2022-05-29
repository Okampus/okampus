import { onData, onItems } from '@/utils/store'
import { defineStore } from 'pinia'
import $axios from '../shared/config/axios.config'

export const useClubsStore = defineStore('clubs', {
    state: () => ({
        clubs: [],
        userMemberships: [],
        userMembershipRequests: [],
        clubMembershipRequests: [],
        club: {},
    }),
    actions: {
        replaceClubs(clubs) {
            this.clubs = clubs
            return clubs
        },

        replaceUserMemberships(memberships) {
            this.userMemberships = memberships
            return memberships
        },

        replaceUserMembershipRequests(requests) {
            this.userMembershipRequests = requests
            return requests
        },

        replaceClubMembershipRequests(requests) {
            this.clubMembershipRequests = requests
            return requests
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

        async getRequestsOfClub(clubId) {
            return await $axios
                .get(`teams/requests/${clubId}`)
                .then(onItems(this.replaceClubMembershipRequests))
        },

        async getClub(clubId) {
            return await $axios.get(`teams/teams/${clubId}`).then(onData(this.replaceClub))
        },

        async patchClub(clubId, data) {
            return await $axios.patch(`teams/teams/${clubId}`, data).then(onData(this.replaceClub))
        },

        async postMembershipRequest(clubId, data) {
            return await $axios.post(`teams/requests/${clubId}`, data).then((res) => res.data)
        },

        async patchMembership(teamId, userId, props) {
            return await $axios.patch(`teams/members/${teamId}/${userId}`, props).then((res) => res.data)
        },

        async handleRequest(requestId, data) {
            return await $axios.put(`teams/requests/${requestId}`, data).then((res) => res.data)
        },
    },
})

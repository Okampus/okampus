import { onData, onItems } from '@/utils/store'
import { defineStore } from 'pinia'
import $axios from '../shared/config/axios.config'

export const useClubsStore = defineStore('clubs', {
    state: () => ({
        clubs: [],
        userMemberships: [],
        userMembershipRequests: [],
        clubMembershipRequests: [],
        club: { files: [] },
        members: [],
        events: [],
        event: {},
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

        replaceClubMemberships(memberships) {
            this.members = memberships
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

        replaceEvents(events) {
            this.events = events
            return events
        },

        replaceEvent(event) {
            this.event = event
            return event
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

        async getMembershipsOfClub(clubId) {
            return await $axios
                .get(`teams/members/${clubId}`)
                .then(onItems(this.replaceClubMembershipRequests))
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

        async getTeamEvents(clubId) {
            return await $axios.get(`teams/events?teamId=${clubId}`).then(onItems(this.replaceEvents))
        },

        async joinEvent(eventId) {
            return await $axios.post(`teams/events/${eventId}/registrations`).then((res) => res.data)
        },
        async unregisterEvent(eventId) {
            return await $axios.delete(`teams/events/${eventId}/registrations`).then((res) => res.data)
        },
        async getEvents() {
            return await $axios.get('teams/events').then(onItems(this.replaceEvents))
        },
        async createEvent(teamId, data) {
            return await $axios.post(`teams/events/${teamId}`, data).then((res) => res.data)
        },
        async getEvent(eventId) {
            return await $axios.get(`teams/events/${eventId}`).then(onData(this.replaceEvent))
        },
        async getEventGuests(eventId) {
            return await $axios.get(`teams/events/${eventId}/registrations`).then((res) => res.data)
        },

        replaceFiles(request) {
            this.club.files = request
            return request
        },

        async getClubFiles(teamId) {
            return await $axios
                .get('/files/team-files', { params: { teamId, itemsPerPage: 100 } })
                .then(onItems(this.replaceFiles))
        },

        async postClubFile(teamId, type, file, description = null) {
            const formData = new FormData()

            formData.append('file', file)
            formData.append('description', description)
            formData.append('type', type)
            formData.append('teamId', teamId)

            return await $axios.post('/files/team-files', formData).then(onData(this.club.files.push))
        },

        async deleteClubFile(teamFileId) {
            return await $axios
                .delete(`/files/team-files/${teamFileId}`)
                .then(
                    () =>
                        (this.club.files = this.club.files.filter((file) => file.teamFileId !== teamFileId)),
                )
        },
    },
})

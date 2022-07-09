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
        forms: {},
        form: {},
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

        replaceForms(forms) {
            this.forms = forms
            return forms
        },

        replaceForm(form) {
            this.form = form
            return form
        },

        modifyEvents({ eventId, data }) {
            this.events[this.events.findIndex((event) => event.teamEventId === eventId)] = data
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

        async removeMembership(teamId, userId) {
            return await $axios.delete(`teams/members/${teamId}/${userId}`).then((res) => res.data)
        },

        async getMembersOfClub(clubId) {
            return await $axios.get(`teams/members/${clubId}`).then(onItems(this.replaceClubMemberships))
        },

        async handleRequest(requestId, data) {
            return await $axios.put(`teams/requests/${requestId}`, data).then((res) => res.data)
        },

        async getTeamEvents(teamId) {
            return await $axios.get('teams/events', { params: { teamId } }).then(onItems(this.replaceEvents))
        },

        async joinEvent(eventId, data) {
            return await $axios.post(`teams/event-registrations/${eventId}`, data).then((res) => res.data)
        },
        async unregisterEvent(registrationId) {
            return await $axios.delete(`teams/event-registrations/${registrationId}`).then((res) => res.data)
        },
        async getEvents(query) {
            return await $axios.get('teams/events', { params: query }).then(onItems(this.replaceEvents))
        },
        async patchEvents(eventId, data) {
            return await $axios
                .patch(`teams/events/${eventId}`, data)
                .then(onData(this.modifyEvents, { eventId }))
        },
        async createEvent(teamId, data) {
            return await $axios.post(`teams/events/${teamId}`, data).then((res) => res.data)
        },
        async getEvent(eventId) {
            return await $axios.get(`teams/events/${eventId}`).then(onData(this.replaceEvent))
        },
        async getEventGuests(eventId) {
            return await $axios.get(`teams/event-registrations?eventId=${eventId}`).then((res) => res.data)
        },

        replaceClubFiles(request) {
            this.club.files = request
            return request
        },

        replaceClubsFiles({ teamId, items }) {
            this.clubs.find((club) => club.teamId === teamId).files = items
        },

        async getClubFiles(teamId, type) {
            return await $axios
                .get('/files/team-files', { params: { teamId, type, itemsPerPage: 100 } })
                .then(onItems(this.replaceClubFiles))
        },

        async getClubsFiles(type) {
            for (const teamId of this.clubs.map((club) => club.teamId)) {
                await $axios
                    .get('/files/team-files', { params: { teamId, type, itemsPerPage: 100 } })
                    .then(onItems(this.replaceClubsFiles, { teamId }))
            }
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

        async getForms(clubId, isTemplate) {
            return await $axios
                .get(`teams/forms?teamId=${clubId}&isTemplate=${isTemplate}`)
                .then(onItems(this.replaceForms))
        },

        async getForm(formId) {
            return await $axios.get(`teams/forms/${formId}`).then(onData(this.replaceForm))
        },

        async postForm(clubId, data) {
            return await $axios.post(`teams/forms/${clubId}`, data).then(onData(this.replaceForm))
        },

        async patchForm(formId, data) {
            return await $axios.patch(`teams/forms/${formId}`, data).then(onData(this.replaceForm))
        },
    },
})

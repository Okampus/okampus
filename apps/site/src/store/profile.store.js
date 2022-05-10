import { defineStore } from 'pinia'
import $axios from '../shared/config/axios.config'

export const useProfilesStore = defineStore('profile', {
    state: () => ({
        user: null,
        contacts: [],
        clubs: [],
    }),
    actions: {
        replaceUser(user) {
            this.user = user
            return user
        },
        replaceContacts(contacts) {
            this.contacts = contacts
            return contacts
        },
        replaceClubs(clubs) {
            this.clubs = clubs
            return clubs
        },
        async getUser(userId) {
            return await $axios.get(`users/${userId}`).then((res) => this.replaceUser(res.data))
        },
        async getContacts(userId) {
            return await $axios.get(`contacts/users/${userId}`).then((res) => this.replaceContacts(res.data))
        },
        async getClubs(userId) {
            return await $axios.get(`teams/memberships/${userId}`).then((res) => this.replaceClubs(res.data))
        },
        async getClubsList() {
            return await $axios.get('teams/teams').then((res) => res.data)
        },
        async getContactsTypes() {
            return await $axios.get('/contacts').then((res) => res.data)
        },
        async patchUser(props) {
            return await $axios.patch('users', props).then((res) => this.replaceUser(res.data))
        },
        async postContact({ contactId, link, pseudo }) {
            return await $axios
                .post('/contacts/users', { contactId, link, pseudo })
                .then((res) => this.replaceContacts(...this.contacts, res))
        },
        async getMembershipsRequests(clubId) {
            return await $axios.get(`/teams/requests/${clubId}?state=pending`).then((res) => res.data)
        },
        async getMembers(clubId) {
            return await $axios.get(`/teams/members/${clubId}`).then((res) => res.data)
        },
        async acceptMembershipRequest(requestId) {
            return await $axios
                .patch(`/teams/requests/${requestId}/`, { state: 'approved' })
                .then((res) => res.data)
        },
        async removeMember(userId, clubId) {
            return await $axios.delete(`teams/members/${clubId}/${userId}`).then((res) => res.data)
        },
        // async patchContact(contact) {
        //     return await $axios.patch()
        // },
    },
})

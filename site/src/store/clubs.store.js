import { defineStore } from 'pinia'
import $axios from '../shared/config/axios.config'

export const useClubsStore = defineStore('clubs', {
    state: () => ({
        clubs: [],
        club: {},
    }),
    actions: {
        replaceClubs(clubs) {
            this.clubs = clubs
            return clubs
        },
        replaceClub(club) {
            this.club = club
            return club
        },
        async getClubs() {
            return await $axios.get('teams/teams').then((res) => this.replaceClubs(res.data))
        },
        async getClub(clubId) {
            return await $axios.get(`teams/teams/${clubId}`).then((res) => this.replaceClub(res.data))
        },
        async postMembershipRequest(clubId) {
            return await $axios.post(`teams/requests/${clubId}`).then((res) => res.data)
        },
        // async patchUser(props) {
        //     return await $axios.patch('users', props).then((res) => this.replaceUser(res.data))
        // },
        // async postContact({ contactId, link, pseudo }) {
        //     return await $axios
        //         .post('/contacts/users', { contactId, link, pseudo })
        //         .then((res) => this.replaceContacts(...this.contacts, res))
        // },
        // async patchContact(contact) {
        //     return await $axios.patch()
        // },
    },
})

import { defineStore } from 'pinia'
import { onData } from '@/utils/store'
import $axios from '@/shared/config/axios.config'

export const useMetricsStore = defineStore('metrics', {
    state: () => ({
        clubCount: [],
        eventCount: [],
        membershipCount: [],
        createdEventCount: [],
        uniqueMembershipCount: [],
    }),
    actions: {
        replaceClubCount(clubCount) {
            this.clubCount = clubCount
            return clubCount
        },
        replaceEventCount(eventCount) {
            this.eventCount = eventCount
            return eventCount
        },
        replaceMembershipCount(membershipCount) {
            this.membershipCount = membershipCount
            return membershipCount
        },
        replaceCreatedEventCount(createdEventCount) {
            this.createdEventCount = createdEventCount
            return createdEventCount
        },
        replaceUniqueMembershipCount(uniqueMembershipCount) {
            this.uniqueMembershipCount = uniqueMembershipCount
            return uniqueMembershipCount
        },
        async getClubCount(after, before) {
            return await $axios
                .get('metrics', { name: 'clubCount', after, before })
                .then(onData(this.replaceClubCount))
        },
        async getEventCount(after, before) {
            return await $axios
                .get('metrics', { name: 'eventCount', after, before })
                .then(onData(this.replaceEventCount))
        },
        async getMembershipCount(after, before) {
            return await $axios
                .get('metrics', { name: 'membershipCount', after, before })
                .then(onData(this.replaceMembershipCount))
        },
        async getCreatedEventCount(after, before) {
            return await $axios
                .get('metrics', { name: 'eventCount', after, before })
                .then(onData(this.replaceCreatedEventCount))
        },
        async getUniqueMembershipCount(after, before) {
            return await $axios
                .get('metrics', { name: 'uniqueMembershipCount', after, before })
                .then(onData(this.replaceUniqueMembershipCount))
        },
    },
})

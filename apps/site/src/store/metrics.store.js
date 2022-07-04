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
        async getClubCount(after, before, interval) {
            return await $axios
                .get('teams/metrics', { params: { name: 'clubCount', after, before, interval } })
                .then(onData(this.replaceClubCount))
        },
        async getEventCount(after, before, interval) {
            return await $axios
                .get('teams/metrics', { params: { name: 'eventCount', after, before, interval } })
                .then(onData(this.replaceEventCount))
        },
        async getMembershipCount(after, before, interval) {
            return await $axios
                .get('teams/metrics', { params: { name: 'membershipCount', after, before, interval } })
                .then(onData(this.replaceMembershipCount))
        },
        async getCreatedEventCount(after, before, interval) {
            return await $axios
                .get('teams/metrics', { params: { name: 'eventCount', after, before, interval } })
                .then(onData(this.replaceCreatedEventCount))
        },
        async getUniqueMembershipCount(after, before, interval) {
            return await $axios
                .get('teams/metrics', { params: { name: 'uniqueMembershipCount', after, before, interval } })
                .then(onData(this.replaceUniqueMembershipCount))
        },
    },
})

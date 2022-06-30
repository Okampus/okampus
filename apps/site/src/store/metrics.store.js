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
        async getClubCount() {
            return await $axios.get('metrics/clubCount').then(onData(this.replaceClubCount))
        },
        async getEventCount() {
            return await $axios.get('metrics/eventCount').then(onData(this.replaceEventCount))
        },
        async getMembershipCount() {
            return await $axios.get('metrics/membershipCount').then(onData(this.replaceMembershipCount))
        },
        async getCreatedEventCount() {
            return await $axios.get('metrics/createdEventCount').then(onData(this.replaceCreatedEventCount))
        },
        async getUniqueMembershipCount() {
            return await $axios
                .get('metrics/uniqueMembershipCount')
                .then(onData(this.replaceUniqueMembershipCount))
        },
    },
})

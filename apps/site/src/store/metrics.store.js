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
        userCount: [],
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
        replaceUserCount(userCount) {
            this.userCount = userCount
            return userCount
        },
        async getClubCount(after, before, interval) {
            return await $axios
                .get('metrics', { params: { name: 'clubCount', after, before, interval } })
                .then(onData(this.replaceClubCount))
        },
        async getEventCount(after, before, interval) {
            return await $axios
                .get('metrics', { params: { name: 'clubEventCount', after, before, interval } })
                .then(onData(this.replaceEventCount))
        },
        async getMembershipCount(after, before, interval) {
            return await $axios
                .get('metrics', { params: { name: 'clubMembershipCount', after, before, interval } })
                .then(onData(this.replaceMembershipCount))
        },
        async getCreatedEventCount(after, before, interval) {
            return await $axios
                .get('metrics', { params: { name: 'clubCreatedEventCount', after, before, interval } })
                .then(onData(this.replaceCreatedEventCount))
        },
        async getUniqueMembershipCount(after, before, interval) {
            return await $axios
                .get('metrics', { params: { name: 'clubUniqueMembershipCount', after, before, interval } })
                .then(onData(this.replaceUniqueMembershipCount))
        },
        async getUserCount(after, before, interval) {
            return await $axios
                .get('metrics', { params: { name: 'userCount', after, before, interval } })
                .then(onData(this.replaceUserCount))
        },
    },
})

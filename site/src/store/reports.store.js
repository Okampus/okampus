import $axios from '@/shared/config/axios.config'
import { defineStore } from 'pinia'

import { onData, onItems } from '@/utils/store'
import { useThreadsStore } from './threads.store'

export const useReportsStore = defineStore('reports', {
    state: () => ({
        reports: [],
    }),
    actions: {
        replaceReports(reports) {
            this.reports = reports
            return reports
        },
        replaceReport(report) {
            const index = this.reports.findIndex((r) => r.reportId === report.reportId)
            if (index !== -1) {
                this.reports[index] = report
            } else {
                this.reports.push(report)
            }

            return report
        },
        // upsertReport(report) {
        //     this.reports = upsert(this.reports, report, 'reportId')
        //     return report
        // },
        removeReport(reportId) {
            this.reports = this.reports.filter((report) => report.reportId !== reportId)
            return true
        },

        async getReports(query) {
            return await $axios.get('reports', { params: query }).then(onItems(this.replaceReports))
        },

        async addReport(userId, report) {
            return await $axios.post(`reports/${userId}`, report).then(
                onData((data) => {
                    this.replaceReport(data)
                    useThreadsStore().addInteraction(null, 'reports', {
                        content: { contentId: report.contentId },
                    })
                }),
            )
        },
        async getReport(id) {
            return await $axios.get(`reports/${id}`).then(onData(this.replaceReport))
        },
        async updateReport(report) {
            return await $axios.patch(`reports/${report.reportId}`, report).then(onData(this.replaceReport))
        },
        async deleteReport(id) {
            return await $axios.delete(`reports/${id}`).then(onData(this.removeReport))
        },
    },
})

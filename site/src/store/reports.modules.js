import { uniqBy } from 'lodash'
import ReportsService from '../services/reports.service'
import { ITEMS_PER_PAGE, settleQuery } from './constants'

const initialState = {
    currentReport: null,
    reportList: [],
    reportListPage: 1,
}

export const reports = {
    namespaced: true,
    state: initialState,
    getters: {
        getCurrentReport: (state) => state.currentReport,
        getReportList: (state) => state.reportList,
    },
    actions: {
        getReportList: ({ commit, state }, query) =>
            settleQuery(
                { commit, mutation: 'getReportListSuccess' },
                ReportsService.getReportList({
                    page: state.reportListPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
            ),
        getReport: ({ commit }, id) => settleQuery(commit, ReportsService.getReport(id), 'getReportSuccess'),
        addReport: ({ commit }, { userId, contentId, reason }) =>
            settleQuery(
                { commit, mutation: 'addReportSuccess' },
                ReportsService.addReport(userId, { contentId, reason }),
            ),
        updateReport: ({ commit }, { id, newReason }) =>
            settleQuery(
                { commit, mutation: 'updateReportSuccess' },
                ReportsService.updateReport(id, newReason),
            ),
    },
    mutations: {
        refreshReportList(state) {
            state.reportList = []
            state.reportListPage = 1
        },
        getReportListSuccess(state, reports) {
            state.reportList = uniqBy([...state.reportList, ...reports], 'reportId')
            state.reportListPage += 1
        },
        getReportSuccess(state, report) {
            state.currentReport = report
        },
        addReportSuccess(state, report) {
            state.reportList.push(report)
        },
        updateReportSuccess(state, report) {
            if (state.currentReport.id === report.id) {
                state.currentReport = report
            }

            const index = state.reportList.findIndex((r) => r.id === report.id)
            if (index !== -1) {
                state.reportList[index] = report
            }
        },
    },
}

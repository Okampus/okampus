import { uniqBy } from 'lodash'
import ReportsService from '../services/reports.service'
import { ITEMS_PER_PAGE, settleQuery } from './constants'

const initialState = {
    currentReport: null,
    reportsList: [],
    reportsListPage: 1,
}

export const reports = {
    namespaced: true,
    state: initialState,
    actions: {
        getReportList: ({ commit, state }, query) =>
            settleQuery(
                commit,
                ReportsService.getReports({
                    page: state.reportsListPage,
                    itemsPerPage: ITEMS_PER_PAGE,
                    ...query,
                }),
                'getReportListSuccess',
            ),
        getReport: ({ commit }, id) => settleQuery(commit, ReportsService.getReport(id), 'getReportSuccess'),
        addReport: ({ commit }, { userId, contentId, reason }) =>
            settleQuery(commit, ReportsService.addReport(userId, { contentId, reason }), 'addReportSuccess'),
        updateReport: ({ commit }, { id, newReason }) =>
            settleQuery(commit, ReportsService.updateReport(id, newReason), 'updateReportSuccess'),
    },
    mutations: {
        getReportListSuccess(state, reports) {
            state.reportsList = uniqBy([...state.reports, ...reports], 'reportId')
            state.reportsListPage += 1
        },
        getReportSuccess(state, report) {
            state.currentReport = report
        },
        addReportSuccess(state, report) {
            state.reports.push(report)
        },
        updateReportSuccess(state, report) {
            if (state.currentReport.id === report.id) {
                state.currentReport = report
            }

            const index = state.reports.findIndex((r) => r.id === report.id)
            if (index !== -1) {
                state.reports[index] = report
            }
        },
    },
}

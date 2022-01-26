import $axios from '../shared/config/axios.config'

class ReportsService {
    async getReportList(query) {
        return await $axios.get('reports', { params: query }).then((res) => res.data.items)
    }

    async getReport(id) {
        return await $axios.get(`reports/${id}`).then((res) => res.data)
    }

    async addReport(userId, report) {
        return await $axios.post(`reports/${userId}`, report).then((res) => res.data)
    }

    async updateReport(id, newReason) {
        return await $axios.patch(`reports/${id}`, { newReason }).then((res) => res.data)
    }
}

export default new ReportsService()

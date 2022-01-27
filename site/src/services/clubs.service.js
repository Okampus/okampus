import $axios from '../shared/config/axios.config'

class ClubsService {
    async getClubList() {
        return await $axios.get('clubs/names').then((res) => res.data)
    }

    async getUserClubList(userId) {
        return await $axios.get(`clubs/member/${userId}`).then((res) => res.data.items)
    }

    async getClubMemberList(clubId) {
        return await $axios.get(`clubs/${clubId}/members`).then((res) => res.data.items)
    }

    async addClubMember(clubId, userId) {
        return $axios.post(`clubs/${clubId}/members/${userId}`, { role: 'member' }).then((res) => res.data)
    }

    deleteClubMember({ clubId, userId }) {
        return $axios.delete(`clubs/${clubId}/members/${userId}`)
    }

    async updateClubMember(clubId, userId, role) {
        return await $axios.patch(`clubs/${clubId}/members/${userId}`, { role }).then((res) => res.data)
    }
}

export default new ClubsService()

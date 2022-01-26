import $axios from '../shared/config/axios.config'

class UsersService {
    async getUserById(userId) {
        return await $axios.get(`users/${userId}`).then((res) => res.data)
    }

    async getUserSocials(userId) {
        return await $axios.get(`socials/user/${userId}`).then((res) => res.data)
    }

    async getSocials() {
        return await $axios.get('socials').then((res) => res.data)
    }

    async getClubs() {
        return await $axios.get('clubs/names').then((res) => res.data)
    }

    async getUserClubs(userId) {
        return await $axios.get(`clubs/member/${userId}`).then((res) => res.data.items)
    }

    async updateUser(newUser) {
        return await $axios.patch('users/update', newUser).then((res) => res.data)
    }

    async addSocialAccount({ userId, socialId, pseudo, link }) {
        return await $axios
            .post(`socials/user/${userId}/${socialId}`, { pseudo, link })
            .then((res) => res.data)
    }

    async updateSocialAccount({ socialAccountId, pseudo, link }) {
        return await $axios.patch(`socials/user/${socialAccountId}`, { pseudo, link }).then((res) => res.data)
    }

    deleteSocialAccount(socialAccountId) {
        return $axios.delete(`socials/user/${socialAccountId}`, { withCredentials: true })
    }

    async getFavorites() {
        return await $axios.get('favorites').then((res) => res.data)
    }

    async getClubMembers(clubId) {
        return await $axios.get(`clubs/${clubId}/members`).then((res) => res.data.items)
    }

    async addClubMember({ clubId, userId }) {
        return $axios.post(`clubs/${clubId}/members/${userId}`, { role: 'member' }).then((res) => res.data)
    }

    deleteClubMember({ clubId, userId }) {
        return $axios.delete(`clubs/${clubId}/members/${userId}`)
    }

    async updateMemberRole({ clubId, userId, role }) {
        return await $axios.patch(`clubs/${clubId}/members/${userId}`, { role }).then((res) => res.data)
    }

    async getUsers() {
        return await $axios.get('users').then((res) => res.data.items)
    }
}

export default new UsersService()

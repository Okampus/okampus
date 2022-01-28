import $axios from '../shared/config/axios.config'

class UserService {
    async getEnumClubs() {
        return await $axios.get('clubs/names').then((res) => res.data)
    }
    async getEnumSocials() {
        return await $axios.get('socials').then((res) => res.data)
    }

    async updateUser(newUser) {
        return await $axios.patch('users/update', newUser).then((res) => res.data)
    }

    async getClubMembers(clubId, query) {
        return await $axios.get(`clubs/${clubId}/members`, { params: query }).then((res) => res.data.items)
    }
    async addClubMember(clubId, userId) {
        return $axios.post(`clubs/${clubId}/members/${userId}`, { role: 'member' }).then((res) => res.data)
    }
    async updateClubMember(clubId, userId, role) {
        return await $axios.patch(`clubs/${clubId}/members/${userId}`, { role }).then((res) => res.data)
    }
    deleteClubMember({ clubId, userId }) {
        return $axios.delete(`clubs/${clubId}/members/${userId}`)
    }

    deleteFavorite(favoriteId) {
        return $axios.delete(`favorites/${favoriteId}`)
    }

    async addSocialAccount(userId, socialId, pseudo, link) {
        return await $axios
            .post(`socials/user/${userId}/${socialId}`, { pseudo, link })
            .then((res) => res.data)
    }
    async updateSocialAccount(accountId, pseudo, link) {
        return await $axios.patch(`socials/account/${accountId}`, { pseudo, link }).then((res) => res.data)
    }

    deleteSocialAccount(accountId) {
        return $axios.delete(`socials/user/${accountId}`)
    }

    async getFavorites(query) {
        return await $axios.get('favorites', { params: query }).then((res) => res.data.items)
    }
}

export default new UserService()

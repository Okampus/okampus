import $axios from '../shared/config/axios.config'

class ProfilesService {
    async getUsers(query) {
        return await $axios.get('users', { params: query }).then((res) => res.data.items)
    }

    async getUser(userId) {
        return await $axios.get(`users/${userId}`).then((res) => res.data)
    }

    async getUserClubs(userId, query) {
        return await $axios.get(`clubs/member/${userId}`, { params: query }).then((res) => res.data.items)
    }

    async getUserSocials(userId, query) {
        return await $axios.get(`socials/user/${userId}`, { params: query }).then((res) => res.data)
    }
}

export default new ProfilesService()

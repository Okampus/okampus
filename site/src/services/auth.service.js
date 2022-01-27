import $axios from '../shared/config/axios.config'
class AuthService {
    async login(user) {
        const res = await $axios.post('auth/login', {
            username: user.username,
            password: user.password,
        })

        return res.data
    }

    logout() {
        $axios.get('auth/logout', { withCredentials: true })
    }

    getUser(query) {
        return $axios.get('auth/me', { params: query }).then((res) => res.data)
    }
}

export default new AuthService()

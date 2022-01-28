import $axios from '../shared/config/axios.config'
class AuthService {
    async getMe(query) {
        return $axios.get('auth/me', { params: query }).then((res) => res.data)
    }

    async logIn(user) {
        return await $axios
            .post('auth/login', {
                username: user.username,
                password: user.password,
            })
            .then((res) => res.data)
    }

    logOut() {
        $axios.get('auth/logout')
    }
}

export default new AuthService()

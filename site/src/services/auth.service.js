import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/auth/`

class AuthService {
    async login(user) {
        const res = await axios.post(
            API_URL + 'login',
            {
                username: user.username,
                password: user.password,
            },
            {
                withCredentials: true,
                credentials: 'include',
            },
        )

        return res.data
    }

    logout() {
        axios.get(API_URL + 'logout', {
            withCredentials: true,
            credentials: 'include',
        })
    }

    register(user) {
        return axios.post(
            API_URL + 'register',
            {
                username: user.username,
                email: user.email,
                password: user.password,
            },
            {
                withCredentials: true,
                credentials: 'include',
            },
        )
    }
    getUser(query) {
        return axios
            .get(API_URL + 'me', {
                params: query,
                withCredentials: true,
            })
            .then((res) => res.data)
    }
}

export default new AuthService()

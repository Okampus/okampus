import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/`

class UserService {
    getPublicContent () {
        return axios.get(API_URL + 'posts', { withCredentials: true })
    }

    getUserBoard () {
        return axios.get(API_URL + 'users', { withCredentials: true })
    }
}

export default new UserService()

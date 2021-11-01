import axios from 'axios'

const API_URL = 'http://localhost:5000/'

class UserService {
  getPublicContent () {
    return axios.get(API_URL + 'posts', { withCredentials: true })
  }

  getUserBoard () {
    return axios.get(API_URL + 'users', { withCredentials: true })
  }
}

export default new UserService()

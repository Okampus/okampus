import axios from 'axios'


const API_URL = `${import.meta.env.API_URL}/auth/`

class AuthService {
  async login (user) {
    const res = await axios
      .post(API_URL + 'login', {
        username: user.username,
        password: user.password
      }, {
        withCredentials: true,
        credentials: 'include'
      })

    localStorage.setItem('user', JSON.stringify(res.data))
    return res.data
  }

  logout () {
    axios.get(API_URL + 'logout', { withCredentials: true, credentials: 'include' })
    localStorage.removeItem('user')
  }

  register (user) {
    return axios.post(API_URL + 'register', {
      username: user.username,
      email: user.email,
      password: user.password
    }, {
      withCredentials: true,
      credentials: 'include'
    })
  }
}

export default new AuthService()

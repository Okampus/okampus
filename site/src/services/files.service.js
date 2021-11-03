import axios from 'axios'

const API_URL = `http://localhost:${process.env.VUE_APP_API_PORT}/files/`

class PostsService {
  getStudyDocs (query) {
    return axios.get(API_URL + 'study-docs/search', { params: query, withCredentials: true }).then(
      res => res.data.items
    )
  }

  addStudyDoc (data) {
    return axios.post(API_URL + 'study-docs/upload', data, { withCredentials: true })
  }
}

export default new PostsService()

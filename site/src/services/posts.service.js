import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/`

class PostsService {
    getPosts (query) {
        return axios.get(API_URL + 'posts', { params: query, withCredentials: true }).then(
            res => res.data.items
        )
    }

    addPost (post) {
        return axios.post(API_URL + 'posts', post, { withCredentials: true }).then(
            res => res.data
        )
    }

    modifyPost (id, newPost) {
        return axios.patch(API_URL + 'posts', { id, newPost }, { withCredentials: true }).then(
            res => res.data
        )
    }

    deletePost (id) {
        return axios.delete(API_URL + 'posts', { params: { id }, withCredentials: true })
    }
}

export default new PostsService()

import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/`

class PostsService {
    getPosts (query) {
        return axios.get(API_URL + 'posts', { params: query, withCredentials: true }).then(
            res => res.data.items
        )
    }

    addPost (post) {
        for (const tag of post.tags) {
            axios.post(API_URL + 'tags', {color: 'orange', name: tag}, { withCredentials: true })
        }

        return axios.post(API_URL + 'posts', { ...post, assignees: [] }, { withCredentials: true }).then(
            res => res.data
        )
    }

    deletePost (id) {
        return axios.delete(API_URL + 'posts', { params: { id }, withCredentials: true })
    }
}

export default new PostsService()
